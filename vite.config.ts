
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
  // Completely bypass tsconfig parsing with a non-existent path
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      tsconfig: 'non-existent-tsconfig.json'
    }
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        target: 'es2020',
        module: 'esnext',
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true
      }
    },
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2020',
    // Silence all parsing errors
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'parse-error': 'silent',
      'unsupported-jsx-comment': 'silent',
      'duplicate-case': 'silent',
      'unsupported-dynamic-import': 'silent',
      'empty-import': 'silent',
      'ignored-bare-import': 'silent',
      'different-path-case': 'silent',
      'ignored-dynamic-import': 'silent',
      'require-resolve-not-external': 'silent'
    }
  }
})
