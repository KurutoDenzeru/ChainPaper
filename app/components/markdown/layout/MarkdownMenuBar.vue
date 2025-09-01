<template>
  <Menubar class="px-2 sm:px-4 py-9 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-3">
        <NuxtImg src="/Markdown.png" alt="ChainPaper Markdown" loading="eager"
          class="w-18 h-18 flex items-center justify-center" />
      </div>
      <!-- Right Side: Two rows -->
      <div class="flex flex-col self-center flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1">
          <div v-if="!isEditingTitle" @click="startEditingTitle"
            class="flex items-center gap-2 px-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <span class="text-lg text-gray-900 font-medium -ml-2">{{ title || 'Untitled Markdown' }}</span>
            <Edit3 class="w-4 h-4 text-gray-600" />
            <span v-if="isDirty" class="text-orange-500">•</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <Input ref="titleInput" v-model="editingTitle" @blur="saveTitle" @keyup.enter="saveTitle"
              @keyup.escape="cancelEdit" class="text-lg bg-transparent border-2 rounded-md outline-none px-1 min-w-48"
              :placeholder="'Untitled Markdown'" />
          </div>
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
                      <MenubarItem v-for="(sub, sidx) in (item as any).items" :key="menu.label + '-sub-' + sidx"
                        @click="handleMenuEmit(sub)" class="flex items-center gap-2">
                        <component :is="getIcon(sub)" class="w-4 h-4 text-gray-600" v-if="getIcon(sub)" />
                        {{ sub.label }}
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem v-else class="flex items-center justify-between min-w-[250px]"
                    :disabled="isDisabled(item)" @click="handleMenuEmit(item)">
                    <div class="flex items-center gap-2">
                      <component :is="getIcon(item)" class="w-4 h-4 text-gray-600" v-if="getIcon(item)" />

                      <!-- For table item wrap the label with TableInserter so hovering the label opens the grid -->
                      <template v-if="item.emit === 'insert-table'">
                        <TableInserter @insertTable="(r, c, h) => $emit('insert-table', r, c, h)">
                          <button class="text-sm text-gray-900 hover:bg-gray-100 rounded">{{ item.label }}</button>
                        </TableInserter>
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
  <MarkdownWordCountDialog 
    :open="showWordCountDialog"
    @update:open="showWordCountDialog = $event"
  />

  <MarkdownAuthProofDialog
    :open="showAuthProofDialog"
    @update:open="showAuthProofDialog = $event"
  />

  <MarkdownExportDialog
    :open="showExportDialog"
    :initialFormat="exportInitialFormat"
    @update:open="onExportDialogUpdate"
  />

  <MarkdownSaveDialog
    :open="showSaveDialog"
    @update:open="showSaveDialog = $event"
  />

  <MarkdownAboutDialog
    :open="showAboutDialog"
    @update:open="showAboutDialog = $event"
  />

  <MarkdownGuideDialog
    :open="showGuideDialog"
    @update:open="showGuideDialog = $event"
  />
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    Edit3, Command, FileText, FolderOpen, Save, Download,
    Undo2, Redo2, Scissors, Copy, Clipboard, Search, Bold, Italic, Underline,
    Strikethrough, Heading, List, ListOrdered, Quote, Link, Image, Table,
    Code2, Wrench, BarChart3, Eye, ZoomIn, Hash, Shield, BookOpen, Info
  } from 'lucide-vue-next'
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from '@/components/ui/menubar'
  import { Input } from '@/components/ui/input'
  import TableInserter from '@/components/editor/TableInserter.vue'
  import MarkdownWordCountDialog from '../editor/MarkdownWordCountDialog.vue'
  import MarkdownAuthProofDialog from '../editor/MarkdownAuthProofDialog.vue'
  import MarkdownExportDialog from '../editor/MarkdownExportDialog.vue'
  import MarkdownSaveDialog from '../editor/MarkdownSaveDialog.vue'
  import MarkdownAboutDialog from '../editor/MarkdownAboutDialog.vue'
  import MarkdownGuideDialog from '../editor/MarkdownGuideDialog.vue'
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
    (e: 'format-bold'): void
    (e: 'format-italic'): void
    (e: 'format-underline'): void
    (e: 'format-strikethrough'): void
    (e: 'set-heading', level: number): void
    (e: 'toggle-bullet-list'): void
    (e: 'toggle-ordered-list'): void
    (e: 'toggle-blockquote'): void
    (e: 'spell-check'): void
    (e: 'word-count'): void
    (e: 'verify-authorship'): void
    (e: 'show-shortcuts'): void
    (e: 'show-about'): void
    (e: 'show-documentation'): void
    (e: 'toggle-preview'): void
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
  { type: 'separator' },
  // Link moved from Insert -> Format
  { type: 'item', label: 'Link', emit: 'insert-link', icon: Link, shortcut: { mac: ['Command'], key: 'K', pc: 'Ctrl' } },
        { type: 'separator' },
        {
          type: 'sub', label: 'Heading', icon: Heading, items: [
            { type: 'item', label: 'Heading 1', emit: 'set-heading', payload: 1, shortcut: { mac: ['Command'], key: '1', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 2', emit: 'set-heading', payload: 2, shortcut: { mac: ['Command'], key: '2', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 3', emit: 'set-heading', payload: 3, shortcut: { mac: ['Command'], key: '3', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 4', emit: 'set-heading', payload: 4, shortcut: { mac: ['Command'], key: '4', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 5', emit: 'set-heading', payload: 5, shortcut: { mac: ['Command'], key: '5', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 6', emit: 'set-heading', payload: 6, shortcut: { mac: ['Command'], key: '6', pc: 'Ctrl' } }
          ]
        },
        { type: 'separator' },
        { type: 'item', label: 'Bullet List', emit: 'toggle-bullet-list', icon: List },
        { type: 'item', label: 'Numbered List', emit: 'toggle-ordered-list', icon: ListOrdered },
        { type: 'item', label: 'Blockquote', emit: 'toggle-blockquote', icon: Quote }
      ]
    },
    {
      label: 'Insert',
      items: [
        { type: 'item', label: 'Image', emit: 'insert-image', icon: Image },
        { type: 'item', label: 'Table', emit: 'insert-table', icon: Table },
        { type: 'item', label: 'Code Block', emit: 'insert-code-block', icon: Code2 },
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

    // Special handling for zoom menu
    if (item.emit === 'set-zoom' && item.payload !== undefined) {
      emit('set-zoom', item.payload)
      return
    }

    if (item.payload !== undefined) emit(item.emit as any, item.payload)
    else emit(item.emit as any)
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

  // Title editing state
  const isEditingTitle = ref(false)
  const editingTitle = ref('')
  const titleInput = ref<HTMLInputElement | null>(null)

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
      titleInput.value?.focus()
      titleInput.value?.select()
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
</script>
