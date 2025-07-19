import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],

    build: {
      sourcemap: false,
    },
  },

  experimental: {
    payloadExtraction: false,
    viewTransition: true,
  },

  vitalizer: {
    disablePrefetchLinks: true
  },

  app: {
    head: {
      title: 'ChainPaper - Trustless Whitepaper Collaboration',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Trustless whitepaper collaboration tool with authorship proofs, no backend required.' },
        { name: 'keywords', content: 'whitepaper, collaboration, trustless, authorship, proof, no backend' },
        { name: 'author', content: 'ChainPaper' },
        { name: 'robots', content: 'index, follow' },
      ],

      link: [
        { rel: 'preload', href: '/notebook-pen.svg', as: 'image' },
      ],
    }
  },

  modules: ['nuxt-vitalizer']
})