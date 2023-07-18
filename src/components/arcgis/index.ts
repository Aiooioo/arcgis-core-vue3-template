import { WatchSource } from 'vue'
import Collection from '@arcgis/core/core/Collection.js'
import Layer from '@arcgis/core/layers/Layer'

export function sync<L extends object, R extends object>(
  getObj: () => L,
  deps: R,
  {
    immediate = true,
    direction = 'rtl',
    deep = false,
    transform: {
      ltr = (left: L[keyof L]) => left as unknown as R[keyof R],
      // @ts-ignore
      rtl = (right) => right,
      remove = (oVal: L[keyof L], o: L) => {
        if (o instanceof Collection) {
          o.remove(oVal)
        }
        // if (
        //   typeof oVal === 'object' &&
        //   oVal !== null &&
        //   'destroy' in oVal &&
        //   typeof oVal.destroy === 'function'
        // ) {
        //   oVal.destroy()
        // }
      },
      add = (rVal: L[keyof L], o: L, key: keyof L) => {
        if (o instanceof Collection) {
          o.add(rVal, key as number)
          return
        }
        o[key] = rVal
      },
    } = {},
  }: arcgis.SyncOptions<L, R> = {}
) {
  const scope = effectScope()
  scope.run(() => {
    let oDeps = {} as R
    watch(
      () => deps,
      (nVal) => {
        const nDeps = isRef(nVal) ? { value: nVal.value } : nVal
        const set = new Set(Object.keys(nDeps))
        Object.keys({ ...oDeps }).forEach((key) => {
          set.delete(key)
        })
        set.forEach((key) => {
          if (direction === 'ltr' || direction === 'both') {
            // watch(dep, (v) => {
            //   const r = ltr(v)
            //   Object.assign(obj, r)
            // })
          }
          if (direction === 'rtl' || direction === 'both') {
            const cleanup = watch(
              () => deps[key as keyof R],
              (r, ov) => {
                const obj = getObj()
                const l = rtl(r)
                if (ov !== undefined) {
                  remove(
                    // @ts-ignore
                    (obj instanceof Collection ? obj.items : obj)[
                      key as keyof L
                    ],
                    obj,
                    key as keyof L
                  )
                }
                if (r === undefined) {
                  cleanup()
                } else {
                  add(l, obj, key as keyof L)
                }
              },
              {
                immediate,
                deep,
              }
            )
          }
        })
        oDeps = { ...nDeps }
      },
      {
        immediate: true,
        deep: true,
      }
    )
  })
  return { stop: scope.stop }
}

export function dep<
  O extends object,
  R extends
    | {
        [key in keyof O]?: WatchSource
      }
    | object
>(
  source: (view: arcgis.ViewInstance) => O,
  d: R,
  options?: arcgis.SyncOptions<O, R>
): arcgis.Dep<O, R> {
  // @ts-ignore
  return [source, d, options]
}

export function layersDep(layers: Array<arcgis.LayerDep>) {
  return [
    dep((view) => view.map.layers, layers, {
      transform: {
        rtl: (r) => {
          if ('layerClass' in r) {
            // eslint-disable-next-line new-cap
            return new r.layerClass(r)
          }
          return Layer.fromArcGISServerUrl(r)
        },
        add: async (r, o, key) => {
          o.add(await r, key)
        },
      },
    }),
  ]
}
