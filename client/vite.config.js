import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets:
      ['favicon.ico'],
      manifest: {
        name: 'Blog Platform app',
        short_name: 'Blog',
        theme_color: '#ffffff',
        display:'standalone',
         start_url: '/',
          scope: '/',

        icons: [
          {
            src: '/small.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/big.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
        },
        workbox:{
          runtimeCaching:[
            {
              urlPattern:
              ({request})=>request.destination==='image',
              handler:'CacheFirst'
            },
            {
              urlPattern:
              ({request})=>request.destination==='script',
              handler:
              'StaleWhileRevalidate'
            }
          ]
        }
    })
  ],
   build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"]
        }
      }
    }
  }
});
