import { tryOnMounted, useCurrentElement } from '@vueuse/core'
import { viewSymbol } from '@/symbols'

export function useInitView<T extends arcgis.View>(ViewClass: T) {
  const vm = getCurrentInstance()!
  const el = useCurrentElement<HTMLDivElement>()
  const view = shallowRef<InstanceType<T>>()
  provide(viewSymbol, view)

  tryOnMounted(() => {
    console.assert(el.value, '不能有多个根节点')
    // @ts-ignore
    view.value = markRaw(
      new ViewClass({
        container: el.value,
      })
    )
    console.log(view)

    watchEffect(() => {
      Object.assign(
        view.value!,
        // @ts-ignore
        vm.proxy!.$props.properties
      )
    })
    view.value!.when(() => {
      vm.proxy!.$emit('when', view!)
    })
  })

  return view
}
