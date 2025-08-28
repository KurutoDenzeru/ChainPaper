<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <BarChart3 class="w-5 h-5 text-gray-600" />
          <span>Document Statistics</span>
        </DialogTitle>
        <DialogDescription>
          Detailed information about your document's length and structure.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-start gap-3">
                    <File class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Characters (with spaces)</div>
              <div class="text-lg font-medium">{{ stats.charsWithSpaces }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Type class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Characters (no spaces)</div>
              <div class="text-lg font-medium">{{ stats.charsNoSpaces }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <List class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Words</div>
              <div class="text-lg font-medium">{{ stats.words }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <FileText class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Sentences</div>
              <div class="text-lg font-medium">{{ stats.sentences }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Hash class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Paragraphs</div>
              <div class="text-lg font-medium">{{ stats.paragraphs }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Clock class="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div class="text-xs text-gray-500">Estimated reading time</div>
              <div class="text-lg font-medium">{{ stats.readingMinutes }} min</div>
            </div>
          </div>
        </div>

        <div class="border-t pt-3">
          <div class="text-sm text-gray-600">Pages: <span class="font-medium">{{ stats.pages }}</span></div>
          <div class="text-sm text-gray-600">Average words per paragraph: <span class="font-medium">{{ stats.avgWordsPerParagraph }}</span></div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" class="w-full" @click="handleOpenChange(false)">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Type, List, FileText, Hash, Clock, File, BarChart3 } from 'lucide-vue-next'

interface Props {
  open?: boolean
  stats?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  stats: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = ref(props.open)

watch(() => props.open, (v) => {
  isOpen.value = v
})

function handleOpenChange(v: boolean) {
  isOpen.value = v
  emit('update:open', v)
}

const stats = computed(() => ({
  charsWithSpaces: props.stats?.charsWithSpaces ?? 0,
  charsNoSpaces: props.stats?.charsNoSpaces ?? 0,
  words: props.stats?.words ?? 0,
  sentences: props.stats?.sentences ?? 0,
  paragraphs: props.stats?.paragraphs ?? 0,
  readingMinutes: props.stats?.readingMinutes ?? 0,
  pages: props.stats?.pages ?? 1,
  avgWordsPerParagraph: props.stats?.avgWordsPerParagraph ?? 0,
}))
</script>

<style scoped>
/* small tweaks */
</style>
