export {}
declare global {
  declare namespace arcgis {
    type WatchSource = import('vue').WatchSource

    export type View = typeof __esri.SceneView | typeof __esri.MapView
    export type ViewProperties =
      | __esri.SceneViewProperties
      | __esri.MapViewProperties
    export type ViewInstance = InstanceType<View>

    export type LayerDep =
      | __esri.LayerFromArcGISServerUrlParams
      | (__esri.UnknownLayerProperties & {
          layerClass: typeof __esri.UnknownLayer
        })

    export interface SyncOptions<
      L extends object,
      R extends {
        [key in keyof L]?: WatchSource
      }
    > {
      /**
       * Watch deeply
       *
       * @default false
       */
      deep?: boolean
      /**
       * Sync values immediately
       *
       * @default true
       */
      immediate?: boolean
      /**
       * Direction of syncing. Value will be redefined if you define syncConvertors
       *
       * @default 'rtl'
       */
      direction?: 'ltr' | 'rtl' | 'both'
      /**
       * Custom transform function
       */
      transform?: {
        ltr?: (left: L[keyof L]) => R[keyof R]
        rtl?: (
          right: R extends Array ? R[number] : R[keyof R]
        ) => L[R extends Array ? number : keyof R]
        remove?: (oVal: L[keyof L], obj: L, key: keyof L) => void
        add?: (
          rVal: L[R extends Array ? number : keyof R],
          obj: L,
          key: keyof L
        ) => void
        export?: (obj: L) => R
      }
    }

    export type Dep<
      O extends object = object,
      R = {
        [key in keyof O]?: WatchSource
      }
    > = [(view: arcgis.ViewInstance) => O, R, SyncOptions<O, R>?]
  }
}
