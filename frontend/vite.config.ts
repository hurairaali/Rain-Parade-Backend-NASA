import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    strictPort: true, // Exit if port is already in use
    open: false, // Don't auto-open browser
  },
  preview: {
    port: 3000,
    host: true,
  },
})