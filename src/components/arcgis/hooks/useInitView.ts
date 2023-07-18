import { tryOnMounted, useCurrentElement } from '@vueuse/core'
import { viewSymbol } from '@/symbols'
import { sync } from '@/components/arcgis'

export function useInitView<T extends arcgis.View>(ViewClass: T) {
  const vm = getCurrentInstance()!
  const { $props } = vm.proxy!
  const el = useCurrentElement<HTMLDivElement>()
  const view = shallowRef<InstanceType<T>>()
  provide(viewSymbol, view)

  if (!('properties' in $props)) {
    throw new Error('仅能在MapView或SceneView中使用')
  }

  tryOnMounted(() => {
    // @ts-ignore
    view.value = markRaw(
      new ViewClass({
        container: el.value,
      })
    )
    sync(view.value, $props.properties as arcgis.ViewProperties)

    view.value.when(() => {
      vm.proxy!.$emit('when', view.value)
    })
  })

  return view
}
