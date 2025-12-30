import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'vite-plugin-tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
