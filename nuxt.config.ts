// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PASSPHRASE: process.env.PASSPHRASE,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ]
});
