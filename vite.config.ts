/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The `geo` entry (ENTRY=geo) is built separately from the root one: it can't be
// part of the UMD bundle, and it imports `@linkurious/ogma/geo` (Ogma >= 6.1).
const isGeo = process.env.ENTRY === "geo";
const contextId = /(^\.{1,2}[\\/]|[\\/]src[\\/])context(\.tsx?)?$/;

const rootPackage = "@linkurious/ogma-react";
// The geo entry must share the React context of the root package, otherwise
// `useOgma` would not find the <Ogma /> provider: import it from the package.
const sharedContext = {
  name: "geo-shared-context",
  enforce: "pre" as const,
  resolveId(source: string) {
    if (!isGeo || !contextId.test(source)) return null;
    return { id: rootPackage, external: true };
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic"
    }),
    ...(isGeo ? [sharedContext] : [])
  ],
  define: { "process.env": { NODE_ENV: "production" } },
  build: {
    minify: true,
    sourcemap: true,
    // the geo build runs second and must keep the root build's output
    emptyOutDir: !isGeo,
    lib: isGeo
      ? {
          entry: "./src/geo.tsx",
          formats: ["es", "cjs"],
          fileName: (format) => (format === "cjs" ? "geo.cjs" : "geo.mjs")
        }
      : {
          name: "OgmaReact",
          entry: "./src/index.ts",
          formats: ["es", "cjs", "umd"],
          fileName: (format) => {
            if (format === "umd") return `index.umd.js`;
            if (format === "cjs") return `index.cjs`;
            return `index.mjs`;
          }
        },
    rollupOptions: {
      external: (id: string) =>
        [
          "@linkurious/ogma",
          "@linkurious/ogma/geo",
          "react",
          "react-dom",
          "react-dom/server"
        ].includes(id) || id === rootPackage,
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/server": "ReactDOMServer",
          "@linkurious/ogma": "Ogma",
          "@linkurious/ogma/geo": "OgmaGeo"
        }
      }
    }
  },
  esbuild: {
    jsxInject: "import React from 'react';",
    jsx: "automatic"
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/unit/setup.ts",
    include: ["test/unit/**/*.test.{ts,tsx}"],
    exclude: ["test/e2e/**", "node_modules", "dist"],
    coverage: {
      reporter: ["json", "cobertura"],
      include: ["src/**/*.{ts,tsx}"],
      reportsDirectory: "reports/coverage"
    }
  }
});
