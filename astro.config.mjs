// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Remplacez par le vrai nom de domaine une fois en ligne
  site: 'https://dubai-location.vercel.app',
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()], build: { target: 'es2022' } },
});
