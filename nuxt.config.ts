// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false},
  modules: ['@element-plus/nuxt','@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'EN',
    locales: [
      {
        code: 'EN',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'ZH',
        name: '中文',
        file: 'zh.json',
      },
    ],
    langDir: 'locales/',
    lazy: true,
  },
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/blog/' : '/',
    buildAssetsDir: '/static/'
  }
})
