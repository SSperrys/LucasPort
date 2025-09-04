import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Polyfill crypto for Node.js environment (needed for some dependencies)
import crypto from "crypto";

if (typeof globalThis.crypto === "undefined") {
  (globalThis as any).crypto = {
    getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: 'LucasPort',  // relative base works for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
