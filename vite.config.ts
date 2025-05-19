import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    chunkSizeWarningLimit: 1000, // increase limit if needed
    assetsInlineLimit: 4096, // 4kb (default)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor modules into separate chunks
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'] // add other large dependencies
        },
      }
    },
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    assetsDir: "assets", // This is where built assets will go
    copyPublicDir: true,
    emptyOutDir: true,
  },
   publicDir: path.resolve(import.meta.dirname, "public"),
});
