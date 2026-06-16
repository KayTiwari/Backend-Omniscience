import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 900,
  },
  // PGlite ships its own wasm + data assets and breaks Vite's dep pre-bundling.
  // Exclude it so the dynamic import loads the package directly.
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  plugins: [react()],
})
