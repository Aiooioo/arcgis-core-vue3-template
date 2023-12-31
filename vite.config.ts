// @ts-ignore
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {
  NaiveUiResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver,
} from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
// @ts-ignore
import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
// @ts-ignore
import { openCodeServer, addCodeLocation } from '@guijixing/vue-code-link'
import VueMacros from 'unplugin-vue-macros/vite'
// @ts-ignore
import UnpluginSvgComponent from 'unplugin-svg-component/vite'
import UnoCSS from 'unocss/vite'
import UnpluginGlob from 'unplugin-glob/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { dynamicBase } from 'vite-plugin-dynamic-base'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
// import ConfigPlugin from 'unplugin-config/vite'
// vite.config.js
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/__dynamic_base__/' : '/',
  build: {
    target: 'esnext',
    // sourcemap: 'inline',
  },
  plugins: [
    ...(process.env.NODE_ENV === 'development'
      ? [addCodeLocation(), openCodeServer()]
      : []),
    // ConfigPlugin({
    //   disabledConfig: false,
    //   globConfigFileName: 'config.json',
    //   outputDir: '/public/config',
    //   envConfigPrefix: 'VITE_',
    // }),
    UnpluginGlob({
      // targets to resolve
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      exclude: [/\.d\.ts$/],

      root: '/',

      // Filepath to generate corresponding .d.ts files.
      // Defaults to both './glob.d.ts' and 'glob-global.d.ts' when provided `true`.
      // Set `false` to disable.
      dts: './types/auto/glob', // boolean or string
    }),
    dynamicBase({
      // dynamic public path var string, default window.__dynamic_base__
      publicPath: 'window.__dynamic_base__',
      // dynamic load resources on index.html, default false. maybe change default true
      transformIndexHtml: false,
    }),
    VueDevTools(),
    UnoCSS(),
    Icons({ autoInstall: true, compiler: 'vue3', jsx: 'preact' }),
    VueRouter({
      // Folder(s) to scan for vue components and generate routes. Can be a string, or
      // an object, or an array of those. Each option allows to override global options.
      // like exclude, extensions, etc.
      routesFolder: 'src/views',

      // allowed extensions for components to be considered as pages
      // can also be a suffix: e.g. `.page.vue` will match `home.page.vue`
      // but remove it from the route path
      extensions: ['.vue'],

      // list of glob files to exclude from the routes generation
      // e.g. ['**/__*'] will exclude all files and folders starting with `__`
      // e.g. ['**/__*/**/*'] will exclude all files within folders starting with `__`
      // e.g. ['**/*.component.vue'] will exclude components ending with `.component.vue`
      exclude: [],

      // Path for the generated types. Defaults to `./typed-router.d.ts` if typescript
      // is installed. Can be disabled by passing `false`.
      dts: './types/auto/typed-router.d.ts',

      // Override the name generation of routes. unplugin-vue-router exports two versions:
      // `getFileBasedRouteName()` (the default) and `getPascalCaseRouteName()`. Import any
      // of them within your `vite.config.ts` file.
      // getRouteName: (routeNode) => myOwnGenerateRouteName(routeNode),

      // Customizes the default langage for `<route>` blocks
      // json5 is just a more permissive version of json
      routeBlockLang: 'json5',

      // Change the import mode of page components. Can be 'async', 'sync', or a function with the following signature:
      // (filepath: string) => 'async' | 'sync'
      importMode: 'async',
    }),
    VueMacros({
      setupBlock: true,
      defineOptions: true,
      shortEmits: true,
      hoistStatic: true,
      defineSlots: true,
      defineModels: true,
      namedTemplate: false,
      exportProps: false,

      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.setup\.[cm]?[jt]sx?$/],
          reactivityTransform: true,
          template: {
            compilerOptions: {
              nodeTransforms: [],
              isCustomElement: (tag) => tag.startsWith('un-'),
            },
          },
        }),
        vueJsx: vueJsx(),
      },
    }),
    UnpluginSvgComponent({
      iconDir: 'src/asset/svgIcon',
      projectType: 'vue',
      dts: true,
      dtsDir: './types/auto',
      prefix: 'svg',
    }),

    Components({
      dts: './types/auto/component.d.ts',
      // dirs: ['src/components/system/*.vue'],
      // extensions: ['vue', 'jsx', 'tsx', 'js', 'ts'],
      // Glob patterns to match file names to be detected as components.
      // When specified, the `dirs` and `extensions` options will be ignored.
      // globs: ['src/components/system/*.vue', 'src/utils/components/*.vue'],
      allowOverrides: true,
      version: 3,
      resolvers: [
        NaiveUiResolver(),
        VueUseComponentsResolver(),
        VueUseDirectiveResolver(),
        IconsResolver({ prefix: 'i' }),
        {
          type: 'component',
          resolve: (name) => {
            if (name.startsWith('G')) {
              return {
                name: 'default',
                from: `@g/components/${name.slice(1)}.vue`,
              }
            }
            return null
          },
        },
      ],
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        VueRouterAutoImports,
        'pinia',
        // '@vueuse/core',
        // '@vueuse/math',
        // '@vueuse/head',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
          '/src/utils/initConfig.ts': ['sysConfig', 'theme'],
          // '[package-name]': [
          //   '[import-names]',
          //   // alias
          //   ['[from]', '[alias]'],
          // ],
        },
      ],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: './types/auto/auto-import.d.ts',
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: 'readonly', // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],

  resolve: {
    conditions: ['default'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名
      '@g': resolve(__dirname, 'globals'), // 路径别名
    },
  },
})
