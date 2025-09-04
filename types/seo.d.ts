export interface SeoConfig {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  canonical?: string
}

export interface SeoDefaults {
  title: string
  description: string
  ogImage: string
  ogUrl: string
  twitterCard: 'summary_large_image'
  siteName: string
  twitterSite: string
  twitterCreator: string
}
