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

  components: {
    dirs: [
      '~/components',
      '~/components/ui',
      '~/components/dialogs',
      '~/components/layout',
    ]
  },

  app: {
    head: {
      title: 'ChainPaper - Trustless Whitepaper Collaboration',
      meta: [
        { charset: 'utf-8' },
      ],
      link: [],
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