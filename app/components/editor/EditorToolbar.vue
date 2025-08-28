<template>
  <div
    class="flex items-center justify-between px-4 sm:px-2 py-1 rounded-xl bg-white border border-gray-200 gap-1 sm:gap-2 overflow-x-auto shadow-sm">
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
          <SelectItem value="subtitle">Subtitle</SelectItem>
          <SelectItem value="heading1">Heading 1</SelectItem>
          <SelectItem value="heading2">Heading 2</SelectItem>
          <SelectItem value="heading3">Heading 3</SelectItem>
          <SelectItem value="heading4">Heading 4</SelectItem>
          <SelectItem value="heading5">Heading 5</SelectItem>
          <SelectItem value="heading6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Zoom controls (inline with formatting) -->
      <div class="flex items-center gap-1 ml-1">
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(-25)">
          <Minus class="w-4 h-4" />
        </Button>

        <Popover>
          <PopoverTrigger as-child>
            <div>
              <Input type="number" v-model="zoomModel" class="w-20 text-center h-8 rounded" />
            </div>
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

        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="changeZoom(25)">
          <Plus class="w-4 h-4" />
        </Button>
      </div>

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

      <!-- Alignment: consolidated into a single popover button -->
      <!-- Code Block Insertion -->
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="insertCodeBlock">
        <Code2 class="w-4 h-4" />
      </Button>
      <div class="h-6 w-px bg-gray-300 mx-1"></div>

      <!-- Alignment: consolidated into a single popover button -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 p-0 px-2 flex items-center gap-1">
            <component
              :is="alignment === 'left' ? AlignLeft : alignment === 'center' ? AlignCenter : alignment === 'right' ? AlignRight : AlignJustify"
              class="w-4 h-4" />
            <ArrowDown class="w-3 h-3 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-36 p-2">
          <div class="flex flex-col">
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('left')">
              <AlignLeft class="w-4 h-4" /> Left
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('center')">
              <AlignCenter class="w-4 h-4" /> Center
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('right')">
              <AlignRight class="w-4 h-4" /> Right
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
              @click="setAlignment('justify')">
              <AlignJustify class="w-4 h-4" /> Justify
            </button>
          </div>
        </PopoverContent>
      </Popover>

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
      <TableInserter @insert-table="handleInsertTable">
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
          <Table class="w-4 h-4" />
        </Button>
      </TableInserter>
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

      <!-- Alignment consolidated for medium screens -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 p-0 px-2 flex items-center gap-1">
            <component
              :is="alignment === 'left' ? AlignLeft : alignment === 'center' ? AlignCenter : alignment === 'right' ? AlignRight : AlignJustify"
              class="w-4 h-4" />
            <ArrowDown class="w-3 h-3 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-36 p-2">
          <div class="flex flex-col">
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('left')">
              <AlignLeft class="w-4 h-4" /> Left
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('center')">
              <AlignCenter class="w-4 h-4" /> Center
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" @click="setAlignment('right')">
              <AlignRight class="w-4 h-4" /> Right
            </button>
            <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
              @click="setAlignment('justify')">
              <AlignJustify class="w-4 h-4" /> Justify
            </button>
          </div>
        </PopoverContent>
      </Popover>

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
                        <SelectItem value="subtitle">Subtitle</SelectItem>
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

    <!-- Collapse Menubar button (far right) -->
    <div class="flex items-center ml-2 flex-shrink-0">
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="$emit('toggle-menubar')">
        <component :is="menuVisible ? ArrowUp : ArrowDown" class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import {
  Bold, Italic, Underline, Strikethrough, Type, Highlighter,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Link, ImageIcon as Image, Table,
    Undo2, Redo2, MoreHorizontal, Minus, FileText, Hash, Sidebar, Search,
  Plus, ArrowUp, ArrowDown, Code2
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
  import { Input } from '@/components/ui/input'
  import TableInserter from './TableInserter.vue'
  // Fix the ImageIcon import conflict
  const ImageIcon = Image

  // local UI state (component-only, emits events for actions)
  const selectedFont = ref('Times New Roman')
  const selectedFontSize = ref('12')
  const selectedHeading = ref('paragraph')
  const alignment = ref('left')
  const selectedTextColor = ref('#000000')
  const selectedHighlightColor = ref('#ffff00')

  // emit helper for actions
  const emit = defineEmits()

  // accept props (menubar visibility and current zoom percent) and fitMode flag
  const props = defineProps<{ isMenuVisible?: boolean; zoom?: number; fitMode?: boolean }>()
  const menuVisible = computed(() => !!props.isMenuVisible)

  // Fit tracking
  const isFit = ref<boolean>(!!props.fitMode)
  watch(() => props.fitMode, (v) => {
    isFit.value = !!v
    if (isFit.value) zoomPercent.value = 100
  })

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
  // UI-only active states (no editor store here)
  const isBold = ref(false)
  const isItalic = ref(false)
  const isUnderline = ref(false)
  const isStrikethrough = ref(false)
  const isBulletList = ref(false)
  const isOrderedList = ref(false)
  const canUndo = ref(true)
  const canRedo = ref(true)

  // Zoom state (UI-only but synchronized via prop/emits)
  const zoomPercent = ref<number>(props.zoom ?? 100)
  // keep in sync if parent updates prop
  watch(() => props.zoom, (v) => {
    if (typeof v === 'number') {
      zoomPercent.value = Math.round(v)
      // numeric update cancels Fit mode
      isFit.value = false
    }
  })

  const zoomModel = computed<string | number>({
    get: () => zoomPercent.value,
    set: (v: string | number) => {
      const n = Number(v)
      if (Number.isNaN(n)) return
      zoomPercent.value = Math.min(200, Math.max(50, Math.round(n)))
      emit('set-zoom', zoomPercent.value / 100)
    },
  })

  const zoomOptions = [50, 75, 100, 125, 150, 175, 200]

  const changeZoom = (delta: number) => {
    zoomPercent.value = Math.min(200, Math.max(50, zoomPercent.value + delta))
    emit('set-zoom', zoomPercent.value / 100)
  }

  const selectZoom = (opt: number | 'fit') => {
    if (opt === 'fit') {
      isFit.value = true
      zoomPercent.value = 100
      emit('set-zoom', 'fit')
      return
    }
    isFit.value = false
    zoomPercent.value = Math.min(200, Math.max(50, Math.round(opt)))
    emit('set-zoom', zoomPercent.value / 100)
  }

  // Actions
  function undo() {
    emit('undo')
  }

  function redo() {
    emit('redo')
  }

  function toggleBold() {
    isBold.value = !isBold.value
    emit('format-bold')
  }

  function toggleItalic() {
    isItalic.value = !isItalic.value
    emit('format-italic')
  }

  function toggleUnderline() {
    isUnderline.value = !isUnderline.value
    emit('format-underline')
  }

  function toggleStrikethrough() {
    isStrikethrough.value = !isStrikethrough.value
    emit('format-strikethrough')
  }

  function handleFontChange(font: any) {
    if (typeof font === 'string') {
      selectedFont.value = font
      emit('set-font-family', font)
    }
  }

  function handleFontSizeChange(size: any) {
    const value = typeof size === 'string' ? parseInt(size) : size
    selectedFontSize.value = String(value)
    emit('set-font-size', value)
  }

  function handleHeadingChange(heading: any) {
    selectedHeading.value = heading
    if (heading === 'paragraph') {
      emit('set-paragraph')
    } else if (heading === 'subtitle') {
      emit('set-subtitle')
    } else if (typeof heading === 'string') {
      const level = parseInt(heading.replace('heading', ''))
      emit('set-heading', level)
    }
  }

  function setAlignment(align: string) {
    alignment.value = align
    emit('set-alignment', align)
  }

  function setTextColor(color: string) {
    selectedTextColor.value = color
    emit('set-text-color', color)
  }

  function setHighlightColor(color: string) {
    selectedHighlightColor.value = color
    emit('set-highlight-color', color)
  }

  function toggleBulletList() {
    isBulletList.value = !isBulletList.value
    emit('toggle-bullet-list')
  }

  function toggleOrderedList() {
    isOrderedList.value = !isOrderedList.value
    emit('toggle-ordered-list')
  }

  function indent() {
    emit('indent')
  }

  function outdent() {
    emit('outdent')
  }

  function insertLink() {
    emit('insert-link')
  }

  function insertImage() {
    emit('insert-image')
  }

  function handleInsertTable(rows: number, cols: number) {
    emit('insert-table', rows, cols)
  }

  function insertTable() {
    emit('insert-table', 2, 2) // fallback for old calls
  }

  function insertHorizontalRule() {
    emit('insert-horizontal-rule')
  }

  function insertPageBreak() {
    emit('insert-page-break')
  }

  function insertSymbol() {
    emit('insert-symbol')
  }

  function insertCodeBlock() {
    emit('insert-code-block')
  }

  // expose emits for template listeners (toggle-sidebar/toggle-find are emitted from template with $emit)
</script>
