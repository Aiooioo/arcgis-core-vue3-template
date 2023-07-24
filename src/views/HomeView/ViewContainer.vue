<template>
  <n-button @click="addView(testName)">新增</n-button>
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
        v-for="item in viewArr"
        :key="item"
        :deps="deps"
        :view-class="viewClass"
        :properties="properties1"
      >
        <n-button
          style="margin-left: 60px; margin-top: 15px"
          type="primary"
          @click="changeView"
          >切换</n-button
        >
        <n-button
          style="margin-left: 10px; margin-top: 15px"
          type="primary"
          @click="deleteView(item)"
          >删除</n-button
        >
        <!-- <n-button style="margin-left: 10px; margin-top: 15px" type="primary"
          >点</n-button
        >
        <n-button style="margin-left: 10px; margin-top: 15px" type="primary"
          >线</n-button
        >
        <n-button style="margin-left: 10px; margin-top: 15px" type="primary"
          >面</n-button
        > -->
        <!-- <sketch :view-class="viewClass" /> -->
        <create-point :view-class="viewClass" />
        <create-polygon :view-class="viewClass" />
        <create-rectangle :view-class="viewClass" />
        <create-circle :view-class="viewClass" />
        <create-line :view-class="viewClass" />
      </arcgis-view>
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
import Sketch from '@/components/arcgis/widgets/Sketch.vue'
import CreatePoint from '@/components/arcgis/widgets/CreatePoint.vue'
import CreatePolygon from '@/components/arcgis/widgets/CreatePolygon.vue'
import CreateLine from '@/components/arcgis/widgets/CreateLine.vue'
import CreateRectangle from '@/components/arcgis/widgets/CreateRectangle.vue'
import CreateCircle from '@/components/arcgis/widgets/CreateCircle.vue'

const viewClass = ref(SceneView)
const viewArr = ref(['test', 'test'])
const testName = ref(1)
console.log(viewClass, MapView)

const changeView = () => {
  if (viewClass.value === MapView) {
    viewClass.value = SceneView
    // console.log(1)
  } else if (viewClass.value === SceneView) {
    viewClass.value = MapView
    // console.log(2)
  }
  // console.log(3)
}

const addView = (name) => {
  testName.value += 1
  viewArr.value.push(name)
}

const deleteView = (name) => {
  viewArr.value.splice(viewArr.value.indexOf(name), 1)
}

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
