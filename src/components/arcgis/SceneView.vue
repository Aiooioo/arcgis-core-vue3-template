<template>
  <div class="relative">
    <div
      v-if="view"
      class="pointer-events-none absolute left-0 top-0 h-full w-full [&>*]:pointer-events-auto"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneView from '@arcgis/core/views/SceneView.js'
import { useInitView } from './hooks'
import View from './View.vue'

defineOptions({
  extends: View,
})

defineProps<{
  properties?: __esri.SceneViewProperties
}>()
defineEmits<{
  when: [view: __esri.SceneView]
}>()
const view = $(useInitView(SceneView))

defineExpose({
  view,
})
</script>

<style scoped></style>
