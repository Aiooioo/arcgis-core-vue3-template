function arcgisTrack(){}


export function arcgisRef(obj: unknown, fn: (view: arcgis.View) => void) {
  if (typeof obj !== 'object' || obj === null) {
    return ref(obj)
  }
  return customRef((track, trigger) => {
    return {
      get() {
        if (!('__accessor__' in obj)) {
          track()
        }
        return obj
      },
      set(newValue) {
        Object.assign(obj, newValue)
        trigger()
      },
    }
  })
}
