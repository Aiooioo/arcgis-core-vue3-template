import Basemap from '@arcgis/core/Basemap'
import * as arcgisLayerUrl from '@arcgis/core/layers/support/arcgisLayerUrl'
import BaseTileLayer from '@arcgis/core/layers/BaseTileLayer'
import layerCreator from '@/map/layer-creator'

const FALLBACK_BASEMAP_ID = 'satellite'

export default {
  createBasemapLayerFromObject(configObj) {
    return layerCreator.createFromConfig(configObj)
  },

  createBasemapLayersFromArray(configArray) {
    return Promise.all(
      configArray.map((item) => this.createBasemapLayerFromObject(item))
    )
  },
  /**
   * 创建baseMap
   * */
  async createBasemap(basemapCfg) {
    let basemap
    if (basemapCfg.type === 'URLtemplate') {
      const TintLayer = BaseTileLayer.createSubclass({
        properties: {
          urlTemplate: null,
        },
        // generate the tile url for a given level, row and column
        getTileUrl(level, row, col) {
          return this.urlTemplate
            .replace('{z}', level + 1)
            .replace('{x}', col)
            .replace('{y}', row)
        },
      })
      basemap = new Basemap({
        baseLayers: await Promise.all(
          basemapCfg.layers.map(async (layer) => {
            if (layer.urlTemplate) {
              return new TintLayer({
                ...layer,
              })
            }
            return await layerCreator.createFromConfig({
              url: layer.url,
            })
          })
        ),
      })
    } else if (basemapCfg.id) {
      if (basemapCfg.id.startsWith('tdt-')) {
        const baseLayers = layerCreator.createTdtLayers(
          basemapCfg.id.substring(4)
        )

        basemap =
          baseLayers && baseLayers.length > 0
            ? new Basemap({
                baseLayers,
              })
            : Basemap.fromId(FALLBACK_BASEMAP_ID)
      } else {
        basemap = Basemap.fromId(basemapCfg.id)
      }
    } else if (basemapCfg.url) {
      if (arcgisLayerUrl.isArcGISUrl(basemapCfg.url)) {
        const baseLayer = await layerCreator.createFromConfig({
          url: basemapCfg.url,
        })

        basemap = baseLayer
          ? new Basemap({
              baseLayers: [baseLayer],
            })
          : Basemap.fromId(FALLBACK_BASEMAP_ID)
      }
    } else if (Array.isArray(basemapCfg.layers)) {
      basemap = new Basemap({
        baseLayers: await this.createBasemapLayersFromArray(basemapCfg.layers),
      })
    }
    return basemap
  },
}
