import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /// @ts-expect-error - tells TypeScript to accept the test configuration key injection
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts", // Points to assertions extension configuration
  },
  server: {
    proxy: {
      "/api/chat": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ""),
      },
      "/api/model-config": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api/submit-config": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // NEW: Add a secure server proxy path for cdnjs data streams
      "/api/cdnjs": {
        target: "https://api.cdnjs.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/cdnjs/, ""),
      },
    },
  },
});
