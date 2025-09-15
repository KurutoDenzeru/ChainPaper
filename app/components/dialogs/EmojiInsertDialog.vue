<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-2xl sm:!max-w-2xl !max-w-full p-2 sm:p-6">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Smile class="h-5 w-5 text-green-600" /> Insert Emoji
        </DialogTitle>
        <DialogDescription>Choose an emoji to insert into your document</DialogDescription>
      </DialogHeader>

      <div class="mt-2 sm:mt-4">
        <div class="relative mb-3 sm:mb-4">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input v-model="searchQuery" placeholder="Search emojis..."
            class="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 text-base sm:text-base" />
        </div>

        <TooltipProvider>
          <div v-if="showSearch" class="mt-2">
            <div v-if="searchResults.length"
              class="grid grid-cols-5 sm:grid-cols-8 gap-1 max-h-48 overflow-y-auto py-2 px-2 emoji-scroll">
              <Tooltip v-for="e in searchResults" :key="e.char">
                <TooltipTrigger as-child>
                  <button :class="[
                    'p-2 rounded text-2xl transition-colors cursor-pointer',
                    selectedEmoji && selectedEmoji.char === e.char
                      ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]" :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                    <span>{{ e.char }}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent class="whitespace-nowrap" :portal="true">{{ e.name }} <span
                    class="text-muted-foreground ml-1">{{
                      e.shortcode }}</span></TooltipContent>
              </Tooltip>
            </div>
            <div v-else class="text-center text-gray-500 py-8">No emojis found</div>
          </div>

          <div v-else>
            <Tabs v-model="activeTab" class="w-full">
              <TabsList
                class="flex w-full items-center gap-2 overflow-x-auto py-1 no-scrollbar bg-gray-50 dark:bg-gray-800 rounded-md p-1">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <TabsTrigger value="recent"
                      class="text-lg px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-gray-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:ring-2 data-[state=active]:ring-green-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-green-500 dark:data-[state=active]:ring-green-500">
                      🕒</TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Recent</TooltipContent>
                </Tooltip>

                <Tooltip v-for="cat in categoriesOrdered" :key="cat">
                  <TooltipTrigger as-child>
                    <TabsTrigger :value="cat"
                      class="text-lg px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-gray-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:ring-2 data-[state=active]:ring-green-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-green-500 dark:data-[state=active]:ring-green-500">
                      {{ categoryIcon(cat) }}</TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{{ categoryLabel(cat) }}</TooltipContent>
                </Tooltip>
              </TabsList>

              <TabsContent value="recent" class="mt-4">
                <div v-if="filteredRecent.length"
                  class="grid grid-cols-5 sm:grid-cols-8 gap-1 max-h-48 overflow-y-auto py-2 px-2 emoji-scroll pointer-events-auto">
                  <Tooltip v-for="e in filteredRecent" :key="e.char">
                    <TooltipTrigger as-child>
                      <button :class="[
                        'p-2 rounded text-2xl transition-colors cursor-pointer',
                        selectedEmoji && selectedEmoji.char === e.char
                          ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      ]" :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                        <span>{{ e.char }}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent class="whitespace-nowrap" :portal="true">{{ e.name }} <span
                        class="text-muted-foreground ml-1">{{
                          e.shortcode }}</span></TooltipContent>
                  </Tooltip>
                </div>
                <div v-else class="text-center text-gray-500 py-8">No recently used emojis</div>
              </TabsContent>

              <TabsContent v-for="cat in categoriesOrdered" :key="cat" :value="cat" class="mt-4">
                <div v-if="getCategoryEmojis(cat).length"
                  class="grid grid-cols-5 sm:grid-cols-8 gap-1 max-h-48 overflow-y-auto py-2 px-2 emoji-scroll pointer-events-auto">
                  <Tooltip v-for="e in getCategoryEmojis(cat)" :key="e.char">
                    <TooltipTrigger as-child>
                      <button :class="[
                        'p-2 rounded text-2xl transition-colors cursor-pointer',
                        selectedEmoji && selectedEmoji.char === e.char
                          ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      ]" :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                        <span>{{ e.char }}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent class="whitespace-nowrap" :portal="true">{{ e.name }} <span
                        class="text-muted-foreground ml-1">{{
                          e.shortcode }}</span></TooltipContent>
                  </Tooltip>
                </div>
                <div v-else class="text-center text-gray-500 py-8">No emojis in {{ categoryLabel(cat) }}</div>
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      </div>

      <DialogFooter class="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
        <div class="flex-1 text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
          <span v-if="selectedEmoji">Selected: <span class="ml-2 text-2xl">{{ selectedEmoji.char }}</span> <span
              class="ml-2 font-medium">{{ selectedEmoji.name }}</span></span>
        </div>
        <div class="flex gap-2 w-full sm:w-1/3">
          <Button variant="outline" class="flex-1" @click="$emit('update:open', false)">Cancel</Button>
          <Button
            class="flex-1 bg-green-600 hover:bg-green-700 text-white border-none dark:bg-green-500 dark:hover:bg-green-600"
            :disabled="!selectedEmoji" @click="confirmInsert">
            <Plus class="h-5 w-5 text-white" />
            <span class="ml-2">Insert</span>
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
  import { Smile, Search, Plus } from 'lucide-vue-next'
  import STATIC_EMOJIS from '@/lib/static-emojis'

  interface Emoji {
    char: string
    name: string
    shortcode: string
    category?: string
    keywords?: string[]
  }

  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'insert-emoji', emoji: Emoji): void
  }>()

  const activeTab = ref<string>('recent')
  const searchQuery = ref<string>('')
  const recentEmojis = ref<Emoji[]>([])
  const selectedEmoji = ref<Emoji | null>(null)

  // Normalize categories to lowercase canonical keys
  function normalizeCategory(c?: string) {
    if (!c) return ''
    return String(c).toLowerCase()
  }

  const allEmojis = STATIC_EMOJIS.map(e => ({
    char: e.char,
    name: e.name,
    shortcode: e.shortcode || '',
    category: normalizeCategory(e.category),
    keywords: (e.keywords || []).map(k => String(k).toLowerCase())
  })) as Emoji[]

  const categories = computed(() => {
    const s = new Set<string>()
    for (const e of allEmojis) if (e.category) s.add(e.category)
    return Array.from(s)
  })

  const preferredOrder = ['smileys', 'people', 'animals', 'food', 'activities', 'travel', 'objects']
  const categoriesOrdered = computed(() => {
    const available = categories.value
    const head = preferredOrder.filter(p => available.includes(p))
    // limit tabs up to and including 'flags' so we don't show too many tabs
    const stopIndex = head.indexOf('flags')
    const limitedHead = stopIndex >= 0 ? head.slice(0, stopIndex + 1) : head
    return limitedHead
  })

  function matchesQuery(e: Emoji, q: string) {
    if (!q) return true
    const s = q.toLowerCase()
    if (e.char === q) return true
    if ((e.name || '').toLowerCase().includes(s)) return true
    if ((e.shortcode || '').toLowerCase().includes(s)) return true
    if ((e.keywords || []).some(k => k.includes(s))) return true
    return false
  }

  const searchResults = computed(() => {
    const q = searchQuery.value.trim()
    if (!q) return []
    return allEmojis.filter(e => matchesQuery(e, q))
  })

  const showSearch = computed(() => searchQuery.value.trim().length > 0)

  function getCategoryEmojis(cat: string) {
    const q = searchQuery.value.trim().toLowerCase()
    const list = allEmojis.filter(e => (e.category || '').toLowerCase() === cat.toLowerCase())
    return q ? list.filter(e => matchesQuery(e, q)) : list
  }

  const filteredRecent = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return q ? recentEmojis.value.filter(e => matchesQuery(e, q)) : recentEmojis.value
  })

  function categoryIcon(cat: string) {
    const map: Record<string, string> = {
      smileys: '😀',
      people: '👋',
      animals: '🐶',
      food: '🍎',
      activities: '⚽',
      travel: '✈️',
      objects: '💡'
    }
    return map[cat.toLowerCase()] || '📂'
  }

  function categoryLabel(cat: string) {
    const map: Record<string, string> = {
      smileys: 'Smileys & Emotion',
      people: 'People & Body',
      animals: 'Animals',
      food: 'Food & Drink',
      activities: 'Activities',
      travel: 'Travel',
      objects: 'Objects'
    }
    return map[cat.toLowerCase()] || (cat.charAt(0).toUpperCase() + cat.slice(1))
  }

  onMounted(() => {
    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try { recentEmojis.value = JSON.parse(saved) } catch { /* ignore */ }
    }
  })

  function selectEmoji(e: Emoji) {
    recentEmojis.value = [e, ...recentEmojis.value.filter(r => r.char !== e.char)].slice(0, 24)
    try { localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value)) } catch (_) { }
    selectedEmoji.value = e
  }

  function confirmInsert() {
    if (!selectedEmoji.value) return
    emit('insert-emoji', selectedEmoji.value)
    emit('update:open', false)
  }
</script>

<style scoped>

  /* green scrollbar for emoji grids */
  .emoji-scroll::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }

  .emoji-scroll::-webkit-scrollbar-track {
    background: transparent
  }

  .emoji-scroll::-webkit-scrollbar-thumb {
    background-color: #16a34a;
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box
  }

  .emoji-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #15803d
  }

  /* dark mode scrollbar */
  :root.dark .emoji-scroll::-webkit-scrollbar-thumb {
    background-color: #10b981
  }

  :root.dark .emoji-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #059669
  }

  /* Firefox */
  .emoji-scroll {
    scrollbar-width: thin;
    scrollbar-color: #16a34a transparent
  }

  :root.dark .emoji-scroll {
    scrollbar-color: #10b981 transparent
  }

</style>
