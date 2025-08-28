<template>
  <div class="fixed inset-x-0 bottom-1 z-50 pointer-events-none">
    <div class="w-full mx-auto pointer-events-auto px-4">
      <div
        class="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm h-12 px-3 md:h-10">
        <!-- Left: Page / Word Count -->
        <div class="flex items-center gap-4 text-xs text-gray-600">
          <div class="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
            <span class="font-medium">Page</span>
            <span class="text-gray-800">{{ pageCount }} of {{ pageCount }}</span>
          </div>
          <div class="hidden sm:flex items-center gap-2">•</div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 cursor-pointer" @click="$emit('word-count')">
            <span class="font-medium">Word Count</span>
            <span class="text-gray-800">{{ wordCount }}</span>
          </div>
        </div>

        <!-- Middle: spacer (was view toggle moved to right) -->
        <div class="flex-1"></div>

        <!-- Right: Zoom controls -->
        <div class="flex items-center gap-2">
          <!-- Right: View toggle next to zoom controls -->
          <div class="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" class="bg-transparent" aria-label="List view">
              <List class="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" class="bg-transparent" aria-label="Grid view">
              <Grid class="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          <!-- Zoom controls -->
          <Button type="button" @click="changeZoom(-25)"
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
            aria-label="Zoom out">
            <Minus class="w-4 h-4 text-gray-600" />
          </Button>

          <Popover>
            <PopoverTrigger as-child>
              <div>
                <!-- Keep the input editable but wrapped so clicks open the popover -->
                <Input
                  type="number"
                  class="w-16 text-center text-sm rounded-md border border-gray-200 px-2 py-1"
                  v-model="zoomModel"
                  min="50"
                  max="200"
                  placeholder="100"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-32 p-2">
              <div class="flex flex-col">
                <button
                  class="text-left px-2 py-1 rounded hover:bg-gray-100 font-medium"
                  @click="selectZoom('fit')"
                >
                  Fit
                </button>
                <div class="border-t my-1" />
                <button
                  v-for="opt in zoomOptions"
                  :key="opt"
                  class="text-left px-2 py-1 rounded hover:bg-gray-100"
                  @click="selectZoom(opt)"
                >
                  {{ opt }}%
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <Button type="button" @click="changeZoom(25)"
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
            aria-label="Zoom in">
            <Plus class="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { Minus, Plus, List, Grid } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
  import { Input } from '@/components/ui/input'
  // ...existing imports

  // props (accept current view and zoom for sync)
  const props = defineProps<{ wordCount?: number; pageCount?: number; view?: 'list' | 'grid'; zoom?: number; fitMode?: boolean }>()

  // percent value (e.g. 100) — initialize from prop when provided
  // allow emitting a special 'fit' payload in addition to numeric zoom levels
  // include a no-payload "word-count" event so template $emit('word-count') typechecks
  const emit = defineEmits<{ (e: 'set-zoom', level: number | 'fit'): void; (e: 'word-count'): void }>()
  const zoomPercent = ref<number>(props.zoom ?? 100)
  const viewMode = ref<'list' | 'grid'>(props.view ?? 'list')
  // track whether 'Fit' is active (parent may toggle fitMode)
  const isFit = ref<boolean>(!!props.fitMode)
  // keep fit state in sync
  watch(() => props.fitMode, (v) => {
    isFit.value = !!v
    if (isFit.value) {
      // display 100% when fit is active
      zoomPercent.value = 100
    }
  })
  // also sync when parent updates numeric zoom
  watch(() => props.zoom, (v) => {
    if (typeof v === 'number') {
      isFit.value = false
      zoomPercent.value = Math.round(v)
    }
  })

  // Expose a computed model for the Input component so typed values are coerced and clamped
  const zoomModel = computed<string | number>({
    get: () => (isFit.value ? 100 : zoomPercent.value),
    set: (v: string | number) => {
      const n = Number(v)
      if (Number.isNaN(n)) return
      isFit.value = false
      zoomPercent.value = Math.min(200, Math.max(50, Math.round(n)))
      // emit numeric zoom change as decimal (1.0 === 100%)
      emit('set-zoom', zoomPercent.value / 100)
    },
  })

  const zoomOptions = [50, 75, 100, 125, 150, 175, 200]

  const changeZoom = (delta: number) => {
    zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta))
    emit('set-zoom', zoomPercent.value / 100)
  }

  // Select a zoom option from the popover. Accept numeric percentages or the special 'fit'.
  const selectZoom = (opt: number | 'fit') => {
    if (opt === 'fit') {
      emit('set-zoom', 'fit')
      return
    }
    zoomPercent.value = Math.min(200, Math.max(50, Math.round(opt)))
    emit('set-zoom', zoomPercent.value / 100)
  }

  // Footer is now display-only; keep passed props for visual display
</script>

<style scoped>

  /* keep footer visually small on mobile */
  .max-w-4xl {
    max-width: 64rem;
  }
</style>
