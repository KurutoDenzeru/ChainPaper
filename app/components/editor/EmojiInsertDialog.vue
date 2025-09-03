<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Smile class="h-5 w-5" />
          Insert Emoji
        </DialogTitle>
        <DialogDescription>
          Choose an emoji to insert into your document
        </DialogDescription>
      </DialogHeader>

      <!-- Search Input -->
      <div class="relative mb-4">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input v-model="searchQuery" placeholder="Search emojis..." class="pl-10" />
      </div>

      <div class="mt-4">
        <TooltipProvider>
          <!-- When the user is searching, temporarily replace the tab UI with a simple Search Results label + grid -->
          <div v-if="searchQuery.trim()" class="w-full">
            <div class="mb-2 text-sm text-gray-600">Search Results for "{{ searchQuery }}"</div>
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button v-for="emoji in searchResults" :key="emoji.char" @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
            <div v-if="searchResults.length === 0" class="text-center text-gray-500 py-8">
              No emojis found matching "{{ searchQuery }}"
            </div>
          </div>
          <div v-else>
            <Tabs v-model="activeTab" class="w-full">
              <TabsList class="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="recent">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>🕒</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Recently used</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="smileys">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>😀</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Smileys & People</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="animals">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>🐶</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Animals & Nature</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="food">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>🍎</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Food & Drink</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="activities">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>⚽</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Activities & Sports</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="travel">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>🚗</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Travel & Places</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="objects">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>💡</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Objects & Symbols</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value="flags">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>🏁</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Flags</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recent" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredRecentEmojis" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredRecentEmojis.length === 0" class="text-center text-gray-500 py-8">
                  <p v-if="!searchQuery.trim()">No recently used emojis</p>
                  <p v-else>No emojis found matching "{{ searchQuery }}"</p>
                </div>
              </TabsContent>

              <TabsContent value="smileys" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredSmileys" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredSmileys.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="animals" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredAnimals" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredAnimals.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="food" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredFood" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredFood.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="activities" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredActivities" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredActivities.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="objects" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredObjects" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredObjects.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="travel" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredTravel" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredTravel.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>

              <TabsContent value="flags" class="mt-4">
                <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <button v-for="emoji in filteredFlags" :key="emoji.char" @click="selectEmoji(emoji)"
                    class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer" :title="emoji.name">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span>{{ emoji.char }}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ emoji.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
                <div v-if="filteredFlags.length === 0" class="text-center text-gray-500 py-8">
                  No emojis found matching "{{ searchQuery }}"
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="$emit('update:open', false)">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useEmojiStore } from '@/stores/emojiStore'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
  import { Smile, Search } from 'lucide-vue-next'

  interface Emoji {
    char: string
    name: string
    shortcode: string
    category?: string
    keywords?: string[]
  }

  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'insert-emoji', emoji: Emoji): void
  }>()

  const activeTab = ref('recent')
  const recentEmojis = ref<Emoji[]>([])
  const searchQuery = ref('')
  const emojiStore = useEmojiStore()
  const isLoading = emojiStore.isLoading
  const allEmojis = emojiStore.allEmojis

  // Convert unified codepoint string (e.g. "1F600" or "1F1FA-1F1F8") to actual character(s)
  function codepointsToChar(unified: string) {
    return unified.split('-').map(u => String.fromCodePoint(parseInt(u, 16))).join('')
  }
  // We now use the centralized Pinia emoji store to initialize and serve emoji data.

  // Detect whether a glyph renders on this platform (avoids tofu/empty squares)
  function isEmojiSupported(emoji: string) {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 20
      const ctx = canvas.getContext('2d')
      if (!ctx) return true
      ctx.clearRect(0, 0, 20, 20)
      ctx.textBaseline = 'top'
      ctx.font = '16px Arial'
      ctx.fillText(emoji, 0, 0)
      const data = ctx.getImageData(0, 0, 20, 20).data
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) return true
      }
      return false
    } catch {
      return true
    }
  }

  // Filtered emoji lists based on search query
  const filteredRecentEmojis = computed(() => {
    if (!searchQuery.value.trim()) return recentEmojis.value
    const q = searchQuery.value.toLowerCase()
    return recentEmojis.value.filter(e => (
      e.char === searchQuery.value ||
      e.name.toLowerCase().includes(q) ||
      e.shortcode.toLowerCase().includes(q) ||
      (e.keywords || []).some(k => k.includes(q))
    ))
  })

  // Helper to match an emoji against the query (exact char, name, shortcode, keywords)
  function matchesQuery(emoji: Emoji, query: string) {
    if (!query) return true
    const q = query.toLowerCase()
    if (emoji.char === query) return true
    if (emoji.char.includes(query)) return true
    if ((emoji.name || '').toLowerCase().includes(q)) return true
    if ((emoji.shortcode || '').toLowerCase().includes(q)) return true
    if ((emoji.keywords || []).some(k => k.includes(q))) return true
    return false
  }

  const filteredSmileys = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'smileys' || e.category === 'people' || e.category === 'emotion') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredAnimals = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'animals' || e.category === 'nature') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredFood = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'food' || e.category === 'food-drink' || e.category === 'food & drink') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredActivities = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'activity' || e.category === 'activities') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredTravel = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'travel' || e.category === 'places') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredObjects = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'objects' || e.category === 'symbols') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  const filteredFlags = computed(() => {
    const query = searchQuery.value.trim()
    return allEmojis.filter((e: Emoji) => (e.category === 'flags' || e.category === 'country-flag' || e.category === 'regional') && matchesQuery(e, query)).sort((a: Emoji, b: Emoji) => a.name.localeCompare(b.name))
  })

  // Search results when user types something - includes exact char matches and fuzzy
  const searchResults = computed(() => {
    const q = searchQuery.value.trim()
    if (!q) return []
    return allEmojis.filter((e: Emoji) => matchesQuery(e, q))
  })

  // Load recent emojis from localStorage
  onMounted(() => {
    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try {
        recentEmojis.value = JSON.parse(saved)
      } catch {
        // Ignore parsing errors
      }
    }
    // Initialize store (uses cache + background fetch). After init, filter unsupported glyphs.
    emojiStore.init().then(() => {
      try {
        // filter out unsupported glyphs in place
        const supported = emojiStore.allEmojis.filter((e: Emoji) => isEmojiSupported(e.char))
        emojiStore.allEmojis = supported
      } catch (e) {
        // ignore
      }
    }).catch(() => {
      // ignore
    })
  })

  function selectEmoji(emoji: Emoji) {
    // Add to recent emojis
    const filtered = recentEmojis.value.filter(e => e.char !== emoji.char)
    recentEmojis.value = [emoji, ...filtered].slice(0, 24) // Keep only 24 recent emojis

    // Save to localStorage
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value))

    // Emit the emoji
    emit('insert-emoji', emoji)
    emit('update:open', false)
  }
</script>
