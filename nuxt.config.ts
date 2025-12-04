export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  $production: {
    nitro: {
      preset: 'githubPages'
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/hints']
})