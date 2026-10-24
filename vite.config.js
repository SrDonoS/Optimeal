import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Configuración de Vite: React + Tailwind CSS (v4).
// `open: true` abre el navegador automáticamente al correr `npm run dev`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { open: true },
})
