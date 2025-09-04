import { useHead, useSeoMeta } from '#app'
import type { SeoConfig } from '../../types/seo'

// Default SEO configuration for ChainPaper
const DEFAULT_CONFIG = {
  title: 'ChainPaper - Trustless Whitepaper Collaboration',
  description: '✍️ Secure markdown platform for authorship assurance, crafted with Nuxt, Tailwind, and Shadcn for instant preview and modern usability.',
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
    title = DEFAULT_CONFIG.title,
    description = DEFAULT_CONFIG.description,
    ogTitle = title,
    ogDescription = description,
    ogImage = DEFAULT_CONFIG.ogImage,
    ogUrl = DEFAULT_CONFIG.ogUrl,
    twitterTitle = title,
    twitterDescription = description,
    twitterImage = ogImage,
    twitterCard = DEFAULT_CONFIG.twitterCard,
    canonical = ogUrl
  } = config

  // Set up SEO meta tags using useSeoMeta
  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType: 'website',
    ogSiteName: DEFAULT_CONFIG.siteName,
    ogLocale: 'en_US',
    twitterCard,
    twitterTitle,
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
    title,
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
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle,
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
