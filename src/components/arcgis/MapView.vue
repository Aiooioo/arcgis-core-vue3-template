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
import MapView from '@arcgis/core/views/MapView.js'
import { useInitView } from './hooks'
import View from './View.vue'

defineOptions({
  extends: View,
})

defineProps<{
  properties?: __esri.MapViewProperties
}>()
defineEmits<{
  when: [view: __esri.MapView]
}>()
const view = $(useInitView(MapView))

defineExpose({
  view,
})
</script>

<style scoped></style>
