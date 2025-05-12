
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 8080,
    open: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: './tsconfig.app.json'  // Use the app tsconfig instead of the base one
    }
  },
  // Ignore the type checking issues in read-only files
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
