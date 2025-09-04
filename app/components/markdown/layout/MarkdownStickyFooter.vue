<template>
  <div class="fixed inset-x-0 bottom-1 z-50 pointer-events-none">
    <div class="w-full mx-auto pointer-events-auto px-4">
      <TooltipProvider>
        <div
          class="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm h-12 px-4 md:h-10">
          <!-- Left: Mode toggle + Word Count / Character Count -->
          <div class="flex items-center gap-4 text-xs text-gray-600">
            <!-- Mode label + toggle (far left) -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium">Mode:</span>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="toggleMode">
                    <BookOpen v-if="mode === 'source'" class="w-4 h-4" />
                    <Edit v-else class="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ mode === 'source' ? 'Switch to Reader View' : 'Switch to Source View' }}</p>
                </TooltipContent>
              </Tooltip>
              <div class="h-6 w-px bg-gray-300 mx-1"></div>
            </div>

            <Tooltip>
              <TooltipTrigger as-child>
                <div class="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 cursor-pointer"
                  @click="showWordCountDialog = true">
                  <span class="font-medium">Words</span>
                  <span class="text-gray-800">{{ wordCount || 0 }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed word count statistics</p>
              </TooltipContent>
            </Tooltip>
            <MarkdownWordCountDialog :open="showWordCountDialog"
              :stats="{ words: wordCount, characters: characterCount }" @update:open="v => showWordCountDialog = v" />
            <div class="hidden sm:flex items-center gap-2">•</div>
            <Tooltip>
              <TooltipTrigger as-child>
                <div class="hidden sm:flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 cursor-pointer"
                  @click="showWordCountDialog = true">
                  <span class="font-medium">Characters</span>
                  <span class="text-gray-800">{{ characterCount || 0 }}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed character count statistics</p>
              </TooltipContent>
            </Tooltip>
            <div class="hidden md:flex items-center gap-2">•</div>
            <!-- duplicate mode display removed; use far-left control -->
          </div>

          <!-- Middle: spacer -->
          <div class="flex-1"></div>

          <!-- Right: Mode toggle and Zoom controls -->
          <div class="flex items-center gap-2">
            <!-- right-side duplicate mode toggles removed; use far-left control -->

            <!-- Zoom controls -->
            <Tooltip>
              <TooltipTrigger as-child>
                <Button type="button" @click="changeZoom(-25)"
                  class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                  aria-label="Zoom out">
                  <Minus class="w-4 h-4 text-gray-600" />
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
                  <!-- Provide accessible name and spinbutton semantics for screen readers -->
                  <Input type="number" class="w-16 text-center text-sm rounded-md border border-gray-200 px-2 py-1"
                    v-model="zoomModel" min="50" max="200" placeholder="100" aria-label="Zoom percentage"
                    role="spinbutton" aria-valuemin="50" aria-valuemax="200"
                    :aria-valuenow="isFit ? 100 : zoomPercent" />
                </button>
              </PopoverTrigger>
              <PopoverContent class="w-32 p-2">
                <div class="flex flex-col">
                  <button class="text-left px-2 py-1 rounded hover:bg-gray-100 font-medium" @click="selectZoom('fit')">
                    Fit
                  </button>
                  <div class="border-t my-1" />
                  <button v-for="opt in zoomOptions" :key="opt" class="text-left px-2 py-1 rounded hover:bg-gray-100"
                    @click="selectZoom(opt)">
                    {{ opt }}%
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button type="button" @click="changeZoom(25)"
                  class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                  aria-label="Zoom in">
                  <Plus class="w-4 h-4 text-gray-600" />
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
  import MarkdownWordCountDialog from '~/components/markdown/dialogs/MarkdownWordCountDialog.vue'
  const showWordCountDialog = ref(false)
  import { ref, computed, watch } from 'vue'
  import { Minus, Plus, BookOpen, Edit } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
  import { Input } from '@/components/ui/input'
  import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

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

  /* keep footer visually small on mobile */
  .max-w-4xl {
    max-width: 64rem;
  }
</style>
