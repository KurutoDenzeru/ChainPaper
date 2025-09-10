<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-3xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Hash class="w-5 h-5 text-green-600" />
          Markdown Document Statistics
        </DialogTitle>
        <DialogDescription>
          Detailed statistics and analysis of your markdown document.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh]">
        <div class="space-y-6 p-3">
          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ stats.words }}</div>
              <div class="text-sm text-blue-700 dark:text-blue-200">Words</div>
            </div>
            <div class="p-3 bg-green-50 dark:bg-green-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-300">{{ stats.characters }}</div>
              <div class="text-sm text-green-700 dark:text-green-200">Characters</div>
            </div>
            <div class="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-300">{{ stats.charactersNoSpaces }}</div>
              <div class="text-sm text-purple-700 dark:text-purple-200">No Spaces</div>
            </div>
            <div class="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-orange-600 dark:text-orange-300">{{ stats.paragraphs }}</div>
              <div class="text-sm text-orange-700 dark:text-orange-200">Paragraphs</div>
            </div>
          </div>

          <!-- Detailed Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText class="w-4 h-4" />
                Text Analysis
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Lines:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.lines }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Sentences:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.sentences }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Average words per sentence:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.avgWordsPerSentence }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Reading time:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.readingTime }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Hash class="w-4 h-4" />
                Markdown Elements
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Headings:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.headings }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Links:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.links }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Images:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.images }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Code blocks:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.codeBlocks }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Lists:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.lists }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Tables:</span>
                  <span class="font-medium dark:text-gray-100">{{ stats.tables }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Heading Breakdown -->
          <div v-if="headingBreakdown.length > 0" class="space-y-3">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Heading class="w-4 h-4" />
              Heading Structure
            </h4>
            <div class="space-y-2">
              <div v-for="heading in headingBreakdown" :key="`${heading.level}-${heading.text}`"
                class="flex items-center gap-2 text-sm">
                <div class="flex-shrink-0" :style="{ marginLeft: `${(heading.level - 1) * 16}px` }">
                  <component :is="getHeadingIcon(heading.level)" class="w-4 h-4 text-gray-500" />
                </div>
                <span class="text-gray-600 dark:text-gray-300">H{{ heading.level }}:</span>
                <span class="font-medium truncate dark:text-gray-100">{{ heading.text }}</span>
              </div>
            </div>
          </div>

          <!-- Top Words -->
          <div v-if="topWords.length > 0" class="space-y-3">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 class="w-4 h-4" />
              Most Frequent Words
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="word in topWords" :key="word.word"
                class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span class="font-medium dark:text-gray-100">{{ word.word }}</span>
                <span class="text-gray-600 dark:text-gray-300">{{ word.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter>
        <div class="flex gap-2 w-full">
          <Button variant="outline" class="w-1/2" @click="$emit('update:open', false)">
            Close
          </Button>
          <Button variant="outline"
            class="w-1/2 bg-green-600 hover:bg-green-700 text-white hover:text-white border-none dark:bg-green-500 dark:hover:bg-green-600"
            @click="exportStats">
            <Download class="w-4 h-4 mr-2 text-white" />
            Export Stats
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import {
    Hash,
    FileText,
    Heading,
    BarChart3,
    Download,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6
  } from 'lucide-vue-next'
  import { ScrollArea } from '@/components/ui/scroll-area'
  import { useMarkdownDocStore } from '@/stores/markdownDoc'

  interface Props {
    open: boolean
  }

  defineProps<Props>()
  defineEmits<{
    'update:open': [value: boolean]
  }>()

  const store = useMarkdownDocStore()

  // Calculate statistics
  const stats = computed(() => {
    const content = store.content

    // Basic counts
    const characters = content.length
    const charactersNoSpaces = content.replace(/\s/g, '').length
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const lines = content.split('\n').length
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length

    // Sentences (simple approximation)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences * 10) / 10 : 0

    // Reading time (average 200 words per minute)
    const readingMinutes = Math.ceil(words / 200)
    const readingTime = readingMinutes === 1 ? '1 minute' : `${readingMinutes} minutes`

    // Markdown elements
    const headings = (content.match(/^#{1,6}\s+/gm) || []).length
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length + (content.match(/`[^`\n]+`/g) || []).length
    const lists = (content.match(/^[\s]*[-*+]\s+/gm) || []).length + (content.match(/^[\s]*\d+\.\s+/gm) || []).length
    const tables = (content.match(/\|.*\|/g) || []).length

    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      avgWordsPerSentence,
      readingTime,
      headings,
      links,
      images,
      codeBlocks,
      lists,
      tables
    }
  })

  // Heading breakdown
  const headingBreakdown = computed(() => {
    const content = store.content
    const headingMatches = content.matchAll(/^(#{1,6})\s+(.+)$/gm)
    const headings = []

    for (const match of headingMatches) {
      if (match[1] && match[2]) {
        headings.push({
          level: match[1].length,
          text: match[2].trim()
        })
      }
    }

    return headings
  })

  // Top words analysis
  const topWords = computed(() => {
    const content = store.content.toLowerCase()
    const words = content.match(/\b[a-z]{3,}\b/g) || []

    // Common words to exclude
    const commonWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
    ])

    const wordCount = new Map<string, number>()

    for (const word of words) {
      if (!commonWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1)
      }
    }

    return Array.from(wordCount.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
  })

  function getHeadingIcon(level: number) {
    switch (level) {
      case 1: return Heading1
      case 2: return Heading2
      case 3: return Heading3
      case 4: return Heading4
      case 5: return Heading5
      case 6: return Heading6
      default: return Heading
    }
  }

  function exportStats() {
    const statsData = {
      title: store.title,
      timestamp: new Date().toISOString(),
      statistics: stats.value,
      headingStructure: headingBreakdown.value,
      topWords: topWords.value
    }

    const blob = new Blob([JSON.stringify(statsData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${store.title.replace(/[^a-z0-9]/gi, '_')}_stats.json`
    link.click()
    URL.revokeObjectURL(url)
  }
</script>
