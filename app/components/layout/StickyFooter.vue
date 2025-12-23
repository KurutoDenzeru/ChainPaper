<template>
  <div class="fixed bottom-4 z-50 inset-x-0 pointer-events-none">
    <div class="mx-auto pointer-events-auto px-4 flex justify-center">
      <TooltipProvider>
        <div
          class="dock flex items-center gap-3 max-w-[90vw] md:max-w-xl bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg h-12 px-3 sm:px-4 text-gray-700 dark:text-gray-200 backdrop-blur-sm"
          role="toolbar" aria-label="Editor dock">
          <!-- Left group: Mode toggle + counts -->
          <div class="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleMode"
                  :aria-label="mode === 'source' ? 'Switch to reader view' : 'Switch to source view'"
                  :aria-pressed="mode === 'source'"
                  :title="mode === 'source' ? 'Switch to Reader View' : 'Switch to Source View'">
                  <BookOpen v-if="mode === 'source'" class="w-4 h-4" aria-hidden="true" />
                  <Edit v-else class="w-4 h-4" aria-hidden="true" />
                </Button>

                <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ mode === 'source' ? 'Switch to Reader View' : 'Switch to Source View' }}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0 sm:hidden" @click="showWordCountDialog = true"
                  aria-label="Document statistics">
                  <FileText class="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Document statistics</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <div class="hidden sm:flex items-center gap-2 cursor-pointer" @click="showWordCountDialog = true"
                  role="button" aria-label="Open document statistics">
                  <FileText class="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                  <span class="text-xs font-medium">Words</span>
                  <span class="font-medium">{{ wordCount || 0 }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed word count statistics</p>
              </TooltipContent>
            </Tooltip>

            <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block"></div>

            <Tooltip>
              <TooltipTrigger as-child>
                <div class="hidden sm:flex items-center gap-2 cursor-pointer" @click="showWordCountDialog = true">
                  <Hash class="w-4 h-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                  <span class="text-xs font-medium">Characters</span>
                  <span class="font-medium">{{ characterCount || 0 }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed character count statistics</p>
              </TooltipContent>
            </Tooltip>

            <WordCountDialog :open="showWordCountDialog" :stats="{ words: wordCount, characters: characterCount }"
              @update:open="v => showWordCountDialog = v" />
          </div>

          <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <!-- Zoom group -->
          <div class="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button type="button" @click="changeZoom(-25)"
                  class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                  aria-label="Zoom out">
                  <Minus class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom out (decrease by 25%)</p>
              </TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger as-child>
                <button type="button" aria-haspopup="dialog" :aria-expanded="false"
                  class="w-16 h-8 rounded flex items-center justify-center bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabindex="0">
                  <Input type="number"
                    class="w-14 text-center text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-gray-800 dark:text-gray-100"
                    v-model="zoomModel" min="50" max="200" placeholder="100" aria-label="Zoom percentage"
                    role="spinbutton" aria-valuemin="50" aria-valuemax="200"
                    :aria-valuenow="isFit ? 100 : zoomPercent" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                class="w-32 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                <div class="flex flex-col">
                  <button
                    class="text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium"
                    @click="selectZoom('fit')">
                    Fit
                  </button>
                  <div class="border-t my-1 border-gray-100 dark:border-gray-700" />
                  <button v-for="opt in zoomOptions" :key="opt"
                    class="text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                    @click="selectZoom(opt)">
                    {{ opt }}%
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button type="button" @click="changeZoom(25)"
                  class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                  aria-label="Zoom in">
                  <Plus class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom in (increase by 25%)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
const showWordCountDialog = ref(false)
import { ref, computed, watch } from 'vue'
import { Minus, Plus, BookOpen, Edit, FileText, Hash } from 'lucide-vue-next'

// props for markdown editor specific data
const props = defineProps<{
  wordCount?: number
  characterCount?: number
  mode?: 'source' | 'reader'
  zoom?: number
  fitMode?: boolean
}>()

// emit events for markdown editor
const emit = defineEmits<{
  (e: 'set-zoom', level: number | 'fit'): void
  (e: 'word-count'): void
  (e: 'toggle-mode'): void
}>()

const zoomPercent = ref<number>(props.zoom ?? 100)
const isFit = ref<boolean>(!!props.fitMode)

// keep fit state in sync
watch(() => props.fitMode, (v) => {
  isFit.value = !!v
})

// sync when parent updates numeric zoom
watch(() => props.zoom, (v) => {
  if (typeof v === 'number') {
    isFit.value = false
    zoomPercent.value = Math.round(v)
  }
})

// Computed model for the Input component
const zoomModel = computed<string | number>({
  get: () => (isFit.value ? 100 : zoomPercent.value),
  set: (v: string | number) => {
    const n = Number(v)
    if (Number.isNaN(n)) return
    isFit.value = false
    zoomPercent.value = Math.min(200, Math.max(50, Math.round(n)))
    emit('set-zoom', zoomPercent.value)
  },
})

const zoomOptions = [50, 75, 100, 125, 150, 175, 200]

const changeZoom = (delta: number) => {
  zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta))
  isFit.value = false
  emit('set-zoom', zoomPercent.value)
}

const selectZoom = (opt: number | 'fit') => {
  if (opt === 'fit') {
    emit('set-zoom', 'fit')
    return
  }
  zoomPercent.value = Math.min(200, Math.max(50, Math.round(opt)))
  isFit.value = false
  emit('set-zoom', zoomPercent.value)
}

const toggleMode = () => {
  emit('toggle-mode')
}
</script>

<style scoped>
/* Keep dock visually small and constrained */
.dock {
  max-width: min(90vw, 36rem);
}

@media (max-width: 640px) {
  .dock {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    height: 44px;
  }
}
</style>
