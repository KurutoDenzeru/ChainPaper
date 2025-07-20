<template>
  <div class="editor-toolbar border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center">
    <!-- File Operations -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="saveDocument"
        :disabled="!isDirty"
        class="flex items-center gap-1"
      >
        <Save class="w-4 h-4" />
        <span class="hidden sm:inline">Save</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="exportDocument"
        class="flex items-center gap-1"
      >
        <Download class="w-4 h-4" />
        <span class="hidden sm:inline">Export</span>
      </Button>
    </div>

    <!-- Undo/Redo -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="undo"
        :disabled="!canUndo"
        title="Undo (Ctrl+Z)"
      >
        <Undo class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="redo"
        :disabled="!canRedo"
        title="Redo (Ctrl+Y)"
      >
        <Redo class="w-4 h-4" />
      </Button>
    </div>

    <!-- Text Formatting -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleFormat('bold')"
        :class="{ 'bg-gray-100': isFormatActive('bold') }"
        title="Bold (Ctrl+B)"
      >
        <Bold class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleFormat('italic')"
        :class="{ 'bg-gray-100': isFormatActive('italic') }"
        title="Italic (Ctrl+I)"
      >
        <Italic class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleFormat('underline')"
        :class="{ 'bg-gray-100': isFormatActive('underline') }"
        title="Underline (Ctrl+U)"
      >
        <Underline class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleFormat('strikethrough')"
        :class="{ 'bg-gray-100': isFormatActive('strikethrough') }"
        title="Strikethrough"
      >
        <Strikethrough class="w-4 h-4" />
      </Button>
    </div>

    <!-- Paragraph Styles -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Select v-model="currentStyle" @value-change="changeStyle">
        <SelectTrigger class="w-32">
          <SelectValue placeholder="Style" />
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
    </div>

    <!-- Text Alignment -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="() => setAlignment('left')"
        :class="{ 'bg-gray-100': currentAlignment === 'left' }"
        title="Align Left"
      >
        <AlignLeft class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => setAlignment('center')"
        :class="{ 'bg-gray-100': currentAlignment === 'center' }"
        title="Align Center"
      >
        <AlignCenter class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => setAlignment('right')"
        :class="{ 'bg-gray-100': currentAlignment === 'right' }"
        title="Align Right"
      >
        <AlignRight class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => setAlignment('justify')"
        :class="{ 'bg-gray-100': currentAlignment === 'justify' }"
        title="Justify"
      >
        <AlignJustify class="w-4 h-4" />
      </Button>
    </div>

    <!-- Lists -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleList('bullet_list')"
        :class="{ 'bg-gray-100': currentNodeType === 'bullet_list' }"
        title="Bullet List"
      >
        <List class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="() => toggleList('ordered_list')"
        :class="{ 'bg-gray-100': currentNodeType === 'ordered_list' }"
        title="Numbered List"
      >
        <ListOrdered class="w-4 h-4" />
      </Button>
    </div>

    <!-- Insert Elements -->
    <div class="toolbar-group flex items-center gap-1 pr-2 border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        @click="insertLink"
        title="Insert Link"
      >
        <Link class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="insertImage"
        title="Insert Image"
      >
        <ImageIcon class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="insertTable"
        title="Insert Table"
      >
        <Table class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="insertHorizontalRule"
        title="Insert Horizontal Rule"
      >
        <Minus class="w-4 h-4" />
      </Button>
    </div>

    <!-- Advanced Tools -->
    <div class="toolbar-group flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        @click="toggleSpellCheck"
        :class="{ 'bg-gray-100': spellCheckEnabled }"
        title="Spell Check"
      >
        <CheckCircle class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="openFindReplace"
        title="Find & Replace (Ctrl+F)"
      >
        <Search class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="toggleCommentMode"
        :class="{ 'bg-gray-100': commentMode }"
        title="Comment Mode"
      >
        <MessageSquare class="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        @click="showDocumentStats"
        title="Document Statistics"
      >
        <BarChart3 class="w-4 h-4" />
      </Button>
    </div>

    <!-- Right side - Document info -->
    <div class="ml-auto flex items-center gap-2 text-sm text-gray-600">
      <div v-if="documentStats" class="flex items-center gap-4">
        <span>{{ documentStats.wordCount }} words</span>
        <span>{{ documentStats.characterCount }} characters</span>
        <span v-if="documentStats.readingTime">{{ documentStats.readingTime }}min read</span>
      </div>
      
      <div v-if="isDirty" class="flex items-center gap-1 text-orange-600">
        <Circle class="w-2 h-2 fill-current" />
        <span class="hidden sm:inline">Unsaved</span>
      </div>
      
      <div v-else-if="lastSaved" class="flex items-center gap-1 text-green-600">
        <Check class="w-3 h-3" />
        <span class="hidden sm:inline">Saved</span>
      </div>
    </div>
  </div>
</template>
              <SelectItem 
                v-for="size in fontSizes" 
                :key="size" 
                :value="size.toString()"
              >
                {{ size }}pt
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Text Color -->
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="palette" class="w-4 h-4" />
                <div 
                  class="w-2 h-2 rounded ml-1" 
                  :style="{ backgroundColor: selectedTextColor }"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-64">
              <ColorPicker 
                v-model="selectedTextColor" 
                @update:modelValue="updateTextColor"
              />
            </PopoverContent>
          </Popover>

          <!-- Background Color -->
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="paint-bucket" class="w-4 h-4" />
                <div 
                  class="w-2 h-2 rounded ml-1" 
                  :style="{ backgroundColor: selectedBackgroundColor }"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-64">
              <ColorPicker 
                v-model="selectedBackgroundColor" 
                @update:modelValue="updateBackgroundColor"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Advanced Tools -->
      <div class="toolbar-group">
        <div class="group-label">Insert</div>
        <div class="group-items">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="plus" class="w-4 h-4" />
                <Icon name="chevron-down" class="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="$emit('insert', 'page-break')">
                <Icon name="scissors" class="w-4 h-4 mr-2" />
                Page Break
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'footnote')">
                <Icon name="subscript" class="w-4 h-4 mr-2" />
                Footnote
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'endnote')">
                <Icon name="superscript" class="w-4 h-4 mr-2" />
                Endnote
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'bookmark')">
                <Icon name="bookmark" class="w-4 h-4 mr-2" />
                Bookmark
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'math')">
                <Icon name="sigma" class="w-4 h-4 mr-2" />
                Math Equation
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'code-block')">
                <Icon name="code" class="w-4 h-4 mr-2" />
                Code Block
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('insert', 'mermaid')">
                <Icon name="workflow" class="w-4 h-4 mr-2" />
                Diagram
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Emoji Picker -->
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="smile" class="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <EmojiPicker @select="insertEmoji" />
            </PopoverContent>
          </Popover>

          <!-- Symbol Picker -->
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="omega" class="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <SymbolPicker @select="insertSymbol" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <!-- Document Actions -->
      <div class="toolbar-group">
        <div class="group-label">Actions</div>
        <div class="group-items">
          <Button 
            variant="ghost" 
            size="sm" 
            @click="$emit('action', 'save')"
            :disabled="!isDirty"
            class="toolbar-button"
          >
            <Icon name="save" class="w-4 h-4" />
            <span v-if="showLabels" class="ml-1">Save</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            @click="$emit('action', 'export')"
            class="toolbar-button"
          >
            <Icon name="download" class="w-4 h-4" />
            <span v-if="showLabels" class="ml-1">Export</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            @click="$emit('action', 'find')"
            class="toolbar-button"
          >
            <Icon name="search" class="w-4 h-4" />
            <span v-if="showLabels" class="ml-1">Find</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            @click="$emit('action', 'comment')"
            :variant="commentMode ? 'default' : 'ghost'"
            class="toolbar-button"
          >
            <Icon name="message-circle" class="w-4 h-4" />
            <span v-if="showLabels" class="ml-1">Comment</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" class="toolbar-button">
                <Icon name="settings" class="w-4 h-4" />
                <Icon name="chevron-down" class="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="$emit('action', 'settings')">
                <Icon name="settings" class="w-4 h-4 mr-2" />
                Document Settings
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('action', 'focus')">
                <Icon name="focus" class="w-4 h-4 mr-2" />
                Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('action', 'reading')">
                <Icon name="book-open" class="w-4 h-4 mr-2" />
                Reading Mode
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('action', 'typewriter')">
                <Icon name="type" class="w-4 h-4 mr-2" />
                Typewriter Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="$emit('action', 'word-count')">
                <Icon name="bar-chart" class="w-4 h-4 mr-2" />
                Document Statistics
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('action', 'authorship')">
                <Icon name="shield-check" class="w-4 h-4 mr-2" />
                Verify Authorship
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="toolbar-quick">
      <Button 
        variant="ghost" 
        size="sm" 
        @click="toggleToolbarLabels"
        class="toolbar-button"
      >
        <Icon :name="showLabels ? 'eye-off' : 'eye'" class="w-4 h-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        @click="$emit('action', 'fullscreen')"
        class="toolbar-button"
      >
        <Icon name="maximize" class="w-4 h-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" class="toolbar-button">
            <Icon name="palette" class="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="setTheme('light')">
            <Icon name="sun" class="w-4 h-4 mr-2" />
            Light Theme
          </DropdownMenuItem>
          <DropdownMenuItem @click="setTheme('dark')">
            <Icon name="moon" class="w-4 h-4 mr-2" />
            Dark Theme
          </DropdownMenuItem>
          <DropdownMenuItem @click="setTheme('sepia')">
            <Icon name="coffee" class="w-4 h-4 mr-2" />
            Sepia Theme
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Save, Download, Undo, Redo, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Link, ImageIcon, Table, Minus, CheckCircle, Search, MessageSquare,
  BarChart3, Circle, Check
} from 'lucide-vue-next'

import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useEditorStore } from '~/stores/editor'
import { useDocumentStore } from '~/stores/document'

const editorStore = useEditorStore()
const documentStore = useDocumentStore()

// Computed properties
const canUndo = computed(() => editorStore.canUndo)
const canRedo = computed(() => editorStore.canRedo)
const isDirty = computed(() => documentStore.isDirty)
const lastSaved = computed(() => documentStore.lastSaved)
const currentNodeType = computed(() => editorStore.currentNodeType)
const currentAlignment = computed(() => {
  // This would need to be implemented in the editor store
  return 'left'
})
const spellCheckEnabled = computed(() => documentStore.settings.spellCheck)
const commentMode = computed(() => editorStore.commentMode)
const documentStats = computed(() => documentStore.documentStatistics)

// Current style for the dropdown
const currentStyle = computed({
  get() {
    if (currentNodeType.value === 'heading') {
      const level = editorStore.currentNode?.attrs?.level || 1
      return `heading${level}`
    }
    return currentNodeType.value || 'paragraph'
  },
  set(value: string) {
    changeStyle(value)
  }
})

// Methods
const isFormatActive = (format: string) => {
  return editorStore.isFormatActive(format)
}

const toggleFormat = (format: string) => {
  editorStore.toggleFormat(format)
}

const changeStyle = (style: string) => {
  if (style === 'paragraph') {
    editorStore.setParagraph()
  } else if (style.startsWith('heading')) {
    const level = parseInt(style.replace('heading', ''))
    editorStore.setHeading(level)
  }
}

const setAlignment = (alignment: string) => {
  // This would need to be implemented in the editor store
  console.log('Set alignment:', alignment)
}

const toggleList = (listType: string) => {
  editorStore.toggleList(listType)
}

const insertLink = () => {
  editorStore.insertLink()
}

const insertImage = () => {
  editorStore.insertImage()
}

const insertTable = () => {
  editorStore.insertTable()
}

const insertHorizontalRule = () => {
  editorStore.insertHorizontalRule()
}

const undo = () => {
  // This would need to be implemented in the editor store
  console.log('Undo')
}

const redo = () => {
  // This would need to be implemented in the editor store
  console.log('Redo')
}

const saveDocument = async () => {
  await documentStore.saveDocument()
}

const exportDocument = () => {
  // This would open an export dialog
  console.log('Export document')
}

const toggleSpellCheck = () => {
  documentStore.updateSettings({ spellCheck: !spellCheckEnabled.value })
}

const openFindReplace = () => {
  // This would open find/replace dialog
  console.log('Open find/replace')
}

const toggleCommentMode = () => {
  if (commentMode.value) {
    editorStore.disableCommentMode()
  } else {
    editorStore.enableCommentMode()
  }
}

const showDocumentStats = () => {
  // This would open document statistics dialog
  console.log('Show document stats')
}
</script>

<style scoped>
.editor-toolbar {
  min-height: 48px;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 640px) {
  .editor-toolbar {
    flex-wrap: wrap;
    padding: 0.5rem;
  }
  
  .toolbar-group {
    border-right: none !important;
    padding-right: 0 !important;
  }
}
</style>
