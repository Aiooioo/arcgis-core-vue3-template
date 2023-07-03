// .vuepress/config.ts
import { defineUserConfig } from 'vuepress'
import { hopeTheme } from 'vuepress-theme-hope'

export default defineUserConfig({
  theme: hopeTheme({
    // 此处放置主题配置
    sidebar: ['/index.md', '/test/index.md'],
  }),
})
