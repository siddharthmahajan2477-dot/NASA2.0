import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    allowedHosts: ['sb-64a0i6z52c7d.vercel.run'],

    // Test artifacts are not application HTML; never reload active games when
    // Playwright writes a trace/report during concurrent browser checks.
    watch: {
      ignored: ['**/playwright-report/**', '**/test-results/**'],
    },
  },

  preview: {
    allowedHosts: ['sb-64a0i6z52c7d.vercel.run'],
  },
})
