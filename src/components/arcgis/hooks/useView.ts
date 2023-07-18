import { Ref } from 'vue'
import { viewSymbol } from '@/symbols'

export function useView<
  T extends Ref<InstanceType<arcgis.View> | undefined>
>(): T {
  const view = inject(viewSymbol)
  // @ts-ignore
  return view
}
