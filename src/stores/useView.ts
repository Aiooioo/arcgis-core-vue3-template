import { toRaw, markRaw } from 'vue'

const views = []
let active
export const useView = defineStore('useView', {
  state: () => {
    return {
      viewMap: new Map(), // view
      mapKey: '',
    }
  },

  getters: {
    activeView(state) {
      return (key = 'default') => {
        return state.viewMap.get(key)
      }
    },
    activeViewInstance(state) {
      return state.viewMap.get(this.mapKey)
    },
  },

  actions: {
    setView(view: object, key = 'default') {
      views.push(view)
      this.syncViewpoit(views)
      this.mapKey = key
      return this.viewMap.set(key, markRaw(view))
    },
    getView(key = 'default') {
      return this.viewMap.get(key)
    },
    removeView(key = 'default') {
      return this.viewMap.delete(key)
    },
    resetView() {
      this.viewMap.clear()
    },
    // 同步视图
    syncViewpoit(views) {
      const sync = (source) => {
        if (!active || !active.viewpoint || active !== source) {
          return
        }
        for (const view of views) {
          if (view !== active) {
            view.viewpoint = active.viewpoint
          }
        }
      }
      for (const view of views) {
        view.watch(['interacting', 'animation'], () => {
          active = view
          sync(active)
        })

        view.watch('viewpoint', () => sync(view))
      }
    },
    // 添加多视图数据
    addSyncData(cb) {
      this.viewMap.forEach((view) => {
        cb?.(view)
      })
    },
    // 移除多视图数据
    removeSyncData(cb) {
      this.viewMap.forEach((view) => {
        cb?.(view)
      })
    },
  },
})
