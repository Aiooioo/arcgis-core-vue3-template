import type { ReadonlyDeep } from 'type-fest'
import defSysConfig from '@/asset/config/sysConfig.json'
import defITheme from '@/asset/config/theme.json'

const defConfig = {
  sysConfig: defSysConfig,
  theme: defITheme,
}
/* const pubConfig = {}
await Promise.all(
  ['sysConfig', 'theme'].map(async (url) => {
    const res = await (await fetch(`./config/${url}.json`)).json()
    pubConfig[url] = res
    return res
  })
)
Object.keys(defConfig).forEach((key) => {
  defConfig[key] = { ...defConfig[key], ...pubConfig[key] }
}) */
function deepMerge(target: any, other: any) {
  const targetToString = Object.prototype.toString.call(target)
  const otherToString = Object.prototype.toString.call(target)
  if (
    targetToString === '[object Object]' &&
    otherToString === '[object Object]'
  ) {
    for (const [key, val] of Object.entries(other)) {
      if (!target[key]) {
        target[key] = val
      } else {
        target[key] = deepMerge(target[key], val)
      }
    }
  } else if (
    targetToString === '[object Array]' &&
    otherToString === '[object Array]'
  ) {
    for (const [key, val] of Object.entries(other)) {
      if (target[key]) {
        target[key] = deepMerge(target[key], val)
      } else {
        target.push(val)
      }
    }
  }
  return target
}

function assignDeep<T extends object, U extends T>(target: T, source: U): T {
  Object.entries(target).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // @ts-ignore
      assignDeep(value, source[key])
    } else if (key in source) {
      // @ts-ignore
      target[key] = source[key]
    }
  })
  return target
}

export const [sysConfig, theme] = (await Promise.all(
  ['sysConfig', 'theme'].map(async (url) =>
    /*   assignDeep(
      await (await fetch(`./config/${url}.json`)).json(),
      // @ts-ignore
      defConfig[url]
    ) */
    deepMerge(
      await (await fetch(`./config/${url}.json`)).json(),
      // @ts-ignore
      defConfig[url]
    )
  )
)) as [ReadonlyDeep<typeof defSysConfig>, ReadonlyDeep<typeof defITheme>]
console.log(defConfig, '--defConfig', sysConfig)
export { defConfig }
