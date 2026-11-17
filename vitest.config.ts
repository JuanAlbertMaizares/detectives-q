import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // En Vitest 4, usa maxWorkers: 1 para forzar un solo worker
    maxWorkers: 1, 
    // Aumentamos el tiempo de espera a 15 segundos
    testTimeout: 15000, 
  },
})