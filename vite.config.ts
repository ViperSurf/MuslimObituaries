import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps the build portable: GitHub Pages project sites,
// a custom domain, or any static host all work without rewrites.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
