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
  build: {
    // Ensure build works across different platforms
    target: 'esnext',
    rollupOptions: {
      // Handle external dependencies better
      external: [],
      output: {
        // Ensure consistent output
        manualChunks: undefined,
      },
      // Explicitly exclude problematic plugins
      plugins: [],
    },
    // Disable source maps in production to avoid issues
    sourcemap: false,
    // Ensure clean output
    emptyOutDir: true,
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
  // Ensure Vite handles platform differences gracefully
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', 'rollup'],
    include: ['react', 'react-dom'],
  },
}));
