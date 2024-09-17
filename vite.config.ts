import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cc-billpay-upi-id/',
  build: {
    outDir: 'docs', // Output to root directory

  },
  publicDir: 'public'
})