/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   minify: true,
  //   lib: {
  //     name: "OgmaReact",
  //     entry: "./src/index.ts",
  //     formats: ["es", "cjs", "umd"],
  //   },
  //   rollupOptions: {
  //     external: ["@linkurious/ogma", "react", "react-dom", "react-dom/server"],
  //     output: {
  //       globals: {
  //         react: "React",
  //         "react-dom": "ReactDOM",
  //         "react-dom/server": "ReactDOMServer",
  //         "@linkurious/ogma": "Ogma",
  //       },
  //     },
  //   },
  // },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    threads: false,
    coverage: {
      reporter: ["json", "cobertura"],
      src: ["src"],
      all: true,
      reportsDirectory: "reports/coverage",
    },
  },
});
