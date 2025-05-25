// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
  ],
  build: {
    transpile: ['primevue']
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_BASE_URL_API || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_TOKEN,
      socketUrl: process.env.SOCKET_URL || 'http://localhost:1337',
    }
  },
  nitro: {
    devProxy: {
      '/socket.io': {
        target: process.env.SOCKET_URL || 'http://localhost:1337',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
})