<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-4xl">
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

        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="flex w-full items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" class="mt-4">
            <EmojiGrid :items="filteredRecentEmojis" @select="selectEmoji" empty-text="No recently used emojis" />
          </TabsContent>

          <TabsContent v-for="cat in categories" :key="cat" :value="cat" class="mt-4">
            <EmojiGrid :items="makeCategoryFilter(cat)" @select="selectEmoji" :empty-text="`No emojis in ${cat}`" />
          </TabsContent>
        </Tabs>
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="$emit('update:open', false)">Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useEmojiStore } from '@/stores/emojiStore'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Smile, Search } from 'lucide-vue-next'

  // Local inline EmojiGrid component
  const EmojiGrid = {
    props: {
      items: { type: Array as () => any[], required: true },
      emptyText: { type: String, default: 'No emojis' }
    },
    emits: ['select'],
    template: `
    <div>
      <div v-if="items && items.length" class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
        <button v-for="e in items" :key="e.char" class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors cursor-pointer"
          :title="e.name" @click="$emit('select', e)" :aria-label="e.name">
          <span>{{ e.char }}</span>
        </button>
      </div>
      <div v-else class="text-center text-gray-500 py-8">{{ emptyText }}</div>
    </div>
  `
  }

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

  const activeTab = ref('recent')
  const searchQuery = ref('')
  const recentEmojis = ref<Emoji[]>([])

  const store = useEmojiStore()
  const allEmojis = store.allEmojis

  const categories = computed(() => store.getCategories())

  function matchesQuery(e: Emoji, q: string) {
    if (!q) return true
    const s = q.toLowerCase()
    return e.char === q || (e.name || '').toLowerCase().includes(s) || (e.shortcode || '').toLowerCase().includes(s) || (e.keywords || []).some(k => k.includes(s))
  }

  function makeCategoryFilter(category: string) {
    return computed(() => {
      const q = searchQuery.value.trim()
      return store.getByCategory(category).filter(e => matchesQuery(e, q))
    })
  }

  const filteredRecentEmojis = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return recentEmojis.value
    return recentEmojis.value.filter(e => matchesQuery(e, q))
  })

  onMounted(() => {
    store.init()
    // background attempt to load full emoji JSON if available
    store.loadFromUrl('/emoji.json').catch(() => { })

    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try { recentEmojis.value = JSON.parse(saved) } catch { /* ignore */ }
    }
  })

  function selectEmoji(e: Emoji) {
    recentEmojis.value = [e, ...recentEmojis.value.filter(r => r.char !== e.char)].slice(0, 24)
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value))
    emit('insert-emoji', e)
    emit('update:open', false)
  }
</script>
