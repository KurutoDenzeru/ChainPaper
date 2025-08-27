<template>
  <HoverCard :open-delay="0" :close-delay="200">
    <HoverCardTrigger as-child>
      <slot>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
          <Table class="w-4 h-4" />
        </Button>
      </slot>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto p-3">
      <div class="space-y-3">
        <!-- Title -->
        <div class="text-sm font-medium text-gray-900">Insert Table</div>
        
        <!-- Grid selector -->
        <div class="space-y-2">
          <div 
            class="grid gap-1 p-2 border rounded-md bg-gray-50" 
            :style="{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }"
            @mouseleave="resetSelection"
          >
            <div
              v-for="(cell, index) in gridCells"
              :key="index"
              :class="[
                'w-4 h-4 border border-gray-300 cursor-pointer transition-colors',
                {
                  'bg-blue-200 border-blue-400': cell.row <= selectedRows && cell.col <= selectedCols,
                  'bg-white hover:bg-gray-100': !(cell.row <= selectedRows && cell.col <= selectedCols)
                }
              ]"
              @mouseenter="updateSelection(cell.row, cell.col)"
              @click="insertTable(selectedRows, selectedCols)"
            />
          </div>
          
          <!-- Status text -->
          <div class="text-xs text-center text-gray-600">
            {{ selectedRows }} × {{ selectedCols }} table
          </div>
        </div>
        
        <!-- Custom input section -->
        <div class="border-t pt-3 space-y-2">
          <div class="text-xs font-medium text-gray-700">Custom Size</div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <label class="text-xs text-gray-600">Rows:</label>
              <input
                v-model.number="customRows"
                type="number"
                min="1"
                max="20"
                class="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center gap-1">
              <label class="text-xs text-gray-600">Cols:</label>
              <input
                v-model.number="customCols"
                type="number"
                min="1"
                max="10"
                class="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              class="h-6 px-2 text-xs"
              @click="insertTable(customRows, customCols)"
            >
              Insert
            </Button>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Table } from 'lucide-vue-next'
import HoverCard from '@/components/ui/hover-card/HoverCard.vue'
import HoverCardTrigger from '@/components/ui/hover-card/HoverCardTrigger.vue'
import HoverCardContent from '@/components/ui/hover-card/HoverCardContent.vue'

const emit = defineEmits<{
  insertTable: [rows: number, cols: number]
}>()

// Grid configuration
const maxRows = 8
const maxCols = 8

// Selection state
const selectedRows = ref(1)
const selectedCols = ref(1)

// Custom input state
const customRows = ref(3)
const customCols = ref(3)

// Generate grid cells
const gridCells = computed(() => {
  const cells = []
  for (let row = 1; row <= maxRows; row++) {
    for (let col = 1; col <= maxCols; col++) {
      cells.push({ row, col })
    }
  }
  return cells
})

function updateSelection(row: number, col: number) {
  selectedRows.value = row
  selectedCols.value = col
}

function resetSelection() {
  selectedRows.value = 1
  selectedCols.value = 1
}

function insertTable(rows: number, cols: number) {
  // Validate inputs
  const validRows = Math.max(1, Math.min(20, rows))
  const validCols = Math.max(1, Math.min(10, cols))
  
  emit('insertTable', validRows, validCols)
  
  // Reset selection
  resetSelection()
}
</script>

<style scoped>
/* Ensure consistent grid spacing */
.grid {
  display: grid;
}
</style>
