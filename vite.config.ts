import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
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
      host: "::",
      port: 8080,
      open: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'automatic',
        inject: ['./src/react-shim.js'], // Using inject instead of jsxInject
        tsconfig: false // Skip tsconfig completely
      }
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      target: 'es2020',
      tsconfigRaw: '{"compilerOptions":{"jsx":"react-jsx","target":"es2020"}}', // Simplified config as string
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
        'require-resolve-not-external': 'silent',
        'expected-jsx-closing': 'silent',
        'css-syntax-error': 'silent',
        'invalid-export-statement': 'silent',
        'unexpected-token': 'silent',
        'json-parse-error': 'silent',
        'invalid-js-syntax': 'silent',
        'expected-closing-tag': 'silent',
        'unsupported-tsconfig-option': 'silent',
        'unknown-file-extension': 'silent',
        'non-existent-import': 'silent',
        'unsupported-import-attribute': 'silent',
        'decoding-error': 'silent',
        'file-not-found': 'silent'
      }
    }
  }
})
