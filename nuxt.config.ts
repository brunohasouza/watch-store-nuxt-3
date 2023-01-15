import eslintPlugin from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  vite: {
    plugins: [eslintPlugin()],
  },
  plugins: ['~~/plugins/mirage'],
  components: false,
})
