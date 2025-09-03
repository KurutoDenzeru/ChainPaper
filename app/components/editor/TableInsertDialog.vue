<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-3xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Table class="w-5 h-5 text-blue-600" />
          Insert Table
        </DialogTitle>
        <DialogDescription>
          Create a table by selecting the size or entering custom dimensions.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <div class="flex gap-6 items-start">
          <!-- Quick Selection (left) -->
          <div class="w-1/2">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Grid3x3 class="w-4 h-4 text-gray-600" />
                <span class="text-sm font-medium text-gray-900">Quick Selection</span>
              </div>

              <div class="flex flex-col items-center space-y-3">
                <!-- Grid selector -->
                <div class="grid gap-1 p-3 border rounded-lg bg-gray-50/50"
                  :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }" @mouseleave="resetSelection">
                  <div v-for="(cell, index) in gridCells" :key="index" :class="[
                    'w-5 h-5 border border-gray-300 cursor-pointer transition-all duration-150 rounded-sm',
                    {
                      'bg-blue-500 border-blue-600 shadow-sm': cell.row <= selectedRows && cell.col <= selectedCols,
                      'bg-white hover:bg-blue-100 hover:border-blue-300': !(cell.row <= selectedRows && cell.col <= selectedCols)
                    }
                  ]" @mouseenter="updateSelection(cell.row, cell.col)"
                    @click="insertTable(selectedRows, selectedCols)" />
                </div>

                <!-- Status text -->
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <Table class="w-4 h-4" />
                  <span class="font-medium">{{ selectedRows }} rows × {{ selectedCols }} columns</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Dimensions (right) -->
          <div class="w-1/2">
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <Settings class="w-4 h-4 text-gray-600" />
                <span class="text-sm font-medium text-gray-900">Custom Dimensions</span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Grid class="w-4 h-4" />
                    Rows
                  </label>
                  <Input v-model.number="customRows" type="number" min="1" max="50" class="text-center" placeholder="3" />
                </div>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Grid class="w-4 h-4" />
                    Columns
                  </label>
                  <Input v-model.number="customCols" type="number" min="1" max="20" class="text-center" placeholder="3" />
                </div>
              </div>
              <div class="mt-4">
                <div class="text-xs text-gray-500 bg-gray-50 rounded p-2 border">
                  <strong>Note:</strong> The quick selection grid only shows up to <span class="font-bold">8 × 8</span> cells for preview, but you can generate tables up to <span class="font-bold">50 rows × 20 columns</span> using Custom Dimensions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="w-full flex gap-2">
        <Button variant="outline" class="w-1/2" @click="$emit('update:open', false)">
          <X class="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button @click="insertCustomTable" class="w-1/2 bg-blue-600 hover:bg-blue-700">
          <Plus class="w-4 h-4 mr-2" />
          Insert Table
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import {
    Table,
    Grid3x3,
    Settings,
    Eye,
    X,
    Plus,
    Grid
  } from 'lucide-vue-next'

  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'insert-table', rows: number, cols: number, options: TableOptions): void
  }>()

  interface TableOptions {
    header: boolean
    borders: boolean
    striped: boolean
  }

  // Grid configuration
  const maxRows = 50
  const maxCols = 20
  const gridRows = computed(() => 8)
  const gridCols = computed(() => 8)
  const gridCells = computed(() => {
    const cells = []
    for (let row = 1; row <= Math.min(gridRows.value, maxRows); row++) {
      for (let col = 1; col <= Math.min(gridCols.value, maxCols); col++) {
        cells.push({ row, col })
      }
    }
    return cells
  })

  // Selection state
  const selectedRows = ref(3)
  const selectedCols = ref(3)

  // Custom input state
  const customRows = ref(3)
  const customCols = ref(3)

  // Dynamically size grid to fit current selection or custom input
  watch(customRows, (v) => {
    let n = Number(v) || 1
    n = Math.max(1, Math.min(maxRows, n))
    customRows.value = n
    selectedRows.value = Math.min(maxRows, n)
  })

  watch(customCols, (v) => {
    let n = Number(v) || 1
    n = Math.max(1, Math.min(maxCols, n))
    customCols.value = n
    selectedCols.value = Math.min(maxCols, n)
  })

  // If user hovers the quick-selection, update the custom inputs as well (already done in updateSelection)
  watch([selectedRows, selectedCols], ([r, c]) => {
    customRows.value = r
    customCols.value = c
  })

  function updateSelection(row: number, col: number) {
    selectedRows.value = row
    selectedCols.value = col
    // Update custom inputs to match selection
    customRows.value = row
    customCols.value = col
  }

  function resetSelection() {
    selectedRows.value = 3
    selectedCols.value = 3
  }

  function insertTable(rows: number, cols: number) {
    const validRows = Math.max(1, Math.min(50, rows))
    const validCols = Math.max(1, Math.min(20, cols))

    const options: TableOptions = {
  header: true,
  borders: false,
  striped: false
    }

    emit('insert-table', validRows, validCols, options)
    emit('update:open', false)

    // Reset to defaults
    resetSelection()
    customRows.value = 3
    customCols.value = 3
  }

  function insertCustomTable() {
    insertTable(customRows.value, customCols.value)
  }
</script>
