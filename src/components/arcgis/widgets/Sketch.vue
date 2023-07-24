<template>
  <!-- <n-button>标绘</n-button> -->
  <div ref="theSketch" />
</template>
<script setup lang="ts">
import Sketch from '@arcgis/core/widgets/Sketch.js'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js'
import MapView from '@arcgis/core/views/MapView.js'
import SceneView from '@arcgis/core/views/SceneView.js'
import Graphic from '@arcgis/core/Graphic.js'
import { useView } from '@/components/arcgis/hooks'

const {
  viewClass,
  // properties = {},
  // deps = [],
  // layers = [],
} = $defineProps<{
  // properties?: arcgis.ViewProperties
  // deps?: arcgis.Dep[]
  // layers?: arcgis.LayerDep[]
  viewClass: arcgis.View
}>()

const view = $(useView())
const theSketch = ref()

const graphicsLayer = new GraphicsLayer({
  // graphics: [graphicA]
  elevationInfo: 'on-the-ground',
})

const Widget = new Sketch({
  creationMode: 'single',
  view,
})

const geometry = ref()
onBeforeUnmount(() => {
  Widget.destroy()
  graphicsLayer?.removeAll()
})
onMounted(() => {
  Widget.view = view
  Widget.container = theSketch.value
  Widget.layer = graphicsLayer
  Widget.visibleElements = {
    // createTools: {
    //   point: false,
    //   polyline: false,
    // },
    selectionTools: {
      'lasso-selection': false,
    },
    settingsMenu: false,
  }
  Widget.on('update', (event) => {
    Widget.cancel()
  })
  Widget.on('create', (event) => {
    if (event.state === 'complete') {
      graphicsLayer.removeAll()
      geometry.value = event.graphic.geometry
      if (viewClass === SceneView) {
        graphicsLayer.add(
          new Graphic({
            geometry: event.graphic.geometry,
            symbol: {
              type: 'polygon-3d',
              // style: 'none',
              symbolLayers: [
                {
                  type: 'fill', // autocasts as new FillSymbol3DLayer()
                  material: { color: [65, 102, 161, 0.65] },
                  outline: {
                    width: 5,
                    color: 'black',
                    patternCap: 'round',
                  },
                },
              ],
            },
          })
        )
      } else if (viewClass === MapView) {
        graphicsLayer.add(
          new Graphic({
            geometry: event.graphic.geometry,
            symbol: {
              type: 'simple-fill',
              // style: 'none',
              symbolLayers: [
                {
                  type: 'fill', // autocasts as new FillSymbol3DLayer()
                  material: { color: [65, 102, 161, 0.65] },
                  outline: {
                    width: 5,
                    color: 'black',
                    patternCap: 'round',
                  },
                },
              ],
            },
          })
        )
        view.map.add(graphicsLayer)
      }
      graphicsLayer.remove(event.graphic)
    }
  })
})
defineExpose({ geometry })

// Listen to sketch widget's create event.
// sketch.on('create', function (event) {
//   // check if the create event's state has changed to complete indicating
//   // the graphic create operation is completed.
//   if (event.state === 'complete') {
//     // remove the graphic from the layer. Sketch adds
//     // the completed graphic to the layer by default.
//     graphicsLayer.remove(event.graphic)

//     // use the graphic.geometry to query features that intersect it
//     selectFeatures(event.graphic.geometry)
//   }
// })
</script>
