/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    threads: false,
    coverage: {
      reporter: ["json", "cobertura"],
      src: ["src"],
      all: true,
      reportsDirectory: "reports/coverage",
    }
  }
})