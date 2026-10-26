import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Endereço do site. No GitHub Pages, o workflow define SITE_URL e BASE_PATH
// (https://calderar0.github.io e /be-for-you). Com domínio próprio, basta trocar
// SITE_URL pelo domínio e BASE_PATH por '/'.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://calderar0.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } },
    }),
  ],
});
