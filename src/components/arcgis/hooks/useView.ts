import { viewSymbol } from '@/symbols'

export function useView<T extends __esri.SceneView | __esri.MapView>(): T {
  const view = inject(viewSymbol)
  // @ts-ignore
  return view.value
}
