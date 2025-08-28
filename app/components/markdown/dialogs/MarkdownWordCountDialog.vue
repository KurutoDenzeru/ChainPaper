<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <BarChart3 class="w-5 h-5 text-gray-600" />
          <span>Markdown Statistics</span>
        </DialogTitle>
        <DialogDescription>
          Length and structure of your markdown document.
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-2">
        <div class="grid grid-cols-2 gap-4">
          <Stat icon="File" label="Chars (with spaces)" :value="stats.charsWithSpaces" />
          <Stat icon="Type" label="Chars (no spaces)" :value="stats.charsNoSpaces" />
          <Stat icon="List" label="Words" :value="stats.words" />
          <Stat icon="FileText" label="Sentences" :value="stats.sentences" />
          <Stat icon="Hash" label="Paragraphs" :value="stats.paragraphs" />
          <Stat icon="Clock" label="Read time" :value="stats.readingMinutes + ' min'" />
        </div>
        <div class="border-t pt-3 space-y-1 text-sm text-gray-600">
          <div>Lines: <span class="font-medium">{{ stats.lines }}</span></div>
          <div>Avg words / paragraph: <span class="font-medium">{{ stats.avgWordsPerParagraph }}</span></div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" class="w-full" @click="handleOpenChange(false)">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, computed, watch, h, defineComponent } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Type, List, FileText, Hash, Clock, File, BarChart3 } from 'lucide-vue-next'

interface Props { open?: boolean; stats?: Record<string, any> }
const props = withDefaults(defineProps<Props>(), { open:false, stats: undefined })
const emit = defineEmits<{ 'update:open':[boolean] }>()
const isOpen = ref(props.open)
watch(()=>props.open, v=> isOpen.value = v )
function handleOpenChange(v:boolean){ isOpen.value = v; emit('update:open', v) }

const stats = computed(()=> ({
  charsWithSpaces: props.stats?.charsWithSpaces ?? 0,
  charsNoSpaces: props.stats?.charsNoSpaces ?? 0,
  words: props.stats?.words ?? 0,
  sentences: props.stats?.sentences ?? 0,
  paragraphs: props.stats?.paragraphs ?? 0,
  readingMinutes: props.stats?.readingMinutes ?? 0,
  lines: props.stats?.lines ?? 0,
  avgWordsPerParagraph: props.stats?.avgWordsPerParagraph ?? 0,
}))

const iconMap: Record<string, any> = { Type, List, FileText, Hash, Clock, File }

const Stat = defineComponent({
  name: 'Stat',
  props: { icon: { type: String, required: true }, label: { type: String, required: true }, value: { required: true } },
  setup(p){
    return ()=>{
      const Icon = iconMap[p.icon as string] || File
      return h('div', { class: 'flex items-start gap-3' }, [
        h(Icon, { class: 'w-5 h-5 text-gray-600 mt-1' }),
        h('div', {}, [
          h('div', { class: 'text-xs text-gray-500' }, p.label as any),
          h('div', { class: 'text-lg font-medium' }, String(p.value))
        ])
      ])
    }
  }
})
</script>
