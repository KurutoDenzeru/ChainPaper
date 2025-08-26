<template>
  <div class="fixed inset-x-0 bottom-2 z-40 pointer-events-none">
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
          <div class="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
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
          <Button type="button"
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
            aria-label="Zoom out">
            <Minus class="w-4 h-4 text-gray-600" />
          </Button>

          <Input type="number" class="w-16 text-center text-sm rounded-md border border-gray-200 px-2 py-1"
            :value="zoomPercent" readonly min="25" max="400" />

          <Button type="button"
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
  import { ref } from 'vue'
  import { Minus, Plus, List, Grid } from 'lucide-vue-next'
  import { defineProps } from 'vue'
  import { Button } from '@/components/ui/button'

  // props (accept current view and zoom for sync)
  const props = defineProps<{ wordCount?: number; pageCount?: number; view?: 'list' | 'grid'; zoom?: number }>()

  // percent value (e.g. 100) — initialize from prop when provided
  const zoomPercent = ref<number>(props.zoom ?? 100)
  const viewMode = ref<'list' | 'grid'>(props.view ?? 'list')

  // Footer is now display-only; keep passed props for visual display
</script>

<style scoped>

  /* keep footer visually small on mobile */
  .max-w-4xl {
    max-width: 64rem;
  }
</style>
