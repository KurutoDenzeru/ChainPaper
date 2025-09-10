<template>
  <Menubar class="px-2 sm:px-4 py-9 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-200">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-3" role="presentation">
        <client-only>
          <NuxtImg v-if="!isNarrow" src="/markdown.webp" alt="ChainPaper Markdown" loading="eager" fetchpriority="high"
            sizes="72px" class="w-18 h-auto object-contain flex items-center justify-center" />
        </client-only>
      </div>

      <!-- Right Side: Two rows -->
      <div class="flex flex-col self-center flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1" role="presentation">
            <div v-if="!isEditingTitle" class="flex items-center gap-2 px-3 rounded">
            <!-- Visible document title (non-interactive) -->
            <span class="text-lg text-gray-900 dark:text-white font-medium -ml-2">{{ title || 'Untitled Markdown' }}</span>

            <!-- Edit button: icon-only, clearly labeled for assistive tech -->
              <button type="button" @click="startEditingTitle" aria-label="Edit document title"
              class="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1">
              <span class="sr-only">Edit document title</span>
              <Edit3 aria-hidden="true" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>

            <span v-if="isDirty" aria-hidden="true" class="text-orange-500">•</span>
          </div>
          <client-only>
            <div v-if="isEditingTitle" class="flex items-center gap-2">
              <Input id="doc-title-input" ref="titleInput" v-model="editingTitle" @blur="saveTitle"
                @keyup.enter="saveTitle" @keyup.escape="cancelEdit"
                class="text-lg bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-md outline-none px-1 min-w-48 text-gray-900 dark:text-white"
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
                  <!-- Checkbox items removed; now using buttons for toolbar/statusbar/preview -->
                  <MenubarSub v-else-if="item.type === 'sub'">
                    <MenubarSubTrigger class="flex items-center gap-2">
                      <component :is="(item as any).icon" class="w-4 h-4 text-gray-600 dark:text-gray-300" v-if="(item as any).icon" />
                      {{ item.label }}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <template v-for="(sub, sidx) in (item as any).items" :key="menu.label + '-sub-' + sidx">
                        <MenubarSeparator v-if="sub.type === 'separator'" />
                        <MenubarItem v-else @click="handleMenuEmit(sub)" class="flex items-center justify-between min-w-[220px]">
                          <div class="flex items-center gap-2">
                            <component :is="getIcon(sub)" class="w-4 h-4 text-gray-600 dark:text-gray-300" v-if="getIcon(sub)" />
                            <span>{{ sub.label }}</span>
                          </div>
                          <MenubarShortcut v-if="getShortcut(sub)">
                            <!-- reuse shortcut rendering if present -->
                            <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium mr-1">{{ getShortcut(sub)?.pc || getShortcut(sub)?.key || '' }}</span>
                          </MenubarShortcut>
                        </MenubarItem>
                      </template>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem v-else class="flex items-center justify-between min-w-[250px]"
                    :disabled="isDisabled(item)" @click="handleMenuEmit(item)">
                    <div class="flex items-center gap-2">
                      <component :is="getIcon(item)" class="w-4 h-4 text-gray-600 dark:text-gray-300" v-if="getIcon(item)" />
                      <span>{{ item.label }}</span>
                    </div>
                    <MenubarShortcut v-if="getShortcut(item)">
                      <!-- ...existing shortcut code... -->
                    </MenubarShortcut>
                  </MenubarItem>
                </template>
              </MenubarContent>
            </MenubarMenu>
          </template>
        </div>
      </div>

      <!-- Theme selector (moved out of Menubar menus) -->
      <div class="flex items-center self-center ml-3">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="inline-flex items-center gap-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm" aria-label="Theme selector">
              <component :is="theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor" class="w-4 h-4 text-gray-600 dark:text-gray-200" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="p-2 w-44 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div class="flex flex-col items-start">
              <Button variant="ghost"  class="flex items-center justify-start w-full gap-2 px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-left" @click="setTheme('system')">
                <Monitor class="w-4 h-4" /> System
              </Button>
              <Button variant="ghost" class="flex items-center justify-start w-full gap-2 px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-left" @click="setTheme('light')">
                <Sun class="w-4 h-4" /> Light
              </Button>
              <Button variant="ghost" class="flex items-center justify-start w-full gap-2 px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-left" @click="setTheme('dark')">
                <Moon class="w-4 h-4" /> Dark
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </Menubar>

  <!-- Dialogs -->
  <WordCountDialog :open="showWordCountDialog" @update:open="showWordCountDialog = $event" />

  <AuthProofDialog :open="showAuthProofDialog" @update:open="showAuthProofDialog = $event" />

  <ExportDialog :open="showExportDialog" :initialFormat="exportInitialFormat"
    @update:open="onExportDialogUpdate" />

  <SaveDialog :open="showSaveDialog" @update:open="showSaveDialog = $event" />

  <AboutDialog :open="showAboutDialog" @update:open="showAboutDialog = $event" />

  <GuideDialog :open="showGuideDialog" @update:open="showGuideDialog = $event" />

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
  import { ref, nextTick, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useEditorModeStore } from '@/stores/editorMode'
  import {
    Edit3, FileText, FolderOpen, Save, Download,
    Undo2, Redo2, Scissors, Copy, Clipboard, Bold, Italic, Underline,
    Strikethrough, Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    Type, Highlighter,
    List, ListOrdered, Quote, Link, Image, Table, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Code2, Wrench, BarChart3, ZoomIn, Hash, Shield, BookOpen, Info, Indent, Outdent,
    Superscript, Subscript, Sigma, SquareSigma, Minus, Smile
  } from 'lucide-vue-next'
  // Theme icons
  import { Sun, Moon, Monitor } from 'lucide-vue-next'
  import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
  import { Input } from '@/components/ui/input'
  import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
  // Lazy-load dialog components to reduce initial bundle and improve LCP
  const TableInsertDialog = defineAsyncComponent(() => import('~/components/dialogs/TableInsertDialog.vue'))
  const EmojiInsertDialog = defineAsyncComponent(() => import('~/components/dialogs/EmojiInsertDialog.vue'))
  const WordCountDialog = defineAsyncComponent(() => import('../dialogs/WordCountDialog.vue'))
  const AuthProofDialog = defineAsyncComponent(() => import('../dialogs/AuthProofDialog.vue'))
  const ExportDialog = defineAsyncComponent(() => import('../dialogs/ExportDialog.vue'))
  const SaveDialog = defineAsyncComponent(() => import('../dialogs/SaveDialog.vue'))
  const AboutDialog = defineAsyncComponent(() => import('../dialogs/AboutDialog.vue'))
  const GuideDialog = defineAsyncComponent(() => import('../dialogs/GuideDialog.vue'))
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
    (e: 'toggle-toolbar', value: boolean): void
    (e: 'toggle-statusbar', value: boolean): void
    (e: 'set-text-color', color: string): void
    (e: 'set-highlight', color: string): void
  }>()

  // View state
  const showToolbar = ref(true)
  const showStatusBar = ref(true)
  // Pinia store for editor mode (source/reader)
  const editorModeStore = useEditorModeStore()
  const { mode } = storeToRefs(editorModeStore)
  // Preview mode is true if mode is 'reader'
  const showPreview = computed({
    get: () => mode.value === 'reader',
    set: (val: boolean) => {
      if (val && mode.value !== 'reader') mode.value = 'reader'
      else if (!val && mode.value !== 'source') mode.value = 'source'
    }
  })

  // Dynamic icon for Preview Mode
  const previewModeIcon = computed(() => mode.value === 'reader' ? BookOpen : Edit3)
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

  // Theme handling: 'light' | 'dark' | 'system'
  const theme = ref<'light' | 'dark' | 'system'>('system')
  let mediaMatcher: MediaQueryList | null = null

  function applyTheme(t: 'light' | 'dark' | 'system') {
    try {
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (t === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // system preference
        const prefersDark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
        if (prefersDark) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      // ignore (SSR or restricted)
    }
    theme.value = t
    try {
      if (t === 'system') localStorage.removeItem('chainpaper_theme')
      else localStorage.setItem('chainpaper_theme', t)
    } catch (e) {}
  }

  function setTheme(t: 'light' | 'dark' | 'system') {
    applyTheme(t)
  }

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
        { type: 'button', label: 'Show Toolbar', emit: 'toggle-toolbar', icon: Wrench },
        { type: 'button', label: 'Show Status Bar', emit: 'toggle-statusbar', icon: BarChart3 },
        { type: 'button', label: 'Preview Mode', emit: 'toggle-preview', icon: previewModeIcon.value },
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

  // No bindings or MenubarCheckboxItem needed for buttons

  // Generic emitter for menu items
  function handleMenuEmit(item: any) {
    // Cut, Copy, Paste
    if (item.emit === 'cut') {
      emit('cut')
      return
    }
    if (item.emit === 'copy') {
      emit('copy')
      return
    }
    if (item.emit === 'paste') {
      emit('paste')
      return
    }
    // Special handling for View menu buttons
    if (item.emit === 'toggle-preview') {
      showPreview.value = !showPreview.value
      return
    }
    if (item.emit === 'toggle-toolbar') {
      showToolbar.value = !showToolbar.value
      emit('toggle-toolbar', showToolbar.value)
      return
    }
    if (item.emit === 'toggle-statusbar') {
      showStatusBar.value = !showStatusBar.value
      emit('toggle-statusbar', showStatusBar.value)
      return
    }
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

  // No getBinding needed for buttons

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
  // hide the left brand image on very narrow screens (mobile)
  const isNarrow = ref(false)

  function updateIsNarrow() {
    if (typeof window === 'undefined') return
    isNarrow.value = window.innerWidth < 475
  }

  onMounted(() => {
    try {
      isMac.value = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
    } catch (e) {
      isMac.value = false
    }

    // initial check and listen for resizes on client
    updateIsNarrow()
    if (typeof window !== 'undefined') window.addEventListener('resize', updateIsNarrow)

    // Restore theme preference
    try {
      const saved = localStorage.getItem('chainpaper_theme')
      if (saved === 'light' || saved === 'dark') applyTheme(saved as 'light' | 'dark')
      else applyTheme('system')
    } catch (e) {
      applyTheme('system')
    }

    // Listen for system theme changes when in 'system' mode
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        mediaMatcher = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => { if (theme.value === 'system') applyTheme('system') }
        // modern API
        if ((mediaMatcher as any).addEventListener) mediaMatcher.addEventListener('change', handler)
        else (mediaMatcher as any).addListener(handler)
      }
    } catch (e) {}
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') window.removeEventListener('resize', updateIsNarrow)
    try {
      if (mediaMatcher) {
        if ((mediaMatcher as any).removeEventListener) (mediaMatcher as any).removeEventListener('change', () => {})
        else (mediaMatcher as any).removeListener(() => {})
      }
    } catch (e) {}
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
    // Clear persisted session so a page refresh doesn't restore the previous doc
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem('chainpaper_current_doc')
      // mark this session as a new session so the auto-restore on page load is skipped
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('chainpaper_new_session', '1')
    } catch (e) {
      // ignore (SSR or blocked storage)
    }
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
