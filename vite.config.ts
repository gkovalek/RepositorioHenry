import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { PluginOption } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss() as PluginOption],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
})
