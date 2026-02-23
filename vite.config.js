import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages:
// If your repo is https://github.com/<you>/<repo>, set base to "/<repo>/"
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/poker-clock/",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
