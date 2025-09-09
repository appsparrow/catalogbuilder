import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements in production
        drop_debugger: true, // Remove debugger statements in production
      },
    },
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
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
