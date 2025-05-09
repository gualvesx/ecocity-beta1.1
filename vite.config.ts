
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Use esbuild options directly without relying on tsconfig files that may have issues
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // Provide explicit TypeScript configuration to avoid reading from tsconfig.json
      tsconfigRaw: {
        compilerOptions: {
          target: "es2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true, // Using the correct option name
          noImplicitReturns: true,
        }
      }
    },
  },
  build: {
    target: 'es2020',
    // Provide a clean esbuild configuration that doesn't rely on problematic tsconfig
    commonjsOptions: {
      transformMixedEsModules: true
    },
    // Override TypeScript settings directly in Vite
    rollupOptions: {
      external: []
    }
  }
}));
