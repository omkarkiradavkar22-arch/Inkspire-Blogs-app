import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
     VitePWA({
      registerType: 'autoUpdate',
       includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],
      manifest: {
        name: 'Inkspire Blogs',
        short_name: 'Inkspire',
        description: 'Write. Connect. Inspire.',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/small.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/big.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          },
          {
            src: '/big.jpg',
            sizes: '512x512',
            type: 'image/jpg',
            purpose: 'any maskable'
          }
        ]
      },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            },
            {
              urlPattern: ({ request }) => request.destination === 'script',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'js-cache'
              }
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
