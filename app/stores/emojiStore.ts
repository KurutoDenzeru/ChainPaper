import { defineStore } from 'pinia'
import { ref } from 'vue'
import emojiList from 'emoji-datasource-apple/emoji.json'

export interface Emoji {
  char: string
  name: string
  shortcode: string
  category?: string
  keywords?: string[]
}

export const useEmojiStore = defineStore('emoji', () => {
  const allEmojis = ref<Emoji[]>([])
  const isLoading = ref(false)
  const lastUpdated = ref<number | null>(null)

  const CACHE_KEY = 'emoji-dataset-v1'
  const TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

  function codepointsToChar(unified: string) {
    return unified.split('-').map(u => String.fromCodePoint(parseInt(u, 16))).join('')
  }

  function normalizeCategory(cat: string) {
    const c = (cat || '').toLowerCase()
    if (c.includes('smile')) return 'smileys'
    if (c.includes('people') || c.includes('body')) return 'people'
    if (c.includes('animal') || c.includes('nature')) return 'animals'
    if (c.includes('food')) return 'food'
    if (c.includes('activity')) return 'activities'
    if (c.includes('travel') || c.includes('place')) return 'travel'
    if (c.includes('object') || c.includes('objects')) return 'objects'
    if (c.includes('symbol')) return 'symbols'
    if (c.includes('flag')) return 'flags'
    return c.replace(/\s+/g, '-')
  }


  function loadFromPackage() {
    isLoading.value = true
    try {
      const mapped: Emoji[] = emojiList.map((e: any) => ({
        char: codepointsToChar(e.unified),
        name: e.name || e.short_name || '',
        shortcode: e.short_name ? `:${e.short_name}:` : (e.short_names && e.short_names[0] ? `:${e.short_names[0]}:` : ''),
        category: normalizeCategory(e.category || ''),
        keywords: (e.short_names || e.keywords || []).map((k: any) => String(k).toLowerCase())
      }))
      allEmojis.value = mapped
      lastUpdated.value = Date.now()
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: lastUpdated.value, data: mapped })) } catch (e) { /* ignore */ }
    } finally {
      isLoading.value = false
    }
  }

  async function init(force = false) {
    if (allEmojis.value.length > 0 && !force) return
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw && !force) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.ts && parsed.data) {
          const age = Date.now() - parsed.ts
          if (age < TTL) {
            allEmojis.value = parsed.data
            lastUpdated.value = parsed.ts
            return
          }
        }
      }
    } catch (e) {
      // ignore parse errors and fall through to loadFromPackage
    }
    // Always load from local package for instant access
    loadFromPackage()
  }

  function getByCategory(cat: string) {
    const c = (cat || '').toLowerCase()
    // Use emoji data order for all categories
    return allEmojis.value.filter(e => String(e.category || '').toLowerCase() === c)
  }

  return { allEmojis, isLoading, lastUpdated, init, getByCategory }
})

export default useEmojiStore
