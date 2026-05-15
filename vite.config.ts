import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isWidgetBuild = mode === 'widget'

  return {
    plugins: [react()],
    copyPublicDir: isWidgetBuild,
    build: isWidgetBuild
      ? {
          cssCodeSplit: false,
          lib: {
            entry: resolve(__dirname, 'src/chat-widget.tsx'),
            formats: ['es'],
            fileName: () => 'chat-widget.js',
          },
          rollupOptions: {
            output: {
              assetFileNames: (assetInfo) =>
                assetInfo.names.includes('style.css')
                  ? 'frontend.css'
                  : 'assets/[name]-[hash][extname]',
            },
          },
        }
      : undefined,
  }
})
