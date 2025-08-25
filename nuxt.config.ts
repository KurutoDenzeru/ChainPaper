import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['nuxt-vitalizer', 'shadcn-nuxt', '@nuxt/image', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],

    build: {
      sourcemap: false,
    },

    ssr: {
      noExternal: [],
      external: ['jspdf', 'html2canvas', 'docx', 'mammoth', 'file-saver']
    },
  },

  // Nuxt Vitalizer
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
        { rel: 'preload', href: '/Palimphest.png', as: 'image' },
      ],
    }
  },

  // Shadcn Nuxt
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui'
  }
})