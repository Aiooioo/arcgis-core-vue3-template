<template>
  <div class="w-full p-2">
    <n-form label-width="auto">
      <n-form-item label="最低点海拔(m)">
        <n-input-number v-model:value="form.minHeight" style="width: 100%" />
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button ghost type="info" @click="getMinHeight">
              <template #icon>
                <n-icon>
                  <picon-local />
                </n-icon>
              </template>
            </n-button>
          </template>
          点击地图获取高程
        </n-tooltip>
      </n-form-item>
      <n-form-item label="淹没高度">
        <n-input-number v-model:value="form.height" class="w-full" />
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button ghost type="info" @click="getHeight">
              <template #icon>
                <n-icon>
                  <picon-local />
                </n-icon>
              </template>
            </n-button>
          </template>
          点击地图获取高程
        </n-tooltip>
      </n-form-item>
      <n-form-item label="淹没速度(m/s)">
        <n-input-number v-model:value="form.floodSpeed" class="w-full" />
      </n-form-item>
      <n-form-item label-width="0">
        <div class="w-full flex flex-col justify-between gap-4">
          <n-button type="info" style="width: 100%" @click="draw">
            绘制范围
          </n-button>
          <n-button type="success" style="width: 100%" @click="floodAnalysis">
            开始分析
          </n-button>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import Polygon from '@arcgis/core/geometry/Polygon'
import { useView } from '@/hooks'

const view = useView()

console.log(view)

const graphicLyr = new GraphicsLayer()
onUnmounted(() => {
  view.map.remove(graphicLyr)
  graphicLyr.destroy()
})
view.map.add(graphicLyr)
const sketchVM = new SketchViewModel({
  layer: graphicLyr,
  view,
})

const form = reactive({
  minHeight: 0,
  height: 0,
  floodSpeed: 10,
  geometry: null,
})

function draw() {
  graphicLyr.removeAll()
  sketchVM.create('polygon', { hasZ: false })
}

function pickElevation() {
  return new Promise<number>((resolve, reject) => {
    const handler = view.on('click', (event) => {
      const point = view.toMap({ x: event.x, y: event.y })
      resolve(point.z)
      handler.remove()
    })
  })
}

async function getMinHeight() {
  form.minHeight = await pickElevation()
}
async function getHeight() {
  form.height = (await pickElevation()) - form.minHeight
}
// 渐变高度动画
function heigheAnimation(
  clock: Date,
  graphics: __esri.Polygon[],
  time: Date,
  height: number
) {
  requestAnimationFrame((c) => {
    graphics.forEach((graphic) => {
      // eslint-disable-next-line no-param-reassign
      graphic.symbol = {
        type: 'polygon-3d', // autocasts as new PolygonSymbol3D()
        symbolLayers: [
          {
            type: 'extrude', // autocasts as new ExtrudeSymbol3DLayer()
            size: ((c - clock) / time) * height, // Height of the extrusion in meters
            material: { color: [0, 240, 255, 0.7] },
          },
        ],
      }
    })
    if (c - clock < time) {
      heigheAnimation(clock, graphics, time, height)
    }
  })
}
// 淹没分析
function floodAnalysis() {
  const { minHeight, height, floodSpeed } = form
  const time = (height / floodSpeed) * 1000
  const graphics = graphicLyr.graphics.items
  graphics.forEach((graphic) => {
    // eslint-disable-next-line no-param-reassign
    graphic.geometry = new Polygon({
      hasZ: true,
      rings: graphic.geometry.rings[0].map(([x, y]) => [x, y, minHeight]),
      spatialReference: view.spatialReference,
    })
  })
  heigheAnimation(performance.now(), graphics, time, height)
}

defineExpose({
  graphicLyr,
})
</script>

<style lang="scss" scoped></style>
