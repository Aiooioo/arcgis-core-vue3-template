<template>
  <g-win-box>
    <g-win-box direction="vertical">
      <scene-view :properties="properties1" />
      <map-view :properties="properties1" />
    </g-win-box>
    <g-win-box direction="vertical">
      <scene-view :properties="properties1" />
      <map-view :properties="properties1" />
    </g-win-box>
  </g-win-box>
</template>

<script setup lang="ts">
import SceneView from '@/components/arcgis/SceneView.vue'
import MapView from '@/components/arcgis/MapView.vue'
import '@arcgis/core/assets/esri/themes/light/main.css'

const camera = new Proxy(
  {
    position: {
      latitude: 47.2529,
      longitude: 110.4443,
      z: 500, // altitude in meters
    },
    tilt: 0,
    heading: 0,
  },
  {
    // get(target, key) {
    //   console.log(target, key)
    //   return target[key]
    // },
    // set(target, key, value) {
    //   target[key] = value
    //   return true
    // },
  }
)

const properties1 = shallowReactive({
  map: {
    basemap: 'satellite',
  },
  center: [110.4443, 47.2529],
  zoom: 10,
  // camera,
} satisfies ConstructorParameters<arcgis.View>[0])

console.log(properties1)

definePage({
  name: 'view',
  path: '/view',
})
</script>
