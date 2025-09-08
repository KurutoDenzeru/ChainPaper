<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Smile class="h-5 w-5" /> Insert Emoji
        </DialogTitle>
        <DialogDescription>Choose an emoji to insert into your document</DialogDescription>
      </DialogHeader>

      <div class="mt-4">
        <div class="relative mb-4">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Search emojis..." class="pl-10" />
        </div>

        <TooltipProvider>
          <div v-if="showSearch" class="mt-2">
            <div v-if="searchResults.length" class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <Tooltip v-for="e in searchResults" :key="e.char">
                <TooltipTrigger as-child>
                  <button class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer"
                    :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                    <span>{{ e.char }}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent class="whitespace-nowrap">{{ e.name }} <span class="text-muted-foreground ml-1">{{
                    e.shortcode }}</span></TooltipContent>
              </Tooltip>
            </div>
            <div v-else class="text-center text-gray-500 py-8">No emojis found</div>
          </div>

          <div v-else>
            <Tabs v-model="activeTab" class="w-full">
              <TabsList class="flex w-full items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <TabsTrigger value="recent" class="text-lg">🕒</TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Recent</TooltipContent>
                </Tooltip>

                <Tooltip v-for="cat in categoriesOrdered" :key="cat">
                  <TooltipTrigger as-child>
                    <TabsTrigger :value="cat" class="text-lg">{{ categoryIcon(cat) }}</TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{{ categoryLabel(cat) }}</TooltipContent>
                </Tooltip>
              </TabsList>

              <TabsContent value="recent" class="mt-4">
                <div v-if="filteredRecent.length" class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <Tooltip v-for="e in filteredRecent" :key="e.char">
                    <TooltipTrigger as-child>
                      <button class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer"
                        :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                        <span>{{ e.char }}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent class="whitespace-nowrap">{{ e.name }} <span class="text-muted-foreground ml-1">{{
                        e.shortcode }}</span></TooltipContent>
                  </Tooltip>
                </div>
                <div v-else class="text-center text-gray-500 py-8">No recently used emojis</div>
              </TabsContent>

              <TabsContent v-for="cat in categoriesOrdered" :key="cat" :value="cat" class="mt-4">
                <div v-if="getCategoryEmojis(cat).length" class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  <Tooltip v-for="e in getCategoryEmojis(cat)" :key="e.char">
                    <TooltipTrigger as-child>
                      <button class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer"
                        :title="e.name" @click="selectEmoji(e)" :aria-label="e.name">
                        <span>{{ e.char }}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent class="whitespace-nowrap">{{ e.name }} <span class="text-muted-foreground ml-1">{{
                        e.shortcode }}</span></TooltipContent>
                  </Tooltip>
                </div>
                <div v-else class="text-center text-gray-500 py-8">No emojis in {{ categoryLabel(cat) }}</div>
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="$emit('update:open', false)">Cancel</Button>
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
  import { Smile, Search } from 'lucide-vue-next'
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

  const preferredOrder = ['smileys', 'people', 'animals', 'food', 'activities', 'travel', 'objects', 'symbols', 'flags', 'nature']
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
      objects: '💡',
      symbols: '❤️',
      flags: '🇺🇸',
      nature: '🌞'
    }
    return map[cat.toLowerCase()] || '📂'
  }

  function categoryLabel(cat: string) {
    const map: Record<string, string> = {
      smileys: 'Smileys & Emotion',
      people: 'People & Body',
      animals: 'Animals & Nature',
      food: 'Food & Drink',
      activities: 'Activities & Sports',
      travel: 'Travel & Places',
      objects: 'Objects',
      symbols: 'Symbols',
      flags: 'Flags',
      nature: 'Nature'
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
    emit('insert-emoji', e)
    emit('update:open', false)
  }
</script>
