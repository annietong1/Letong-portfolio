import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Letong-portfolio/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
