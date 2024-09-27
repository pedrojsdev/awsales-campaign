import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,js}'],
      exclude: ['node_modules', '**/*.test.ts', '**/*.spec.ts']
    },
  },
});
