// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false},
  modules: ['@element-plus/nuxt','@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'ZH',
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
    head: {
      title: 'My Blog',
      meta: [
        { name: 'description', content: 'Welcome to my website.' },
        { name: 'keywords', content: 'Nuxt3, Vue, TypeScript,Three,js' },
        { name: 'author', content: 'Andy Chen' },
      ],
      link: [
        { rel: 'icon', href: '/blog/favicon.ico' }, 
      ],
    },
    baseURL: '/blog/',
    buildAssetsDir: '/static/'
  },
})
