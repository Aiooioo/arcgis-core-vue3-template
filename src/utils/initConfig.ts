import ISysConfig from 'public/config/sysConfig.json'
import ITheme from 'public/config/theme.json'

type DeepPartial<T> = T extends object
  ? T extends Array<unknown>
    ? T
    : { [P in keyof T]?: DeepPartial<T[P]> }
  : T

export const [sysConfig, theme] = (await Promise.all(
  ['./config/sysConfig.json', './config/theme.json'].map(async (url) =>
    (await fetch(url)).json()
  )
)) as [typeof ISysConfig, DeepPartial<typeof ITheme>]
