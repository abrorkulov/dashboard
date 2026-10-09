import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Dev va preview rejimida /api so'rovlari lokal backend'ga yo'naltiriladi.
// Backend manzilini VITE_API_PROXY orqali o'zgartirish mumkin.
const apiProxy = {
  '/api': {
    target: process.env.VITE_API_PROXY || 'http://localhost:4000',
    changeOrigin: true,
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
