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

  // Large static emoji dataset (character, name, shortcode, category, keywords)
  // Curated for performance; categories approximated for UI grouping.
  const STATIC_EMOJIS: Emoji[] = [
    // Smileys & Emotion
    { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['happy', 'smile', 'face'] },
    { char: '😁', name: 'Beaming Face With Smiling Eyes', shortcode: ':grin:', category: 'smileys', keywords: ['smile', 'happy', 'teeth'] },
    { char: '😂', name: 'Face With Tears of Joy', shortcode: ':joy:', category: 'smileys', keywords: ['laugh', 'tears'] },
    { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:', category: 'smileys', keywords: ['lol', 'laugh'] },
    { char: '😊', name: 'Smiling Face With Smiling Eyes', shortcode: ':blush:', category: 'smileys', keywords: ['smile', 'pleased'] },
    { char: '😇', name: 'Smiling Face With Halo', shortcode: ':innocent:', category: 'smileys', keywords: ['angel', 'halo'] },
    { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:', category: 'smileys', keywords: ['meh', 'soft'] },
    { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down:', category: 'smileys', keywords: ['silly', 'playful'] },
    { char: '😉', name: 'Winking Face', shortcode: ':wink:', category: 'smileys', keywords: ['flirt', 'joke'] },
    { char: '😌', name: 'Relieved Face', shortcode: ':relieved:', category: 'smileys', keywords: ['relief'] },
    { char: '😍', name: 'Smiling Face With Heart-Eyes', shortcode: ':heart_eyes:', category: 'smileys', keywords: ['love', 'adore'] },
    { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:', category: 'smileys', keywords: ['kiss', 'love'] },
    { char: '😜', name: 'Winking Face With Tongue', shortcode: ':stuck_out_tongue_winking_eye:', category: 'smileys', keywords: ['silly', 'tongue'] },
    { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:', category: 'smileys', keywords: ['crazy', 'goofy'] },
    { char: '😎', name: 'Smiling Face With Sunglasses', shortcode: ':sunglasses:', category: 'smileys', keywords: ['cool'] },

    // People & Body
    { char: '👋', name: 'Waving Hand', shortcode: ':wave:', category: 'people', keywords: ['hello', 'goodbye'] },
    { char: '🤚', name: 'Raised Back of Hand', shortcode: ':raised_back_of_hand:', category: 'people', keywords: ['hand'] },
    { char: '🫶', name: 'Heart Hands', shortcode: ':heart_hands:', category: 'people', keywords: ['love'] },
    { char: '👍', name: 'Thumbs Up', shortcode: ':thumbsup:', category: 'people', keywords: ['approve', 'like'] },
    { char: '👎', name: 'Thumbs Down', shortcode: ':thumbsdown:', category: 'people', keywords: ['dislike'] },
    { char: '👏', name: 'Clapping Hands', shortcode: ':clap:', category: 'people', keywords: ['applause'] },
    { char: '🙏', name: 'Folded Hands', shortcode: ':pray:', category: 'people', keywords: ['please', 'thanks'] },
    { char: '🤝', name: 'Handshake', shortcode: ':handshake:', category: 'people', keywords: ['agree', 'deal'] },
    { char: '💪', name: 'Flexed Biceps', shortcode: ':muscle:', category: 'people', keywords: ['strength'] },

    // Animals & Nature
    { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals', keywords: ['pet', 'puppy'] },
    { char: '🐱', name: 'Cat Face', shortcode: ':cat:', category: 'animals', keywords: ['pet', 'kitty'] },
    { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:', category: 'animals', keywords: ['rodent'] },
    { char: '🦊', name: 'Fox Face', shortcode: ':fox:', category: 'animals', keywords: ['sly'] },
    { char: '🐻', name: 'Bear Face', shortcode: ':bear:', category: 'animals', keywords: ['wild'] },
    { char: '🐼', name: 'Panda Face', shortcode: ':panda_face:', category: 'animals', keywords: ['cute'] },
    { char: '🦁', name: 'Lion Face', shortcode: ':lion:', category: 'animals', keywords: ['king'] },
    { char: '🐵', name: 'Monkey Face', shortcode: ':monkey:', category: 'animals', keywords: ['funny'] },
    { char: '🐸', name: 'Frog Face', shortcode: ':frog:', category: 'animals', keywords: ['amphibian'] },
    { char: '🦄', name: 'Unicorn Face', shortcode: ':unicorn:', category: 'animals', keywords: ['myth', 'magical'] },

    // Food & Drink
    { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:', category: 'food', keywords: ['fruit'] },
    { char: '🍎', name: 'Red Apple', shortcode: ':apple:', category: 'food', keywords: ['fruit'] },
    { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:', category: 'food', keywords: ['fruit'] },
    { char: '🍌', name: 'Banana', shortcode: ':banana:', category: 'food', keywords: ['fruit'] },
    { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:', category: 'food', keywords: ['fruit'] },
    { char: '🍇', name: 'Grapes', shortcode: ':grapes:', category: 'food', keywords: ['fruit'] },
    { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:', category: 'food', keywords: ['berry'] },
    { char: '🍕', name: 'Pizza', shortcode: ':pizza:', category: 'food', keywords: ['cheese', 'slice'] },
    { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:', category: 'food', keywords: ['burger'] },
    { char: '🍣', name: 'Sushi', shortcode: ':sushi:', category: 'food', keywords: ['fish', 'rice'] },

    // Travel & Places
    { char: '✈️', name: 'Airplane', shortcode: ':airplane:', category: 'travel', keywords: ['flight'] },
    { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel', keywords: ['drive'] },
    { char: '🚲', name: 'Bicycle', shortcode: ':bicycle:', category: 'travel', keywords: ['bike'] },
    { char: '🗺️', name: 'World Map', shortcode: ':world_map:', category: 'travel', keywords: ['map'] },
    { char: '🏝️', name: 'Desert Island', shortcode: ':island:', category: 'travel', keywords: ['vacation'] },
    { char: '🏖️', name: 'Beach With Umbrella', shortcode: ':beach:', category: 'travel', keywords: ['sun'] },

    // Activities & Sports
    { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:', category: 'activities', keywords: ['sports', 'ball'] },
    { char: '🏀', name: 'Basketball', shortcode: ':basketball:', category: 'activities', keywords: ['sports'] },
    { char: '🏈', name: 'American Football', shortcode: ':football:', category: 'activities', keywords: ['sports'] },
    { char: '🎾', name: 'Tennis', shortcode: ':tennis:', category: 'activities', keywords: ['sports'] },
    { char: '🏊', name: 'Swimmer', shortcode: ':swimmer:', category: 'activities', keywords: ['water'] },

    // Objects
    { char: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'objects', keywords: ['idea'] },
    { char: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'objects', keywords: ['pin'] },
    { char: '📎', name: 'Paperclip', shortcode: ':paperclip:', category: 'objects', keywords: ['attach'] },
    { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'objects', keywords: ['secure'] },
    { char: '🔑', name: 'Key', shortcode: ':key:', category: 'objects', keywords: ['unlock'] },

    // Symbols
    { char: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'symbols', keywords: ['love'] },
    { char: '💛', name: 'Yellow Heart', shortcode: ':yellow_heart:', category: 'symbols', keywords: ['love'] },
    { char: '⭐', name: 'Star', shortcode: ':star:', category: 'symbols', keywords: ['favorite'] },
    { char: '🔥', name: 'Fire', shortcode: ':fire:', category: 'symbols', keywords: ['hot'] },
    { char: '✅', name: 'Check Mark Button', shortcode: ':white_check_mark:', category: 'symbols', keywords: ['ok'] },

    // Flags (a small curated subset)
    { char: '🇺🇸', name: 'Flag: United States', shortcode: ':flag-us:', category: 'flags', keywords: ['usa'] },
    { char: '🇬🇧', name: 'Flag: United Kingdom', shortcode: ':flag-uk:', category: 'flags', keywords: ['uk'] },
    { char: '🇨🇦', name: 'Flag: Canada', shortcode: ':flag-ca:', category: 'flags', keywords: ['canada'] },
    { char: '🇯🇵', name: 'Flag: Japan', shortcode: ':flag-jp:', category: 'flags', keywords: ['japan'] },

    // Nature & Weather
    { char: '☀️', name: 'Sun', shortcode: ':sunny:', category: 'nature', keywords: ['weather'] },
    { char: '🌧️', name: 'Cloud With Rain', shortcode: ':rain_cloud:', category: 'nature', keywords: ['rain'] },
    { char: '❄️', name: 'Snowflake', shortcode: ':snowflake:', category: 'nature', keywords: ['cold'] },
    { char: '🌈', name: 'Rainbow', shortcode: ':rainbow:', category: 'nature', keywords: ['colorful'] },

    // Misc common useful glyphs
    { char: '🔔', name: 'Bell', shortcode: ':bell:', category: 'objects', keywords: ['alert'] },
    { char: '📅', name: 'Calendar', shortcode: ':calendar:', category: 'objects', keywords: ['date'] },
    { char: '✏️', name: 'Pencil', shortcode: ':pencil2:', category: 'objects', keywords: ['edit'] },
    { char: '🖨️', name: 'Printer', shortcode: ':printer:', category: 'objects', keywords: ['print'] },
    { char: '📷', name: 'Camera', shortcode: ':camera:', category: 'objects', keywords: ['photo'] }
  ]

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


  function loadFromStatic() {
    isLoading.value = true
    try {
      // copy static dataset and ensure normalized categories and keyword arrays
      const mapped: Emoji[] = STATIC_EMOJIS.map(e => ({
        char: e.char,
        name: e.name,
        shortcode: e.shortcode || '',
        category: normalizeCategory(e.category || ''),
        keywords: (e.keywords || []).map(k => String(k).toLowerCase())
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
  // Load from the static dataset for instant access
  loadFromStatic()
  }

  // Optionally fetch a larger emoji dataset (JSON) from a public URL (e.g. /emoji.json) and replace the store data.
  // This allows you to drop a full emoji JSON into the site's `public/` folder and have the UI load it lazily.
  async function loadFromUrl(url = '/emoji.json', force = false) {
    if (!force && allEmojis.value.length > 0) return
    isLoading.value = true
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('failed to fetch')
      const data = await res.json()
      // Expecting an array of emoji objects with fields like unified/name/short_name/short_names/category/keywords
      const mapped: Emoji[] = data.map((e: any) => {
        const char = e.char || (e.unified ? e.unified.split('-').map((u: string) => String.fromCodePoint(parseInt(u, 16))).join('') : '')
        const name = e.name || e.short_name || ''
        const shortcode = e.short_name ? `:${e.short_name}:` : (e.short_names && e.short_names[0] ? `:${e.short_names[0]}:` : (e.shortcode || ''))
        return {
          char,
          name,
          shortcode,
          category: normalizeCategory(e.category || e.group || ''),
          keywords: (e.keywords || e.short_names || []).map((k: any) => String(k).toLowerCase())
        }
      })
      if (mapped.length > 0) {
        allEmojis.value = mapped
        lastUpdated.value = Date.now()
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: lastUpdated.value, data: mapped })) } catch (err) { /* ignore */ }
      }
    } catch (err) {
      // fetching failed – leave the static dataset in place
    } finally {
      isLoading.value = false
    }
  }

  function getCategories() {
    const set = new Set<string>()
    for (const e of allEmojis.value) set.add(String(e.category || ''))
    return Array.from(set).filter(Boolean)
  }

  function getByCategory(cat: string) {
    const c = (cat || '').toLowerCase()
    // Use emoji data order for all categories
    return allEmojis.value.filter(e => String(e.category || '').toLowerCase() === c)
  }

  return { allEmojis, isLoading, lastUpdated, init, getByCategory, loadFromUrl, getCategories }
})

export default useEmojiStore
