<template>
  <g-win-box>
    <g-win-box direction="vertical">
      <arcgis-view
        :view-class="viewClass"
        :properties="properties1"
        :deps="deps"
        @when="when"
      >
        <w-flood />
      </arcgis-view>
      <arcgis-view
        :deps="deps"
        :view-class="MapView"
        :properties="properties1"
      />
    </g-win-box>
    <g-win-box direction="vertical">
      <!-- <arcgis-view
        :deps="deps"
        :view-class="SceneView"
        :properties="properties1"
      /> -->
      <arcgis-view
        :deps="deps"
        :view-class="MapView"
        :properties="properties1"
      />
    </g-win-box>
  </g-win-box>
</template>

<script setup lang="ts">
// import SceneView from '@/components/arcgis/SceneView.vue'
// import MapView from '@/components/arcgis/MapView.vue'
import '@arcgis/core/assets/esri/themes/light/main.css'
import MapView from '@arcgis/core/views/MapView.js'
import SceneView from '@arcgis/core/views/SceneView.js'
import { Ref } from 'vue'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import Layer from '@arcgis/core/layers/Layer.js'
import WFlood from '@/components/arcgis/widgets/WFlood.vue'
import ArcgisView from '@/components/arcgis/ArcgisView.vue'
import { dep } from '@/components/arcgis'

const viewClass = ref(SceneView)
console.log(viewClass, MapView)

const camera = reactive({
  position: {
    latitude: 47.2529,
    longitude: 110.4443,
    z: 500, // altitude in meters
  },
  tilt: 0,
  heading: 0,
})

const properties1 = reactive({
  map: {
    basemap: 'satellite',
  },
  center: [-110.4443, 47.2529],
  zoom: 3,
  // camera,
} satisfies ConstructorParameters<arcgis.View>[0])

console.log(properties1)

const layers = reactive([
  {
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
  },
  // {
  //   // The layer id is specified in the URL
  //   url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1',
  // },
])

console.log(layers)

const deps = reactive([
  dep((view) => view.map.layers, layers, {
    transform: {
      rtl: (r) => {
        return new FeatureLayer(r)
      },
    },
    deep: true,
  }),
] as arcgis.Dep[])

function when(view: Ref<InstanceType<arcgis.View>>) {
  console.log(view)
}

definePage({
  name: 'view',
  path: '/view',
})
</script>
