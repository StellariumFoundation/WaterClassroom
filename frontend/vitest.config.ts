import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    setupFiles: './src/setupTests.ts', // if you need setup files
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
