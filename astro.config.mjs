import { defineConfig } from 'astro/config';
import i18nMiddleware from './astro-i18n-middleware.js'; // Adjust the path if needed

export default defineConfig({
  integrations: [
    i18nMiddleware({
      supportedLocales: ['en', 'es', 'fr'], // Define your supported locales
      defaultLocale: 'en',
    }),
  ],
});
