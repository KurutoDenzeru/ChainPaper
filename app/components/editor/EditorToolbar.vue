<template>
  <div class="flex px-12 sm:px-4 py-1 rounded-xl bg-white border-b border-gray-200 gap-1 sm:gap-2 overflow-x-auto">
    <!-- Always Visible Controls -->
    <div class="flex gap-1 flex-shrink-0 items-center">
      <!-- View Controls -->
      <Button variant="ghost" size="sm" @click="$emit('toggle-sidebar')" class="h-8 w-8 p-0">
        <Sidebar class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('toggle-find')" class="h-8 w-8 p-0">
        <Search class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Undo/Redo -->
      <Button variant="ghost" size="sm" @click="undo" :disabled="!canUndo" class="h-8 w-8 p-0">
        <Undo2 class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="redo" :disabled="!canRedo" class="h-8 w-8 p-0">
        <Redo2 class="w-4 h-4" />
      </Button>
    </div>

    <!-- Desktop Layout: Show all controls on large screens -->
    <div class="hidden lg:flex gap-1 flex-1 items-center">
      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Font Controls -->
      <Select v-model="selectedFont" @update:modelValue="handleFontChange">
        <SelectTrigger class="w-36 h-8">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="font in fonts" :key="font.value" :value="font.value">
            {{ font.label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedFontSize" @update:modelValue="handleFontSizeChange">
        <SelectTrigger class="w-16 h-8">
          <SelectValue placeholder="12" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="size in fontSizes" :key="size" :value="size.toString()">
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Paragraph Styles -->
      <Select v-model="selectedHeading" @update:modelValue="handleHeadingChange">
        <SelectTrigger class="w-28 h-8">
          <SelectValue placeholder="Normal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="heading1">Heading 1</SelectItem>
          <SelectItem value="heading2">Heading 2</SelectItem>
          <SelectItem value="heading3">Heading 3</SelectItem>
          <SelectItem value="heading4">Heading 4</SelectItem>
          <SelectItem value="heading5">Heading 5</SelectItem>
          <SelectItem value="heading6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Basic Formatting -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBold }]" @click="toggleBold">
        <Bold class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isItalic }]" @click="toggleItalic">
        <Italic class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isUnderline }]"
        @click="toggleUnderline">
        <Underline class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isStrikethrough }]"
        @click="toggleStrikethrough">
        <Strikethrough class="w-4 h-4" />
      </Button>

      <!-- Text Color -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
            <div class="relative">
              <Type class="w-4 h-4" />
              <div class="absolute bottom-0 left-0 w-full h-1 rounded" :style="{ backgroundColor: selectedTextColor }">
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-56 p-3">
          <div class="grid grid-cols-8 gap-1">
            <button v-for="color in textColors" :key="color"
              class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }" @click="setTextColor(color)"></button>
          </div>
        </PopoverContent>
      </Popover>

      <!-- Highlight Color -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
            <div class="relative">
              <Highlighter class="w-4 h-4" />
              <div class="absolute bottom-0 left-0 w-full h-1 rounded"
                :style="{ backgroundColor: selectedHighlightColor }"></div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-56 p-3">
          <div class="grid grid-cols-8 gap-1">
            <button v-for="color in highlightColors" :key="color"
              class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }" @click="setHighlightColor(color)"></button>
          </div>
        </PopoverContent>
      </Popover>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Alignment -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'left' }]"
        @click="setAlignment('left')">
        <AlignLeft class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'center' }]"
        @click="setAlignment('center')">
        <AlignCenter class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'right' }]"
        @click="setAlignment('right')">
        <AlignRight class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'justify' }]"
        @click="setAlignment('justify')">
        <AlignJustify class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Lists -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBulletList }]"
        @click="toggleBulletList">
        <List class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isOrderedList }]"
        @click="toggleOrderedList">
        <ListOrdered class="w-4 h-4" />
      </Button>

      <!-- Indentation -->
      <Button variant="ghost" size="sm" @click="outdent" class="h-8 w-8 p-0">
        <Indent class="w-4 h-4 rotate-180" />
      </Button>
      <Button variant="ghost" size="sm" @click="indent" class="h-8 w-8 p-0">
        <Indent class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Insert Tools -->
      <Button variant="ghost" size="sm" @click="insertLink" class="h-8 w-8 p-0">
        <Link class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="insertImage" class="h-8 w-8 p-0">
        <ImageIcon class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="insertTable" class="h-8 w-8 p-0">
        <Table class="w-4 h-4" />
      </Button>
    </div>

    <!-- Medium screens: Show essential formatting -->
    <div class="hidden md:flex lg:hidden gap-1 flex-1 items-center">
      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Font Size -->
      <Select v-model="selectedFontSize" @update:modelValue="handleFontSizeChange">
        <SelectTrigger class="w-16 h-8">
          <SelectValue placeholder="12" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="size in fontSizes" :key="size" :value="size.toString()">
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Basic Formatting -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBold }]" @click="toggleBold">
        <Bold class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isItalic }]" @click="toggleItalic">
        <Italic class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isUnderline }]"
        @click="toggleUnderline">
        <Underline class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Alignment -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'left' }]"
        @click="setAlignment('left')">
        <AlignLeft class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'center' }]"
        @click="setAlignment('center')">
        <AlignCenter class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': alignment === 'right' }]"
        @click="setAlignment('right')">
        <AlignRight class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Lists -->
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBulletList }]"
        @click="toggleBulletList">
        <List class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isOrderedList }]"
        @click="toggleOrderedList">
        <ListOrdered class="w-4 h-4" />
      </Button>
    </div>

    <!-- Small screens: Show minimal controls -->
    <div class="flex md:hidden gap-1 flex-1 items-center">
      <!-- Essential formatting only -->
      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBold }]" @click="toggleBold">
        <Bold class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isItalic }]" @click="toggleItalic">
        <Italic class="w-4 h-4" />
      </Button>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <Button variant="ghost" size="sm" :class="['h-8 w-8 p-0', { 'bg-gray-100': isBulletList }]"
        @click="toggleBulletList">
        <List class="w-4 h-4" />
      </Button>
    </div>

    <!-- More Options Dropdown (Only on medium and small screens) -->
    <div class="flex lg:hidden gap-1 flex-shrink-0 items-center">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
            <MoreHorizontal class="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-64 p-2" align="end">
          <div class="space-y-1">
            <!-- Font Controls (hidden on large screens) -->
            <div class="space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Font</div>
              <div class="flex gap-2">
                <Select v-model="selectedFont" @update:modelValue="handleFontChange">
                  <SelectTrigger class="flex-1 h-8">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="font in fonts" :key="font.value" :value="font.value">
                      {{ font.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select v-model="selectedFontSize" @update:modelValue="handleFontSizeChange" class="md:hidden">
                  <SelectTrigger class="w-16 h-8">
                    <SelectValue placeholder="12" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="size in fontSizes" :key="size" :value="size.toString()">
                      {{ size }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="border-t border-gray-200 my-2"></div>
            </div>

            <!-- Paragraph Styles -->
            <div class="space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Style</div>
              <Select v-model="selectedHeading" @update:modelValue="handleHeadingChange">
                <SelectTrigger class="w-full h-8">
                  <SelectValue placeholder="Normal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Normal</SelectItem>
                  <SelectItem value="heading1">Heading 1</SelectItem>
                  <SelectItem value="heading2">Heading 2</SelectItem>
                  <SelectItem value="heading3">Heading 3</SelectItem>
                  <SelectItem value="heading4">Heading 4</SelectItem>
                  <SelectItem value="heading5">Heading 5</SelectItem>
                  <SelectItem value="heading6">Heading 6</SelectItem>
                </SelectContent>
              </Select>
              <div class="border-t border-gray-200 my-2"></div>
            </div>

            <!-- Formatting Controls (hidden on medium+ screens) -->
            <div class="md:hidden space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Format</div>
              <div class="grid grid-cols-4 gap-1">
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': isUnderline }]"
                  @click="toggleUnderline">
                  <Underline class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': isStrikethrough }]"
                  @click="toggleStrikethrough">
                  <Strikethrough class="w-4 h-4" />
                </Button>
                <!-- Text Color -->
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="ghost" size="sm" class="h-8">
                      <div class="relative">
                        <Type class="w-4 h-4" />
                        <div class="absolute bottom-0 left-0 w-full h-1 rounded"
                          :style="{ backgroundColor: selectedTextColor }"></div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-56 p-3">
                    <div class="grid grid-cols-8 gap-1">
                      <button v-for="color in textColors" :key="color"
                        class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        :style="{ backgroundColor: color }" @click="setTextColor(color)"></button>
                    </div>
                  </PopoverContent>
                </Popover>
                <!-- Highlight Color -->
                <Popover>
                  <PopoverTrigger as-child>
                    <Button variant="ghost" size="sm" class="h-8">
                      <div class="relative">
                        <Highlighter class="w-4 h-4" />
                        <div class="absolute bottom-0 left-0 w-full h-1 rounded"
                          :style="{ backgroundColor: selectedHighlightColor }"></div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-56 p-3">
                    <div class="grid grid-cols-8 gap-1">
                      <button v-for="color in highlightColors" :key="color"
                        class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        :style="{ backgroundColor: color }" @click="setHighlightColor(color)"></button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div class="border-t border-gray-200 my-2"></div>
            </div>

            <!-- Alignment Controls (hidden on medium+ screens) -->
            <div class="md:hidden space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Align</div>
              <div class="grid grid-cols-4 gap-1">
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': alignment === 'left' }]"
                  @click="setAlignment('left')">
                  <AlignLeft class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': alignment === 'center' }]"
                  @click="setAlignment('center')">
                  <AlignCenter class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': alignment === 'right' }]"
                  @click="setAlignment('right')">
                  <AlignRight class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" :class="['h-8', { 'bg-gray-100': alignment === 'justify' }]"
                  @click="setAlignment('justify')">
                  <AlignJustify class="w-4 h-4" />
                </Button>
              </div>
              <div class="border-t border-gray-200 my-2"></div>
            </div>

            <!-- Lists and Indentation -->
            <div class="space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Lists</div>
              <div class="grid grid-cols-4 gap-1">
                <Button variant="ghost" size="sm" :class="['h-8 md:hidden', { 'bg-gray-100': isOrderedList }]"
                  @click="toggleOrderedList">
                  <ListOrdered class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="outdent" class="h-8">
                  <Indent class="w-4 h-4 rotate-180" />
                </Button>
                <Button variant="ghost" size="sm" @click="indent" class="h-8">
                  <Indent class="w-4 h-4" />
                </Button>
              </div>
              <div class="border-t border-gray-200 my-2"></div>
            </div>

            <!-- Insert Tools -->
            <div class="space-y-1">
              <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Insert</div>
              <Button variant="ghost" size="sm" @click="insertLink" class="w-full justify-start h-8">
                <Link class="w-4 h-4 mr-2" />
                Link
              </Button>
              <Button variant="ghost" size="sm" @click="insertImage" class="w-full justify-start h-8">
                <ImageIcon class="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button variant="ghost" size="sm" @click="insertTable" class="w-full justify-start h-8">
                <Table class="w-4 h-4 mr-2" />
                Table
              </Button>
              <Button variant="ghost" size="sm" @click="insertHorizontalRule" class="w-full justify-start h-8">
                <Minus class="w-4 h-4 mr-2" />
                Horizontal Rule
              </Button>
              <Button variant="ghost" size="sm" @click="insertPageBreak" class="w-full justify-start h-8">
                <FileText class="w-4 h-4 mr-2" />
                Page Break
              </Button>
              <Button variant="ghost" size="sm" @click="insertSymbol" class="w-full justify-start h-8">
                <Hash class="w-4 h-4 mr-2" />
                Special Character
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    Bold, Italic, Underline, Strikethrough, Type, Highlighter,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Indent, Link, ImageIcon as Image, Table,
    Undo2, Redo2, MoreHorizontal, Minus, FileText, Hash, Sidebar, Search
  } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover'
  import { useEditorStore } from '~/stores/editor'

  // Fix the ImageIcon import conflict
  const ImageIcon = Image

  const editorStore = useEditorStore()

  // State
  const selectedFont = ref('Times New Roman')
  const selectedFontSize = ref('12')
  const selectedHeading = ref('paragraph')
  const alignment = ref('left')
  const selectedTextColor = ref('#000000')
  const selectedHighlightColor = ref('#ffff00')

  // Font options
  const fonts = [
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Calibri', value: 'Calibri' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS' },
    { label: 'Impact', value: 'Impact' },
  ]

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72]

  const textColors = [
    '#000000', '#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ]

  const highlightColors = [
    'transparent', '#fef3c7', '#fde68a', '#fed7aa', '#fecaca', '#f3e8ff',
    '#e0e7ff', '#dbeafe', '#bfdbfe', '#bef264', '#bbf7d0', '#a7f3d0'
  ]

  // Computed properties for active states
  const isBold = computed(() => editorStore.isFormatActive('bold'))
  const isItalic = computed(() => editorStore.isFormatActive('italic'))
  const isUnderline = computed(() => editorStore.isFormatActive('underline'))
  const isStrikethrough = computed(() => editorStore.isFormatActive('strikethrough'))
  const isBulletList = computed(() => editorStore.currentNodeType === 'bullet_list')
  const isOrderedList = computed(() => editorStore.currentNodeType === 'ordered_list')
  const canUndo = computed(() => editorStore.canUndo)
  const canRedo = computed(() => editorStore.canRedo)

  // Actions
  function undo() {
    editorStore.undo()
  }

  function redo() {
    editorStore.redo()
  }

  function toggleBold() {
    editorStore.toggleBold()
  }

  function toggleItalic() {
    editorStore.toggleItalic()
  }

  function toggleUnderline() {
    editorStore.toggleUnderline()
  }

  function toggleStrikethrough() {
    editorStore.toggleStrikethrough()
  }

  function handleFontChange(font: any) {
    if (typeof font === 'string') {
      editorStore.setFontFamily(font)
    }
  }

  function handleFontSizeChange(size: any) {
    if (typeof size === 'string') {
      editorStore.setFontSize(parseInt(size))
    } else if (typeof size === 'number') {
      editorStore.setFontSize(size)
    }
  }

  function handleHeadingChange(heading: any) {
    if (heading === 'paragraph') {
      editorStore.setParagraph()
    } else if (typeof heading === 'string') {
      const level = parseInt(heading.replace('heading', ''))
      editorStore.setHeading(level)
    }
  }

  function setAlignment(align: string) {
    alignment.value = align
    editorStore.setAlignment(align)
  }

  function setTextColor(color: string) {
    selectedTextColor.value = color
    editorStore.setTextColor(color)
  }

  function setHighlightColor(color: string) {
    selectedHighlightColor.value = color
    editorStore.setHighlightColor(color)
  }

  function toggleBulletList() {
    editorStore.toggleBulletList()
  }

  function toggleOrderedList() {
    editorStore.toggleOrderedList()
  }

  function indent() {
    editorStore.indent()
  }

  function outdent() {
    editorStore.outdent()
  }

  function insertLink() {
    // Emit event to parent to handle link dialog
    window.dispatchEvent(new CustomEvent('editor:insert-link'))
  }

  function insertImage() {
    // Emit event to parent to handle image dialog
    window.dispatchEvent(new CustomEvent('editor:insert-image'))
  }

  function insertTable() {
    // Emit event to parent to handle table dialog
    window.dispatchEvent(new CustomEvent('editor:insert-table'))
  }

  function insertHorizontalRule() {
    editorStore.insertHorizontalRule()
  }

  function insertPageBreak() {
    editorStore.insertPageBreak()
  }

  function insertSymbol() {
    // Emit event to parent to handle symbol dialog
    window.dispatchEvent(new CustomEvent('editor:insert-symbol'))
  }

  // Events
  defineEmits<{
    'format-bold': []
    'format-italic': []
    'format-underline': []
    'set-heading': [level: number]
    'insert-link': []
    'insert-image': []
    'insert-table': []
    'save': []
    'export': []
    'toggle-sidebar': []
    'toggle-find': []
  }>()
</script>
