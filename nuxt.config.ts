// https://nuxt.com/docs/api/configuration/nuxt-config
import { mkdirSync, existsSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export default defineNuxtConfig({
  devServer: {
    port: 3002,
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/icon'],
  css: ['./assets/css/main.scss'],
  app: {
    baseURL: '/',
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.NUXT_GOOGLE_MAPS_API_KEY,
      apiUrl: process.env.NUXT_GRAPHQL_BASE,
    },
  },
  nitro: {
    prerender: {
      routes: ['/en', '/nl'],
      ignore: ['/'],
    },

    // Ensure data files are copied to the build output
    storage: {
      'data': {
        driver: 'fs',
        base: 'server/assets/data'
      }
    },
    hooks: {
      async compiled() {
        copyDir('server/assets/data', '.output/server/assets/data');
        console.log('✅ Copied data files to .output/server/assets/data');
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
    ],
    lazy: false,
    defaultLocale: 'nl',
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false,
    },
    // vueI18n: {
    //   legacy: false,
    //   fallbackLocale: 'nl',
    //   seo: false,
    // }
  },
});

function copyDir(src: string, dest: string) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  for (const file of readdirSync(src)) {
    const srcPath = join(src, file);
    const destPath = join(dest, file);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

