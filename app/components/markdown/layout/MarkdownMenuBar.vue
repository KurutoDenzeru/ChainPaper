<template>
  <Menubar class="px-2 sm:px-4 py-9 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-3" role="presentation">
        <NuxtImg src="/markdown.webp" alt="ChainPaper Markdown" loading="eager" fetchpriority="high" sizes="72px"
          class="w-18 h-auto object-contain flex items-center justify-center" />
      </div>
      <!-- Right Side: Two rows -->
      <div class="flex flex-col self-center flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1" role="presentation">
          <div v-if="!isEditingTitle" @click="startEditingTitle" @keydown.enter="startEditingTitle" role="button"
            tabindex="0" aria-label="Edit document title"
            class="flex items-center gap-2 px-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <!-- render title reactively to show updates -->
            <span class="text-lg text-gray-900 font-medium -ml-2">{{ title ||
              'Untitled Markdown' }}</span>
            <Edit3 class="w-4 h-4 text-gray-600" />
            <span v-if="isDirty" class="text-orange-500">•</span>
          </div>
          <client-only>
            <div v-if="isEditingTitle" class="flex items-center gap-2">
              <Input ref="titleInput" v-model="editingTitle" @blur="saveTitle" @keyup.enter="saveTitle"
                @keyup.escape="cancelEdit" class="text-lg bg-transparent border-2 rounded-md outline-none px-1 min-w-48"
                :placeholder="'Untitled Markdown'" />
            </div>
          </client-only>
        </div>
        <!-- Second Row: Menu Items -->
        <div class="flex items-center gap-1">
          <template v-for="(menu, mi) in menus" :key="menu.label + mi">
            <MenubarMenu>
              <MenubarTrigger>{{ menu.label }}</MenubarTrigger>
              <MenubarContent>
                <template v-for="(item, idx) in menu.items" :key="menu.label + '-' + idx">
                  <MenubarSeparator v-if="item.type === 'separator'" />

                  <MenubarCheckboxItem v-else-if="item.type === 'checkbox'" v-model:checked="getBinding(item).value"
                    class="flex items-center gap-2">
                    <component :is="getIcon(item)" class="w-4 h-4 text-gray-600" v-if="getIcon(item)" />
                    {{ item.label }}
                  </MenubarCheckboxItem>

                  <MenubarSub v-else-if="item.type === 'sub'">
                    <MenubarSubTrigger class="flex items-center gap-2">
                      <component :is="(item as any).icon" class="w-4 h-4 text-gray-600" v-if="(item as any).icon" />
                      {{ item.label }}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <!-- If this sub is the Text Color menu, show a swatch grid + custom picker -->
                      <div v-if="String(item.label).toLowerCase() === 'text color'" class="p-2">
                        <div class="grid grid-cols-8 gap-2">
                          <button v-for="c in textColors" :key="c" :title="c"
                            class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                            :style="{ backgroundColor: c }" @click="emitTextColor(c)"></button>
                        </div>
                        <div class="mt-3 border-t pt-3">
                          <div class="text-xs text-gray-500 mb-2">Custom color</div>
                          <div class="flex items-center gap-2">
                            <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer"
                              @input="onMenuCustomTextColor" />
                            <input type="text" class="w-full text-sm h-8 px-2 border rounded" placeholder="#rrggbb"
                              @change="onMenuCustomTextColorText" />
                          </div>
                        </div>
                      </div>

                      <!-- If this sub is the Highlight menu, show a swatch grid + custom picker -->
                      <div v-else-if="String(item.label).toLowerCase() === 'highlight'" class="p-2">
                        <div class="grid grid-cols-8 gap-2">
                          <button v-for="c in highlightColors" :key="c" :title="c"
                            class="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                            :style="{ backgroundColor: c }" @click="emitHighlight(c)"></button>
                        </div>
                        <div class="mt-3 border-t pt-3">
                          <div class="text-xs text-gray-500 mb-2">Custom highlight</div>
                          <div class="flex items-center gap-2">
                            <input type="color" class="w-10 h-8 p-0 border rounded cursor-pointer"
                              @input="onMenuCustomHighlight" />
                            <input type="text" class="w-full text-sm h-8 px-2 border rounded" placeholder="#rrggbb"
                              @change="onMenuCustomHighlightText" />
                          </div>
                        </div>
                      </div>

                      <!-- Default: simple list of items with optional swatch -->
                      <div v-else>
                        <MenubarItem v-for="(sub, sidx) in (item as any).items" :key="menu.label + '-sub-' + sidx"
                          @click="handleMenuEmit(sub)" class="flex items-center gap-2 justify-between">
                          <div class="flex items-center gap-2">
                            <component :is="getIcon(sub)" class="w-4 h-4 text-gray-600" v-if="getIcon(sub)" />
                            <span class="flex items-center gap-2">
                              <span>{{ sub.label }}</span>
                              <span v-if="isHexColor((sub as any).payload)"
                                :style="{ backgroundColor: (sub as any).payload }"
                                class="w-4 h-4 rounded border border-gray-200 inline-block"></span>
                            </span>
                          </div>
                        </MenubarItem>
                      </div>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem v-else class="flex items-center justify-between min-w-[250px]"
                    :disabled="isDisabled(item)" @click="handleMenuEmit(item)">
                    <div class="flex items-center gap-2">
                      <component :is="getIcon(item)" class="w-4 h-4 text-gray-600" v-if="getIcon(item)" />

                      <!-- For table item, trigger dialog instead of hover -->
                      <template v-if="item.emit === 'insert-table'">
                        <button class="text-sm text-gray-900 hover:bg-gray-100 rounded"
                          @click="showTableDialog = true">{{ item.label }}</button>
                      </template>
                      <template v-else>
                        <span>{{ item.label }}</span>
                      </template>
                    </div>

                    <MenubarShortcut v-if="getShortcut(item)">
                      <div class="flex items-center">
                        <template v-if="isMac && getShortcut(item)?.mac">
                          <div class="flex items-center mr-1">
                            <template v-for="(mod, i) in getShortcut(item).mac" :key="i">
                              <span v-if="mod === 'Command'"
                                class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs mr-1">
                                <Command class="w-3 h-3 text-gray-600" />
                              </span>
                              <span v-else
                                class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs mr-1">{{
                                  mod }}</span>
                            </template>
                          </div>
                          <span v-if="getShortcut(item)?.key" class="text-xs mr-1">+</span>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">{{
                              getShortcut(item)?.key }}</span>
                        </template>
                        <template v-else>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs font-medium mr-1">{{
                              getShortcut(item)?.pc || getShortcut(item)?.key || 'Ctrl' }}</span>
                          <span v-if="getShortcut(item)?.key" class="text-xs mr-1">+</span>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">{{
                              getShortcut(item)?.key }}</span>
                        </template>
                      </div>
                    </MenubarShortcut>
                  </MenubarItem>
                </template>
              </MenubarContent>
            </MenubarMenu>
          </template>
        </div>
      </div>
    </div>
  </Menubar>

  <!-- Dialogs -->
  <MarkdownWordCountDialog :open="showWordCountDialog" @update:open="showWordCountDialog = $event" />

  <MarkdownAuthProofDialog :open="showAuthProofDialog" @update:open="showAuthProofDialog = $event" />

  <MarkdownExportDialog :open="showExportDialog" :initialFormat="exportInitialFormat"
    @update:open="onExportDialogUpdate" />

  <MarkdownSaveDialog :open="showSaveDialog" @update:open="showSaveDialog = $event" />

  <MarkdownAboutDialog :open="showAboutDialog" @update:open="showAboutDialog = $event" />

  <MarkdownGuideDialog :open="showGuideDialog" @update:open="showGuideDialog = $event" />

  <!-- Table Insert Dialog -->
  <TableInsertDialog :open="showTableDialog" @update:open="showTableDialog = $event"
    @insert-table="handleTableInsert" />

  <!-- Emoji Insert Dialog -->
  <EmojiInsertDialog :open="showEmojiDialog" @update:open="showEmojiDialog = $event"
    @insert-emoji="handleEmojiInsert" />

  <!-- Hidden file input used for importing files (markdown, html, json) -->
  <input ref="fileInput" type="file" accept=".md,.markdown,.json,.html,text/*" class="hidden" @change="onFileChange" />
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, defineAsyncComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    Edit3, Command, FileText, FolderOpen, Save, Download,
    Undo2, Redo2, Scissors, Copy, Clipboard, Search, Bold, Italic, Underline,
    Strikethrough, Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    Type, Highlighter,
    List, ListOrdered, Quote, Link, Image, Table, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Code2, Wrench, BarChart3, Eye, ZoomIn, Hash, Shield, BookOpen, Info, Indent, Outdent,
    Superscript, Subscript, Sigma, SquareSigma, Minus, Smile
  } from 'lucide-vue-next'
  import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
  import { Input } from '@/components/ui/input'
  // Lazy-load dialog components to reduce initial bundle and improve LCP
  const TableInsertDialog = defineAsyncComponent(() => import('@/components/editor/TableInsertDialog.vue'))
  const EmojiInsertDialog = defineAsyncComponent(() => import('@/components/editor/EmojiInsertDialog.vue'))
  const MarkdownWordCountDialog = defineAsyncComponent(() => import('../dialogs/MarkdownWordCountDialog.vue'))
  const MarkdownAuthProofDialog = defineAsyncComponent(() => import('../dialogs/MarkdownAuthProofDialog.vue'))
  const MarkdownExportDialog = defineAsyncComponent(() => import('../dialogs/MarkdownExportDialog.vue'))
  const MarkdownSaveDialog = defineAsyncComponent(() => import('../dialogs/MarkdownSaveDialog.vue'))
  const MarkdownAboutDialog = defineAsyncComponent(() => import('../dialogs/MarkdownAboutDialog.vue'))
  const MarkdownGuideDialog = defineAsyncComponent(() => import('../dialogs/MarkdownGuideDialog.vue'))
  import { useMarkdownDocStore } from '@/stores/markdownDoc'

  const store = useMarkdownDocStore()
  const { title, isDirty } = storeToRefs(store)

  // Markdown-specific emits
  const emit = defineEmits<{
    (e: 'open-document'): void
    (e: 'export-markdown'): void
    (e: 'export-html'): void
    (e: 'export-pdf'): void
    (e: 'undo'): void
    (e: 'redo'): void
    (e: 'cut'): void
    (e: 'copy'): void
    (e: 'paste'): void
    (e: 'select-all'): void
    (e: 'toggle-find'): void
    (e: 'set-zoom', level: number | 'fit'): void
    (e: 'insert-table', rows?: number, cols?: number, header?: boolean): void
    (e: 'insert-image'): void
    (e: 'insert-link'): void
    (e: 'insert-code-block'): void
    (e: 'insert-math'): void
    (e: 'insert-mathblock'): void
    (e: 'insert-horizontal-line'): void
    (e: 'insert-footnote'): void
    (e: 'insert-emoji', char: string): void
    (e: 'format-bold'): void
    (e: 'format-italic'): void
    (e: 'format-underline'): void
    (e: 'format-strikethrough'): void
    (e: 'format-superscript'): void
    (e: 'format-subscript'): void
    (e: 'set-heading', level: number): void
    (e: 'set-alignment', alignment: string): void
    (e: 'toggle-bullet-list'): void
    (e: 'toggle-ordered-list'): void
    (e: 'toggle-blockquote'): void
    (e: 'indent'): void
    (e: 'unindent'): void
    (e: 'spell-check'): void
    (e: 'word-count'): void
    (e: 'verify-authorship'): void
    (e: 'show-shortcuts'): void
    (e: 'show-about'): void
    (e: 'show-documentation'): void
    (e: 'toggle-preview'): void
    (e: 'set-text-color', color: string): void
    (e: 'set-highlight', color: string): void
  }>()

  // View state
  const showToolbar = ref(true)
  const showStatusBar = ref(true)
  const showPreview = ref(false)
  // Dialog state
  const showWordCountDialog = ref(false)
  const showAuthProofDialog = ref(false)
  const showExportDialog = ref(false)
  const showSaveDialog = ref(false)
  const showAboutDialog = ref(false)
  const showGuideDialog = ref(false)
  const showTableDialog = ref(false)
  const showEmojiDialog = ref(false)
  const exportInitialFormat = ref<'markdown' | 'html' | 'json' | 'pdf' | null>(null)

  // Markdown-specific menu data
  const menus = ref([
    {
      label: 'File',
      items: [
        { type: 'item', label: 'New Markdown', emit: 'new-document', icon: FileText, shortcut: { mac: ['Command'], key: 'N', pc: 'Ctrl' } },
        { type: 'item', label: 'Open', emit: 'open-document', icon: FolderOpen, shortcut: { mac: ['Command'], key: 'O', pc: 'Ctrl' } },
        { type: 'separator' },
        { type: 'item', label: 'Save', emit: 'save-document', icon: Save, shortcut: { mac: ['Command'], key: 'S', pc: 'Ctrl' } },
        { type: 'separator' },
        { type: 'item', label: 'Export', emit: 'export-document', icon: Download }
      ]
    },
    {
      label: 'Edit',
      items: [
        { type: 'item', label: 'Undo', emit: 'undo', icon: Undo2, shortcut: { mac: ['Command'], key: 'Z', pc: 'Ctrl' } },
        { type: 'item', label: 'Redo', emit: 'redo', icon: Redo2, shortcut: { mac: ['Command', 'Shift'], key: 'Z', pc: 'Ctrl' } },
        { type: 'separator' },
        { type: 'item', label: 'Cut', emit: 'cut', icon: Scissors, shortcut: { mac: ['Command'], key: 'X', pc: 'Ctrl' } },
        { type: 'item', label: 'Copy', emit: 'copy', icon: Copy, shortcut: { mac: ['Command'], key: 'C', pc: 'Ctrl' } },
        { type: 'item', label: 'Paste', emit: 'paste', icon: Clipboard, shortcut: { mac: ['Command'], key: 'V', pc: 'Ctrl' } },
        { type: 'separator' },
        { type: 'item', label: 'Select All', emit: 'select-all', shortcut: { mac: ['Command'], key: 'A', pc: 'Ctrl' } },
        { type: 'item', label: 'Find', emit: 'toggle-find', icon: Search, shortcut: { mac: ['Command'], key: 'F', pc: 'Ctrl' } }
      ]
    },
    {
      label: 'Format',
      items: [
        { type: 'item', label: 'Bold', emit: 'format-bold', icon: Bold, shortcut: { mac: ['Command'], key: 'B', pc: 'Ctrl' } },
        { type: 'item', label: 'Italic', emit: 'format-italic', icon: Italic, shortcut: { mac: ['Command'], key: 'I', pc: 'Ctrl' } },
        { type: 'item', label: 'Underline', emit: 'format-underline', icon: Underline, shortcut: { mac: ['Command'], key: 'U', pc: 'Ctrl' } },
        { type: 'item', label: 'Strikethrough', emit: 'format-strikethrough', icon: Strikethrough, shortcut: { mac: ['Command', 'Shift'], key: 'X', pc: 'Ctrl' } },
        { type: 'item', label: 'Superscript', emit: 'format-superscript', icon: Superscript },
        { type: 'item', label: 'Subscript', emit: 'format-subscript', icon: Subscript },
        { type: 'separator' },
        // Link, Code Block, and Blockquote grouped together
        { type: 'item', label: 'Link', emit: 'insert-link', icon: Link, shortcut: { mac: ['Command'], key: 'K', pc: 'Ctrl' } },
        { type: 'item', label: 'Code Block', emit: 'insert-code-block', icon: Code2, shortcut: { mac: ['Command', 'Shift'], key: 'C', pc: 'Ctrl' } },
        { type: 'item', label: 'Blockquote', emit: 'toggle-blockquote', icon: Quote, shortcut: { mac: ['Command', 'Shift'], key: 'B', pc: 'Ctrl' } },
        { type: 'separator' },
        {
          type: 'sub', label: 'Heading', icon: Heading, items: [
            { type: 'item', label: 'Heading 1', emit: 'set-heading', payload: 1, icon: Heading1, shortcut: { mac: ['Command'], key: '1', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 2', emit: 'set-heading', payload: 2, icon: Heading2, shortcut: { mac: ['Command'], key: '2', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 3', emit: 'set-heading', payload: 3, icon: Heading3, shortcut: { mac: ['Command'], key: '3', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 4', emit: 'set-heading', payload: 4, icon: Heading4, shortcut: { mac: ['Command'], key: '4', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 5', emit: 'set-heading', payload: 5, icon: Heading5, shortcut: { mac: ['Command'], key: '5', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 6', emit: 'set-heading', payload: 6, icon: Heading6, shortcut: { mac: ['Command'], key: '6', pc: 'Ctrl' } }
          ]
        },
        { type: 'separator' },
        {
          type: 'sub', label: 'Alignment', icon: AlignLeft, items: [
            { type: 'item', label: 'Align Left', emit: 'set-alignment', payload: 'left', icon: AlignLeft },
            { type: 'item', label: 'Align Center', emit: 'set-alignment', payload: 'center', icon: AlignCenter },
            { type: 'item', label: 'Align Right', emit: 'set-alignment', payload: 'right', icon: AlignRight },
            { type: 'item', label: 'Align Justify', emit: 'set-alignment', payload: 'justify', icon: AlignJustify }
          ]
        },
        { type: 'separator' },
        {
          type: 'sub', label: 'Text Color', icon: Type, items: [
            { type: 'item', label: 'Default (Black)', emit: 'set-text-color', payload: '#111827' },
            { type: 'item', label: 'Gray', emit: 'set-text-color', payload: '#6B7280' },
            { type: 'item', label: 'Red', emit: 'set-text-color', payload: '#DC2626' },
            { type: 'item', label: 'Orange', emit: 'set-text-color', payload: '#EA580C' },
            { type: 'item', label: 'Blue', emit: 'set-text-color', payload: '#2563EB' },
            { type: 'item', label: 'Purple', emit: 'set-text-color', payload: '#9333EA' }
          ]
        },
        {
          type: 'sub', label: 'Highlight', icon: Highlighter, items: [
            { type: 'item', label: 'Yellow', emit: 'set-highlight', payload: '#FDE68A' },
            { type: 'item', label: 'Peach', emit: 'set-highlight', payload: '#FFEDD5' },
            { type: 'item', label: 'Pink', emit: 'set-highlight', payload: '#FFE4E6' },
            { type: 'item', label: 'Lilac', emit: 'set-highlight', payload: '#F3E8FF' },
            { type: 'item', label: 'Mint', emit: 'set-highlight', payload: '#DCFCE7' },
            { type: 'item', label: 'Sky', emit: 'set-highlight', payload: '#E0F2FE' }
          ]
        },
        { type: 'separator' },
        { type: 'item', label: 'Bullet List', emit: 'toggle-bullet-list', icon: List },
        { type: 'item', label: 'Numbered List', emit: 'toggle-ordered-list', icon: ListOrdered },
        { type: 'separator' },
        { type: 'item', label: 'Indent', emit: 'indent', icon: Indent, shortcut: { mac: ['Command'], key: ']', pc: 'Ctrl' } },
        { type: 'item', label: 'Unindent', emit: 'unindent', icon: Outdent, shortcut: { mac: ['Command'], key: '[', pc: 'Ctrl' } }
      ]
    },
    {
      label: 'Insert',
      items: [
        { type: 'item', label: 'Image', emit: 'insert-image', icon: Image },
        { type: 'item', label: 'Table', emit: 'insert-table', icon: Table },
        { type: 'separator' },
        { type: 'item', label: 'Math', emit: 'insert-math', icon: Sigma },
        { type: 'item', label: 'Math Block', emit: 'insert-mathblock', icon: SquareSigma },
        { type: 'separator' },
        { type: 'item', label: 'Horizontal Line', emit: 'insert-horizontal-line', icon: Minus },
        { type: 'item', label: 'Footnote', emit: 'insert-footnote', icon: FileText },
        { type: 'item', label: 'Emoji', emit: 'insert-emoji', icon: Smile },
      ]
    },
    {
      label: 'View',
      items: [
        { type: 'checkbox', label: 'Show Toolbar', bind: 'showToolbar', icon: Wrench },
        { type: 'checkbox', label: 'Show Status Bar', bind: 'showStatusBar', icon: BarChart3 },
        { type: 'checkbox', label: 'Preview Mode', bind: 'showPreview', emit: 'toggle-preview', icon: Eye },
        { type: 'separator' },
        {
          type: 'sub', label: 'Zoom', icon: ZoomIn, items: [
            { type: 'item', label: 'Fit Page', emit: 'set-zoom', payload: 'fit' },
            { type: 'separator' },
            { type: 'item', label: '50%', emit: 'set-zoom', payload: 50 },
            { type: 'item', label: '75%', emit: 'set-zoom', payload: 75 },
            { type: 'item', label: '100%', emit: 'set-zoom', payload: 100 },
            { type: 'item', label: '125%', emit: 'set-zoom', payload: 125 },
            { type: 'item', label: '150%', emit: 'set-zoom', payload: 150 },
            { type: 'item', label: '200%', emit: 'set-zoom', payload: 200 }
          ]
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        { type: 'item', label: 'Word Count', emit: 'word-count', icon: Hash },
        { type: 'separator' },
        { type: 'item', label: 'Verify Authorship', emit: 'verify-authorship', icon: Shield }
      ]
    },
    {
      label: 'Help',
      items: [
        { type: 'item', label: 'About ChainPaper', emit: 'show-about', icon: Info },
        { type: 'separator' },
        { type: 'item', label: 'Markdown Guide', emit: 'show-documentation', icon: BookOpen }
      ]
    }
  ])

  // bindings for checkbox menu items
  const bindings: Record<string, { value: any }> = {
    showToolbar: { value: showToolbar },
    showStatusBar: { value: showStatusBar },
    showPreview: { value: showPreview }
  }

  // Generic emitter for menu items
  function handleMenuEmit(item: any) {
    if (item.emit === 'insert-image') {
      emit('insert-image')
      return
    }
    if (!item) return
    if (!item.emit) return

    if (item.emit === 'new-document') {
      newDoc()
      return
    }

    if (item.emit === 'save-document') {
      // open save dialog
      showSaveDialog.value = true
      return
    }

    if (item.emit === 'open-document') {
      openFilePicker()
      return
    }

    if (item.emit === 'export-markdown' || item.emit === 'export-html' || item.emit === 'export-pdf' || item.emit === 'export-document') {
      // If a specific format was requested, preselect it; otherwise open export dialog without preselection
      if (item.emit === 'export-markdown') exportInitialFormat.value = 'markdown'
      else if (item.emit === 'export-html') exportInitialFormat.value = 'html'
      else if (item.emit === 'export-pdf') exportInitialFormat.value = 'pdf'
      else exportInitialFormat.value = null
      showExportDialog.value = true
      return
    }

    if (item.emit === 'word-count') {
      showWordCountDialog.value = true
      return
    }

    if (item.emit === 'verify-authorship') {
      showAuthProofDialog.value = true
      return
    }

    if (item.emit === 'show-about') {
      showAboutDialog.value = true
      return
    }

    if (item.emit === 'show-documentation') {
      showGuideDialog.value = true
      return
    }

    if (item.emit === 'insert-table') {
      showTableDialog.value = true
      return
    }

    if (item.emit === 'insert-emoji') {
      showEmojiDialog.value = true
      return
    }

    // Special handling for zoom menu
    if (item.emit === 'set-zoom' && item.payload !== undefined) {
      emit('set-zoom', item.payload)
      return
    }

    // Special handling for alignment menu
    if (item.emit === 'set-alignment' && item.payload !== undefined) {
      emit('set-alignment', item.payload)
      return
    }

    if (item.payload !== undefined) emit(item.emit as any, item.payload)
    else emit(item.emit as any)
  }

  // small helpers & color lists for menu custom pickers
  const textColors = ['#111827', '#6B7280', '#DC2626', '#EA580C', '#2563EB', '#9333EA', '#059669', '#B45309', '#0EA5E9', '#7C3AED']
  const highlightColors = ['#FDE68A', '#FFEDD5', '#FFE4E6', '#F3E8FF', '#DCFCE7', '#E0F2FE', '#FEF3C7', '#FEE2E2', '#E9D5FF', '#ECFCCB']

  // Emit typed wrappers because defineEmits types are specific
  const emitTextColor = (c: string) => emit('set-text-color', c)
  const emitHighlight = (c: string) => emit('set-highlight', c)

  function onMenuCustomTextColor(e: Event) {
    const v = (e.target as HTMLInputElement | null)?.value
    if (v && isHexColor(v)) emitTextColor(v)
  }

  function onMenuCustomTextColorText(e: Event) {
    const v = (e.target as HTMLInputElement | null)?.value
    if (v && isHexColor(v)) emitTextColor(v)
  }

  function onMenuCustomHighlight(e: Event) {
    const v = (e.target as HTMLInputElement | null)?.value
    if (v && isHexColor(v)) emitHighlight(v)
  }

  function onMenuCustomHighlightText(e: Event) {
    const v = (e.target as HTMLInputElement | null)?.value
    if (v && isHexColor(v)) emitHighlight(v)
  }

  function isDisabled(item: any) {
    if (!item || !item.disabledProp) return false
    if (item.disabledProp === 'isDirty') return !isDirty.value
    return false
  }

  function getBinding(item: any) {
    if (!item || !item.bind) return { value: false }
    return bindings[item.bind] ?? { value: false }
  }

  function getShortcut(item: any) {
    return (item as any).shortcut
  }

  function getIcon(item: any) {
    return item && (item as any).icon ? (item as any).icon : null
  }

  function isHexColor(v: any) {
    if (!v || typeof v !== 'string') return false
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v.trim())
  }

  // Title editing state
  const isEditingTitle = ref(false)
  const editingTitle = ref('')
  const titleInput = ref<InstanceType<typeof Input> | null>(null)

  // detect platform on client to show correct modifier icon in shortcuts
  const isMac = ref(false)
  onMounted(() => {
    try {
      isMac.value = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
    } catch (e) {
      isMac.value = false
    }
  })

  function startEditingTitle() {
    isEditingTitle.value = true
    editingTitle.value = title.value || ''
    nextTick(() => {
      const inputElement = titleInput.value?.$el as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
        inputElement.select()
      }
    })
  }

  function saveTitle() {
    if (editingTitle.value.trim()) {
      updateTitle(editingTitle.value.trim())
    }
    isEditingTitle.value = false
  }

  function cancelEdit() {
    isEditingTitle.value = false
    editingTitle.value = ''
  }

  function updateTitle(newTitle: string) {
    store.setTitle(newTitle)
  }

  function save() {
    // open the Save dialog when user selects Save from menu
    showSaveDialog.value = true
  }

  function newDoc() {
    // reset store to create a fresh document
    store.reset()
  }

  function onExportDialogUpdate(v: boolean) {
    showExportDialog.value = v
    if (!v) exportInitialFormat.value = null
  }

  // Table insertion handler
  function handleTableInsert(rows: number, cols: number, options: any) {
    emit('insert-table', rows, cols, options)
  }

  // Emoji insertion handler
  function handleEmojiInsert(emoji: any) {
    emit('insert-emoji', emoji.char)
  }

  // File import helpers
  const fileInput = ref<HTMLInputElement | null>(null)

  function openFilePicker() {
    if (!fileInput.value) return
    fileInput.value.value = ''
    fileInput.value.click()
  }

  async function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input || !input.files || input.files.length === 0) return
    const file = input.files[0]
    if (!file) return
    await handleImportFile(file)
    input.value = ''
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text()
      const name = file.name || 'imported'

      // Try JSON first
      if (file.type === 'application/json' || name.endsWith('.json')) {
        try {
          const obj = JSON.parse(text)
          // Expecting export shape: { title, content, attachments?, meta? }
          if (obj && typeof obj === 'object') {
            // Remove any embedded proof before loading
            if (obj.proof) delete obj.proof
            if (obj.proofNote) delete obj.proofNote

            store.setTitle(obj.title || name.replace(/\.[^.]+$/, ''))
            store.setContent(obj.content || '')
            // attachments - if present and simple map of name->dataUri
            if (obj.attachments && typeof obj.attachments === 'object') {
              for (const k of Object.keys(obj.attachments)) {
                try { store.addAttachment(obj.attachments[k], k) } catch (_) { }
              }
            }
            return
          }
        } catch (jsonErr) {
          // fallthrough to other parsers
        }
      }

      // Markdown: strip YAML frontmatter if present and remove any cryptographic proof comments
      if (name.endsWith('.md') || name.endsWith('.markdown') || text.trim().startsWith('---')) {
        let body = text
        if (body.startsWith('---')) {
          const parts = body.split(/---\s*\n/)
          if (parts.length >= 3) {
            // parts[1] is frontmatter
            body = parts.slice(2).join('---\n')
          }
        }
        // Remove HTML comment proofs like: <!-- Cryptographic Proof: {...} -->
        body = body.replace(/<!--\s*Cryptographic Proof:[\s\S]*?-->/gi, '')
        // Remove any residual proof notes
        body = body.replace(/<!--\s*No cryptographic proof available[\s\S]*?-->/gi, '')

        store.setTitle(name.replace(/\.[^.]+$/, ''))
        store.setContent(body.trim())
        return
      }

      // HTML: try extracting meaningful text and title
      if (name.endsWith('.html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        // Simple DOM parse using DOMParser in browser
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(text, 'text/html')
          const title = doc.querySelector('title')?.textContent || name.replace(/\.[^.]+$/, '')
          // remove any embedded proof script or comments
          const proofScript = doc.querySelector('#chainpaper-proof')
          if (proofScript && proofScript.parentNode) proofScript.parentNode.removeChild(proofScript)
          // remove HTML comment proofs
          // iterate through comments and remove ones containing 'Cryptographic Proof'
          const iterator = document.createNodeIterator(doc, NodeFilter.SHOW_COMMENT)
          const commentsToRemove: Comment[] = []
          let cur: Comment | null = iterator.nextNode() as Comment | null
          while (cur) {
            if (/Cryptographic Proof/i.test(cur.nodeValue || '')) commentsToRemove.push(cur)
            cur = iterator.nextNode() as Comment | null
          }
          for (const c of commentsToRemove) {
            if (c.parentNode) c.parentNode.removeChild(c)
          }

          // extract body text; keep basic tags
          const bodyEl = doc.body
          const extracted = bodyEl ? bodyEl.innerText || bodyEl.textContent || '' : ''
          store.setTitle(title)
          store.setContent((extracted || '').trim())
          return
        } catch (err) {
          // fallback to raw text
          store.setTitle(name.replace(/\.[^.]+$/, ''))
          store.setContent(text)
          return
        }
      }

      // Default: plain text -> set content
      store.setTitle(name.replace(/\.[^.]+$/, ''))
      store.setContent(text)
    } catch (err) {
      console.error('Failed to import file', err)
    }
  }
</script>
