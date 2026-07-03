import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['**/*.ts', '**/*.vue'],
      outDirs: ['./dist']
    })
  ],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname)
    }
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
        'config/element': resolve(__dirname, 'config/element.ts'),
        'utils/apiClient': resolve(__dirname, 'utils/apiClient.ts'),
        'utils/authPaths': resolve(__dirname, 'utils/authPaths.ts'),
        'utils/authSession': resolve(__dirname, 'utils/authSession.ts'),
        'utils/authTypes': resolve(__dirname, 'utils/authTypes.ts'),
        'utils/form': resolve(__dirname, 'utils/form.ts'),
        'utils/iconResolver': resolve(__dirname, 'utils/iconResolver.ts'),
        'utils/message': resolve(__dirname, 'utils/message.ts'),
        'utils/sso': resolve(__dirname, 'utils/sso.ts'),
        'utils/useAuth': resolve(__dirname, 'utils/useAuth.ts'),
        'utils/useDataLoading': resolve(__dirname, 'utils/useDataLoading.ts'),
        'utils/logger': resolve(__dirname, 'utils/logger.ts'),
        'qiankun/index': resolve(__dirname, 'qiankun/index.ts'),
        'qiankun/createQiankunApp': resolve(__dirname, 'qiankun/createQiankunApp.ts'),
        'qiankun/config': resolve(__dirname, 'qiankun/config.ts'),
        'socket/index': resolve(__dirname, 'socket/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'element-plus',
        '@element-plus/icons-vue',
        '@iconify/vue',
        '@iconify-icons/ep',
        'pinia',
        'axios',
        'qiankun',
        'socket.io-client',
        'fsevents',
        'sass-embedded',
        'node:fs',
        'node:path',
        'node:url',
        /node_modules/
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: '.'
      }
    }
  }
})
