import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './test/vitest.setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
    },
    exclude: [
      'node_modules',
      'dist',
      'test/e2e/**',
    ],
  },
});
