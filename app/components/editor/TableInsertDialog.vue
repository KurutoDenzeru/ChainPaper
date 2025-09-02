<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-4xl">
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
        <!-- Quick Grid Selector -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Grid3x3 class="w-4 h-4 text-gray-600" />
            <span class="text-sm font-medium text-gray-900">Quick Selection</span>
          </div>

          <div class="flex flex-col items-center space-y-3">
            <!-- Grid selector -->
            <div class="grid gap-1 p-3 border rounded-lg bg-gray-50/50"
              :style="{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }" @mouseleave="resetSelection">
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

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-gray-200" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <!-- Custom Size Section -->
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
        </div>

        <!-- Table Options -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Sliders class="w-4 h-4 text-gray-600" />
            <span class="text-sm font-medium text-gray-900">Table Options</span>
          </div>

          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <Checkbox id="include-header" v-model:checked="includeHeader"
                class="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              <label for="include-header" class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <Sheet class="w-4 h-4" />
                Include header row
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <Checkbox id="table-borders" v-model:checked="tableBorders"
                class="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              <label for="table-borders" class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <Square class="w-4 h-4" />
                Show table borders
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <Checkbox id="table-striped" v-model:checked="tableStriped"
                class="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              <label for="table-striped" class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <Palette class="w-4 h-4" />
                Alternating row colors
              </label>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Eye class="w-4 h-4 text-gray-600" />
            <span class="text-sm font-medium text-gray-900">Preview</span>
          </div>

          <div class="p-3 bg-gray-50 rounded-lg border">
            <div class="text-xs text-gray-500 mb-2">
              Markdown output{{ (tableBorders || tableStriped) ? ' with CSS styling' : '' }}:
            </div>
            <div class="font-mono text-xs text-gray-700 bg-white p-2 rounded border overflow-x-auto">
              {{ previewMarkdown }}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="$emit('update:open', false)">
          <X class="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button @click="insertCustomTable" class="bg-blue-600 hover:bg-blue-700">
          <Plus class="w-4 h-4 mr-2" />
          Insert Table
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
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
  import { Checkbox } from '@/components/ui/checkbox'
  import {
    Table,
    Grid3x3,
    Settings,
    Sliders,
    Palette,
    Eye,
    X,
    Plus,
    Grid,
    Sheet,
    Square
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
  const maxRows = 8
  const maxCols = 8

  // Selection state
  const selectedRows = ref(3)
  const selectedCols = ref(3)

  // Custom input state
  const customRows = ref(3)
  const customCols = ref(3)

  // Table options
  const includeHeader = ref(true)
  const tableBorders = ref(true)
  const tableStriped = ref(false)

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

  // Generate preview markdown
  const previewMarkdown = computed(() => {
    const rows = customRows.value || selectedRows.value
    const cols = customCols.value || selectedCols.value

    // Always generate Markdown table syntax
    let markdown = ''

    // Header row if enabled
    if (includeHeader.value) {
      markdown += '|'
      for (let i = 1; i <= cols; i++) {
        markdown += ` Header ${i} |`
      }
      markdown += '\n|'
      for (let i = 1; i <= cols; i++) {
        markdown += ' --- |'
      }
      markdown += '\n'

      // Data rows (one less since header takes one)
      for (let r = 1; r < rows; r++) {
        markdown += '|'
        for (let c = 1; c <= cols; c++) {
          markdown += ` Cell ${r}.${c} |`
        }
        markdown += '\n'
      }
    } else {
      // All data rows
      for (let r = 1; r <= rows; r++) {
        markdown += '|'
        for (let c = 1; c <= cols; c++) {
          markdown += ` Cell ${r}.${c} |`
        }
        markdown += '\n'
      }
    }

    // Add CSS wrapper if styling is needed
    if (tableBorders.value || tableStriped.value) {
      const classes = []
      if (tableBorders.value) classes.push('table-bordered')
      if (tableStriped.value) classes.push('table-striped')
      return `<div class="${classes.join(' ')}">\n\n${markdown.trim()}\n\n</div>`
    }

    return markdown.trim()
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
      header: includeHeader.value,
      borders: tableBorders.value,
      striped: tableStriped.value
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
