import pkg from "./package.json";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The two legitimate build products. Anything else supplied explicitly is a
// configuration mistake and should fail loudly rather than silently picking
// a default.
const VALID_TARGETS = ["site", "pro"];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawTarget = env.VITE_TARGET;

  if (
    rawTarget !== undefined &&
    rawTarget !== "" &&
    !VALID_TARGETS.includes(rawTarget)
  ) {
    throw new Error(
      `Invalid VITE_TARGET: "${rawTarget}". Must be "site" or "pro" (leave unset for local dev, which defaults to "site").`,
    );
  }

  return {
    plugins: [react()],

    // This allows Cloudflare Pages, GitHub Pages, and ZIP builds to all work correctly
    base: process.env.VITE_BASE || "./",

    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
  };
});
