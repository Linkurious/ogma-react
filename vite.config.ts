/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { "process.env": { NODE_ENV: "production" } },
  build: {
    minify: true,
    sourcemap: true,
    lib: {
      name: "OgmaReact",
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => {
        if (format === "umd") return `index.umd.js`;
        if (format === "cjs") return `index.cjs`;
        return `index.mjs`;
      },
    },
    rollupOptions: {
      external: ["@linkurious/ogma", "react", "react-dom", "react-dom/server"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/server": "ReactDOMServer",
          "@linkurious/ogma": "Ogma",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    threads: false,
    coverage: {
      reporter: ["json", "cobertura"],
      src: ["src"],
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      reportsDirectory: "reports/coverage",
    },
  },
});
