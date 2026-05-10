import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      disable: !!process.env.CAPACITOR,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 4000000,
        // Não interceptar requisições de assets no Capacitor (localhost)
        navigateFallbackDenylist: [/^\/assets\//],
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

  build: {
    // Aumentar limite para evitar warnings de bundle grande
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        // Forçar bundle único — elimina todos os chunks dinâmicos
        // que causam "Failed to fetch dynamically imported module" no WebView Android
        inlineDynamicImports: true,
      },
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
