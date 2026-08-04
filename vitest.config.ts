import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // 1. Force Vitest to use the virtual browser layout sandbox for all tests
    environment: "jsdom",
    // 2. Load global assertion matchers automatically
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
