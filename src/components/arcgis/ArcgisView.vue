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
import { tryOnMounted, useCurrentElement, watchArray } from '@vueuse/core'
import { Ref } from 'vue'
import Map from '@arcgis/core/Map'
import WebMap from '@arcgis/core/WebMap'
import WebScene from '@arcgis/core/WebScene'
import { viewSymbol } from '@/symbols'
import { sync, layersDep, dep } from '@/components/arcgis'
import basemapCreator from '@/map/basemap-creator.js'

const {
  viewClass,
  properties = {},
  deps = [],
  layers = [],
  baseMaps = [],
} = $defineProps<{
  properties?: arcgis.ViewProperties
  deps?: arcgis.Dep[]
  layers?: arcgis.LayerDep[]
  viewClass: arcgis.View
  baseMaps
}>()
console.log(deps, '--deps')
const $emit = defineEmits<{
  when: [view: Ref<arcgis.ViewInstance>]
}>()
const view = ref<arcgis.ViewInstance>()
provide(viewSymbol, view)

const el = useCurrentElement<HTMLDivElement>()

const scopeMap = new WeakMap()

const dependencies = computed(() => {
  // console.log(layersDep(layers))
  let map: __esri.Map | null = null
  return [
    dep(() => view, $$(viewClass), {
      immediate: true,
      transform: {
        rtl: (r) => {
          console.log(properties, '--properties')
          const _view = new r({
            container: el.value,
            ...properties.initialViewpoint,
          })
          if (properties.map) {
            basemapCreator.createBasemap(properties.map.basemap).then((res) => {
              _view.map.basemap = res
            })
          } else if (properties.webmap) {
            map = new WebMap({
              portalItem: {
                id: properties.webmap,
              },
            })
          } else if (properties.webscene) {
            map = new WebScene({
              portalItem: {
                id: properties.webscene,
              },
            })
          }
          /*  return markRaw(
            new r({
              container: el.value,
              ...properties,
            })
          ) */
          return markRaw(_view)
        },
        remove(oVal, obj) {
          map = obj.value!.map
        },
        add(rVal, obj, key) {
          obj.value = rVal
          if (map) {
            obj.value!.map = map
          }
        },
      },
    }),
    dep((v) => v, properties, {
      immediate: true,
    }),
    ...deps,
    ...layersDep(layers),
  ]
})

tryOnMounted(() => {
  watchArray(
    () => dependencies.value,
    (newList, oldList, added, removed) => {
      added.forEach(([getObj, dep, options]) => {
        scopeMap.set(
          dep,
          sync(() => getObj(view.value!), dep, options)
        )
      })
      removed?.forEach(([, dep]) => {
        scopeMap.get(dep)?.stop()
      })
    },
    { immediate: true }
  )
  view.value!.when(() => {
    if (baseMaps?.length) {
      baseMaps.forEach((item) => {
        basemapCreator.createBasemap(item).then((res) => {
          // view.value.map.basemap = res
        })
      })
    }
    // @ts-ignore
    $emit('when', view)
  })
})
function destroy() {
  const popup = view.value?.popup
  view.popup = null
  const { map } = view.value
  view.value.map = null
  view.value?.destroy()
}
onUnmounted(() => {
  destroy()
})
defineExpose({
  view,
  destroy,
})
</script>

<style scoped></style>
