// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
       registerType: 'autoUpdate',
  workbox: {
    cleanupOutdatedCaches: true
  },
      manifest: {
        name: 'Iron Fit',
        short_name: 'Iron Fit',
        description: 'Fitness and diet tracking',
        theme_color: '#111111',
        
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo_512.jpg', sizes: '192x192', type: 'image/jpeg', purpose: 'any maskable' },
          { src: '/logo_512.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})