import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  // root: './',
  // base: '/chat',
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  transpileDependencies: true, // 配置需要被 Babel 转译的依赖项。
  outputDir: 'dist', //输出文件目录
  assetsDir: 'static', //静态资源文件名称
  productionSourceMap: false, //去除打包后js的map文件
  lintOnSave: false,
  runtimeCompiler: false //去掉console
})
