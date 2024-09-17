import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/docs/',
  build: {
    outDir: 'docs', // Output to root directory

  },
  publicDir: 'public'
})