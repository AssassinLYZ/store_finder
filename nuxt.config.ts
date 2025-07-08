// https://nuxt.com/docs/api/configuration/nuxt-config

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
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      graphqlUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3002/api/graphql' : 'http://localhost:3000/api/graphql'
    },
  },
  nitro: {
    prerender: {
      routes: ['/en', '/nl'],
      ignore: ['/'],
    },
    publicAssets: [
      { dir: 'server/data', baseURL: '/data' }
    ],
    // Ensure data files are copied to the build output
    storage: {
      'data': {
        driver: 'fs',
        base: './server/data'
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


