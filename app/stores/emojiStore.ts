import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  async function fetchAndCache() {
    isLoading.value = true
    try {
      const res = await fetch('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      const mapped: Emoji[] = data.map((e: any) => ({
        char: codepointsToChar(e.unified),
        name: e.name || e.short_name || '',
        shortcode: e.short_name ? `:${e.short_name}:` : (e.short_names && e.short_names[0] ? `:${e.short_names[0]}:` : ''),
        category: normalizeCategory(e.category || ''),
        keywords: (e.short_names || e.keywords || []).map((k: any) => String(k).toLowerCase())
      }))

      // Sort within categories alphabetically by name for predictable order and UX
      mapped.sort((a, b) => (a.category === b.category ? a.name.localeCompare(b.name) : a.category!.localeCompare(b.category!)))

      allEmojis.value = mapped
      lastUpdated.value = Date.now()
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: lastUpdated.value, data: mapped })) } catch (e) { /* ignore */ }
    } catch (err) {
      // minimal fallback
      allEmojis.value = [
        { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['face', 'smile'] },
        { char: '😂', name: 'Face with Tears of Joy', shortcode: ':joy:', category: 'smileys', keywords: ['face', 'tears', 'joy'] },
        { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals', keywords: ['dog', 'pet'] },
        { char: '🍎', name: 'Red Apple', shortcode: ':apple:', category: 'food', keywords: ['fruit', 'apple'] },
        { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel', keywords: ['car', 'vehicle'] },
        { char: '🏁', name: 'Chequered Flag', shortcode: ':chequered_flag:', category: 'flags', keywords: ['flag'] }
      ]
      lastUpdated.value = Date.now()
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
      // ignore parse errors and fall through to fetch
    }
    // Kick off fetch but don't block if init was called without awaiting
    await fetchAndCache()
  }

  function getByCategory(cat: string) {
    const c = (cat || '').toLowerCase()
    return allEmojis.value.filter(e => String(e.category || '').toLowerCase() === c).sort((a, b) => a.name.localeCompare(b.name))
  }

  return { allEmojis, isLoading, lastUpdated, init, getByCategory }
})

export default useEmojiStore
