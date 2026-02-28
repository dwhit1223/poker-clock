import pkg from "./package.json";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],

    // This allows Cloudflare Pages, GitHub Pages, and ZIP builds to all work correctly
    base: process.env.VITE_BASE || "./",

    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    },

    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
  };
});
