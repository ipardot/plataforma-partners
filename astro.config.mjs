// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cambiar por el dominio definitivo cuando se publique en Netlify.
  site: 'https://plataforma-partners.netlify.app',
  // Precarga las páginas al pasar el cursor por un enlace: la navegación se siente instantánea.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    optimizeDeps: { include: ['@supabase/supabase-js'] },
  },
});
