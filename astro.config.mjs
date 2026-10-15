// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cambiar por el dominio definitivo cuando se publique en Netlify.
  site: 'https://plataforma-partners.netlify.app',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    optimizeDeps: { include: ['@supabase/supabase-js'] },
  },
});
