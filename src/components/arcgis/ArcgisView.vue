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
import { viewSymbol } from '@/symbols'
import { sync, layersDep, dep } from '@/components/arcgis'

const {
  viewClass,
  properties = {},
  deps = [],
  layers = [],
} = $defineProps<{
  properties?: arcgis.ViewProperties
  deps?: arcgis.Dep[]
  layers?: arcgis.LayerDep[]
  viewClass: arcgis.View
}>()
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
          return markRaw(
            new r({
              container: el.value,
              ...properties,
            })
          )
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
    // @ts-ignore
    $emit('when', view)
  })
})

defineExpose({
  view,
})
</script>

<style scoped></style>
