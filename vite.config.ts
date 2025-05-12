
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
  // Skip using tsconfig.json for esbuild which is causing the errors
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      // Ignore any parsing errors in tsconfig.json
      'parse-error': 'silent'
    },
    // Skip reading tsconfig when building
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        target: 'es2020',
        moduleResolution: 'bundler',
        strict: true,
        paths: {
          "@/*": ["./src/*"]
        }
      }
    }
  },
  optimizeDeps: {
    // Disable esbuild options that rely on tsconfig
    disabled: false,
    esbuildOptions: {
      jsx: 'automatic',
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx'
        }
      }
    }
  }
})
