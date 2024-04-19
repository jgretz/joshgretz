/// <reference types="vitest" />

import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  test: {
    include: ['./app/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup/setup-test-env.ts'],
    globalSetup: ['./tests/setup/global-setup.ts'],
    coverage: {
      include: ['app/**/*.{ts,tsx}'],
      all: true,
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
