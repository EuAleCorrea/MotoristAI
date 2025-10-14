import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'MotoristAI - Controle Financeiro',
        short_name: 'MotoristAI',
        description: 'App de controle financeiro para motoristas de aplicativos como Uber, 99 e iFood',
        theme_color: '#0057FF',
        background_color: '#F5F6F8',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://i.ibb.co/2Yx7k3p/motoristai-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
        ],
      },
    }),
  ],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
