<template>
  <div />
</template>

<script setup lang="ts">
import MapView from '@arcgis/core/views/MapView.js'

defineProps({
  map: Object,
})

onMounted(() => {
  const view = new MapView({
    map: props.map,
    container: document.createElement('div'),
  })
  view.when(() => {
    view.goTo({
      center: [-118.805, 34.027],
      zoom: 13,
    })
  })
})
</script>

<style scoped></style>
