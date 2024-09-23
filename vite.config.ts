import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './src/assets') + '/[!.]*', // This will copy all files from the 'src/assets' directory
          dest: './public/src/assets' // Destination folder is 'public/src/assets'
        },
      ],
    })
  ],
  base: '/cc-billpay-upi-id/',
  build: {
    outDir: 'docs'
  },
  publicDir: 'public'
})
