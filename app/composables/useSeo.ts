import { useHead, useSeoMeta } from '#app'
import { computed } from 'vue'
import { useMarkdownDocStore } from '@/stores/markdownDoc'
import type { SeoConfig } from '../../types/seo'

// Default SEO configuration for ChainPaper
const DEFAULT_CONFIG = {
  title: 'ChainPaper - Trustless Whitepaper Collaboration',
  description: '✍️ Secure markdown platform for authorship assurance, crafted with Nuxt, Pinia, Tailwind, and Shadcn, featuring cryptographic verification using SHA-256.',
  ogImage: '/OpenGraph.webp',
  ogUrl: 'https://chainpaper.nuxt.dev/',
  twitterCard: 'summary_large_image' as const,
  siteName: 'ChainPaper',
  twitterSite: '@chainpaper',
  twitterCreator: '@chainpaper',
  themeColor: '#ffffff',
  faviconPath: '/markdown.webp'
}

export const useSeo = (config: SeoConfig = {}) => {
  const {
    title: providedTitle,
    description = DEFAULT_CONFIG.description,
    ogTitle: providedOgTitle,
    ogDescription = description,
    ogImage = DEFAULT_CONFIG.ogImage,
    ogUrl = DEFAULT_CONFIG.ogUrl,
    twitterTitle: providedTwitterTitle,
    twitterDescription = description,
    twitterImage = ogImage,
    twitterCard = DEFAULT_CONFIG.twitterCard,
    canonical = ogUrl
  } = config

  // Get current document title from the store and form a computed SEO title
  const docStore = useMarkdownDocStore()
  const docTitle = computed(() => docStore.title)
  const computedTitle = computed(() => {
    // Respect an explicit `title` in config if provided
    if (providedTitle && providedTitle.trim() && providedTitle !== 'Untitled Markdown') return providedTitle

    // Use the document title if it isn't the default "Untitled Markdown"
    if (docTitle.value && docTitle.value.trim() && docTitle.value !== 'Untitled Markdown') {
      // Use short format: "<filename> — ChainPaper"
      return `${docTitle.value.trim()} — ${DEFAULT_CONFIG.siteName}`
    }

    // Fallback to the default site title
    return DEFAULT_CONFIG.title
  })

  // Backwards compatible intent: OG/Twitter titles default to computedTitle unless explicitly provided
  const computedOgTitle = computed(() => providedOgTitle ?? computedTitle.value)
  const computedTwitterTitle = computed(() => providedTwitterTitle ?? computedTitle.value)

  // Set up SEO meta tags using useSeoMeta
  useSeoMeta({
    // `useSeoMeta` accepts refs/computed values, so wire `computedTitle` directly to keep it reactive
    title: computedTitle,
    description,
    ogTitle: computed(() => providedOgTitle ?? computedTitle.value),
    ogDescription,
    ogImage,
    ogUrl,
    ogType: 'website',
    ogSiteName: DEFAULT_CONFIG.siteName,
    ogLocale: 'en_US',
    twitterCard,
    twitterTitle: computedTwitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite: DEFAULT_CONFIG.twitterSite,
    twitterCreator: DEFAULT_CONFIG.twitterCreator,
    robots: 'index, follow',
    author: 'ChainPaper',
    keywords: 'whitepaper, collaboration, trustless, authorship, proof, no backend, blockchain, decentralized, cryptographic verification'
  })

  // Set up head configuration using useHead
  useHead({
    title: computedTitle,
    htmlAttrs: {
      lang: 'en',
      dir: 'ltr'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/webp',
        href: DEFAULT_CONFIG.faviconPath
      },
      {
        rel: 'canonical',
        href: canonical
      },
      {
        rel: 'apple-touch-icon',
        href: DEFAULT_CONFIG.faviconPath
      },
      {
        rel: 'shortcut icon',
        href: DEFAULT_CONFIG.faviconPath
      }
    ],
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        name: 'theme-color',
        content: DEFAULT_CONFIG.themeColor
      },
      {
        name: 'color-scheme',
        content: 'light'
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'ChainPaper'
      }
    ]
  })

  return {
    title: computedTitle,
    description,
    ogTitle: computedOgTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle: computedTwitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard,
    canonical
  }
}

// Utility function for page-specific SEO
export const usePageSeo = (pageConfig: Partial<SeoConfig>) => {
  return useSeo(pageConfig)
}

// Utility function for structured data
export const useStructuredData = (data: Record<string, any>) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data)
      }
    ]
  })
}
