import '@vue/runtime-core'
import 'vue-router'

export {}

declare module '@vue/runtime-core' {}

declare module 'vue-router' {
  interface RouteMeta {
    // // 是可选的
    // isAdmin?: boolean
    // // 每个路由都必须声明
    // requiresAuth: boolean
  }
}
