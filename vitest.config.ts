import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/tests/**/*.test.ts', '**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', 'tests/e2e/**'],
  },
})
