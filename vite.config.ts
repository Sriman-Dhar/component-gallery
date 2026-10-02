/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three, R3F, drei and postprocessing live in their own chunk, loaded only when the world canvas mounts.
        manualChunks(id) {
          // Vite's preload helper must sit in an eager chunk, or the 3D chunk would be preloaded with it.
          if (id.includes('vite/preload-helper')) return 'react';
          if (/node_modules\/(three|three-stdlib|postprocessing|@react-three)\//.test(id)) return 'three';
          // React gets its own vendor chunk so the three chunk never absorbs it (and never loads eagerly).
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
