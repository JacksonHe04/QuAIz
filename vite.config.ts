import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error vite config nodejs esm
import { fileURLToPath } from 'url'
// @ts-expect-error vite config nodejs esm
import { dirname, resolve } from 'path'
// @ts-expect-error vite config nodejs esm
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})