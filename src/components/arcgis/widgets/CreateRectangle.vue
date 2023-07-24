<template>
  <n-button type="primary" style="margin-left: 10px" @click="clickOn"
    >四边形</n-button
  >
</template>
<script setup lang="ts">
import Sketch from '@arcgis/core/widgets/Sketch.js'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js'
import MapView from '@arcgis/core/views/MapView.js'
import SceneView from '@arcgis/core/views/SceneView.js'
import Graphic from '@arcgis/core/Graphic.js'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel.js'
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
const geometry = ref()

const pointSymbol = {
  type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
  color: [226, 119, 40],
}

const graphicsLayer = new GraphicsLayer({
  // graphics: [graphicA]
  elevationInfo: 'on-the-ground',
})

view?.map.add(graphicsLayer)

const clickOn = () => {
  if (viewClass === MapView) {
    // console.log(1)

    const sketchVM = new SketchViewModel({
      view,
      layer: graphicsLayer,
      // pointSymbol,
    })
    sketchVM.create('rectangle')
    sketchVM.on('create', function (event) {
      // console.log(event)
      console.log(1)
      if (event.state === 'complete') {
        console.log(event.graphic)
        graphicsLayer.add(event.graphic)
        console.log(graphicsLayer)
      }
    })
  } else if (viewClass === SceneView) {
    // console.log(2)
    // view?.map.add(graphicsLayer)
    const sketchVM = new SketchViewModel({
      view,
      layer: graphicsLayer,
      // pointSymbol,
      // defaultCreateOptions: {
      //   hasZ: true, // default value
      // },
      // defaultUpdateOptions: {
      //   enableZ: true, // default value
      // },
    })
    sketchVM.create('rectangle')
    sketchVM.on('create', function (event) {
      console.log(2)
      // console.log(event)
      if (event.state === 'complete') {
        graphicsLayer.add(event.graphic)
        console.log(graphicsLayer)
      }
    })
  }
}
</script>
