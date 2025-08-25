<template>
  <Menubar class="px-2 sm:px-4 py-9 bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-3">
  <NuxtImg src="/Palimphest.png" alt="ChainPaper Logo" loading="eager"
          class="w-18 h-18 flex items-center justify-center" />
      </div>
      <!-- Right Side: Two rows -->
      <div class="flex flex-col self-center flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1">
          <div v-if="!isEditingTitle" @click="startEditingTitle"
            class="flex items-center gap-2 px-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <span class="text-lg text-gray-900 font-medium -ml-2">{{ documentTitle || 'Untitled Document' }}</span>
            <Edit3 class="w-4 h-4 text-gray-500" />
            <span v-if="isDirty" class="text-orange-500">•</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <Input ref="titleInput" v-model="editingTitle" @blur="saveTitle" @keyup.enter="saveTitle"
              @keyup.escape="cancelEdit" class="text-lg bg-transparent border-2 rounded-md outline-none px-1 min-w-48"
              :placeholder="'Untitled Document'" />
            <!-- <Edit3 class="w-4 h-4 text-blue-500" /> -->
          </div>
        </div>
        <!-- Second Row: Menu Items -->
        <div class="flex items-center gap-1">
          <!-- File Menu -->
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
        <MenubarItem @click="$emit('new-document')" class="flex items-center justify-between gap-2 min-w-[220px]">
                <FileText class="w-4 h-4" />
                New Document
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">N</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
        <MenubarItem @click="$emit('open-document')" class="flex items-center justify-between gap-2 min-w-[220px]">
                <FolderOpen class="w-4 h-4" />
                Open
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">O</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
        <MenubarItem @click="$emit('save-document')" class="flex items-center justify-between gap-2 min-w-[220px]" :disabled="!isDirty">
                <Save class="w-4 h-4" />
                Save
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">S</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger class="flex items-center gap-2">
                  <Upload class="w-4 h-4" />
                  Export As
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem @click="$emit('export-document', 'json')" class="flex items-center gap-2">
                    <FileJson class="w-4 h-4" />
                    ChainPaper JSON
                  </MenubarItem>
                  <MenubarItem @click="$emit('export-document', 'pdf')" class="flex items-center gap-2">
                    <FileImage class="w-4 h-4" />
                    PDF Document
                  </MenubarItem>
                  <MenubarItem @click="$emit('export-document', 'docx')" class="flex items-center gap-2">
                    <FileText class="w-4 h-4" />
                    Word Document
                  </MenubarItem>
                  <MenubarItem @click="$emit('export-document', 'html')" class="flex items-center gap-2">
                    <Globe class="w-4 h-4" />
                    HTML Page
                  </MenubarItem>
                  <MenubarItem @click="$emit('export-document', 'markdown')" class="flex items-center gap-2">
                    <Hash class="w-4 h-4" />
                    Markdown
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem @click="$emit('import-document')" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Download class="w-4 h-4" />
                Import Document
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Edit Menu -->
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="handleUndo" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Undo2 class="w-4 h-4" />
                Undo
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">Z</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleRedo" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Redo2 class="w-4 h-4" />
                Redo
                <MenubarShortcut>
                  <div class="flex items-center">
                    <!-- Redo: mac uses Shift+Z, others use Ctrl+Y -->
                    <template v-if="isMac">
                      <span class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">⇧</span>
                      <span class="text-xs mr-1">+</span>
                      <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">Z</span>
                    </template>
                    <template v-else>
                      <span class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                      <span class="text-xs mr-1">+</span>
                      <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">Y</span>
                    </template>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="handleCut" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Scissors class="w-4 h-4" />
                Cut
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">X</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleCopy" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Copy class="w-4 h-4" />
                Copy
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">C</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handlePaste" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Clipboard class="w-4 h-4" />
                Paste
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">V</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="handleSelectAll" class="flex items-center justify-between gap-2 min-w-[220px]">
                <MousePointer class="w-4 h-4" />
                Select All
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">A</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleFind" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Search class="w-4 h-4" />
                Find & Replace
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">F</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- View Menu -->
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="toggleSidebar" class="flex items-center gap-2">
                <Sidebar class="w-4 h-4" />
                Toggle Sidebar
              </MenubarItem>
              <MenubarSeparator />
              <MenubarCheckboxItem v-model:checked="showToolbar" class="flex items-center gap-2">
                <Wrench class="w-4 h-4" />
                Show Toolbar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem v-model:checked="showStatusBar" class="flex items-center gap-2">
                <BarChart3 class="w-4 h-4" />
                Show Status Bar
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger class="flex items-center gap-2">
                  <ZoomIn class="w-4 h-4" />
                  Zoom
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem @click="setZoom(0.5)">50%</MenubarItem>
                  <MenubarItem @click="setZoom(0.75)">75%</MenubarItem>
                  <MenubarItem @click="setZoom(1)">100%</MenubarItem>
                  <MenubarItem @click="setZoom(1.25)">125%</MenubarItem>
                  <MenubarItem @click="setZoom(1.5)">150%</MenubarItem>
                  <MenubarItem @click="setZoom(2)">200%</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarCheckboxItem v-model:checked="typewriterMode" class="flex items-center gap-2">
                <Type class="w-4 h-4" />
                Typewriter Mode
              </MenubarCheckboxItem>
              <MenubarCheckboxItem v-model:checked="focusMode" class="flex items-center gap-2">
                <Target class="w-4 h-4" />
                Focus Mode
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Insert Menu -->
          <MenubarMenu>
            <MenubarTrigger>Insert</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="insertTable" class="flex items-center gap-2">
                <Table class="w-4 h-4" />
                Table
              </MenubarItem>
              <MenubarItem @click="insertImage" class="flex items-center gap-2">
                <ImageIcon class="w-4 h-4" />
                Image
              </MenubarItem>
              <MenubarItem @click="insertLink" class="flex items-center gap-2">
                <Link class="w-4 h-4" />
                Link
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="insertCodeBlock" class="flex items-center gap-2">
                <Code2 class="w-4 h-4" />
                Code Block
              </MenubarItem>
              <MenubarItem @click="insertMath" class="flex items-center gap-2">
                <Calculator class="w-4 h-4" />
                Math Formula
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="insertDate" class="flex items-center gap-2">
                <Calendar class="w-4 h-4" />
                Date & Time
              </MenubarItem>
              <MenubarItem @click="insertPageBreak" class="flex items-center gap-2">
                <FileText class="w-4 h-4" />
                Page Break
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Format Menu -->
          <MenubarMenu>
            <MenubarTrigger>Format</MenubarTrigger>
            <MenubarContent>
        <MenubarItem @click="toggleBold" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Bold class="w-4 h-4" />
                Bold
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center aspect-square w-8 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold">B</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="toggleItalic" class="flex items-center gap-2">
                <Italic class="w-4 h-4" />
                Italic
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center px-2 h-6 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold">I</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="toggleUnderline" class="flex items-center gap-2">
                <Underline class="w-4 h-4" />
                Underline
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center px-2 h-6 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold">U</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger class="flex items-center gap-2">
                  <Heading class="w-4 h-4" />
                  Paragraph
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem @click="setHeading(1)">Heading 1</MenubarItem>
                  <MenubarItem @click="setHeading(2)">Heading 2</MenubarItem>
                  <MenubarItem @click="setHeading(3)">Heading 3</MenubarItem>
                  <MenubarItem @click="setParagraph">Normal Text</MenubarItem>
                  <MenubarItem @click="setBlockquote">Quote</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem @click="toggleBulletList" class="flex items-center gap-2">
                <List class="w-4 h-4" />
                Bullet List
              </MenubarItem>
              <MenubarItem @click="toggleOrderedList" class="flex items-center gap-2">
                <ListOrdered class="w-4 h-4" />
                Numbered List
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Tools Menu -->
          <MenubarMenu>
            <MenubarTrigger>Tools</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="spellCheck" class="flex items-center gap-2">
                <BookOpen class="w-4 h-4" />
                Spell Check
                <MenubarShortcut>
                  <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold">F7</span>
                </MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="wordCount" class="flex items-center gap-2">
                <Hash class="w-4 h-4" />
                Word Count
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="verifyAuthorship" class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4" />
                Verify Authorship
              </MenubarItem>
              <MenubarItem @click="generateProof" class="flex items-center gap-2">
                <FileSignature class="w-4 h-4" />
                Generate Proof
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="$emit('settings')" class="flex items-center justify-between gap-2 min-w-[220px]">
                <Settings class="w-4 h-4" />
                Preferences
                <MenubarShortcut>
                  <div class="flex items-center">
                    <span v-if="isMac" class="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs mr-1">
                      <Command class="w-3 h-3" />
                    </span>
                    <span v-else class="inline-flex items-center justify-center px-2 h-6 rounded bg-gray-100 text-xs font-medium mr-1">Ctrl</span>
                    <span class="text-xs mr-1">+</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold">,</span>
                  </div>
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Help Menu -->
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="showKeyboardShortcuts" class="flex items-center gap-2">
                <Keyboard class="w-4 h-4" />
                Keyboard Shortcuts
              </MenubarItem>
              <MenubarItem @click="showDocumentation" class="flex items-center gap-2">
                <BookOpen class="w-4 h-4" />
                Documentation
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="$emit('about')" class="flex items-center gap-2">
                <Info class="w-4 h-4" />
                About ChainPaper
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </div>
      </div>
    </div>
  </Menubar>
</template>

<script setup lang="ts">
  import { ref, defineEmits, defineProps, nextTick, onMounted } from 'vue'
  import {
  FileText, FolderOpen, Save, Upload, Download, FileJson, FileImage, Globe,
    Undo2, Redo2, Scissors, Copy, Clipboard, MousePointer, Search,
    Sidebar, Wrench, BarChart3, ZoomIn, Type, Target,
    Table, ImageIcon, Link, Code2, Calculator, Calendar,
    Bold, Italic, Underline, Heading, List, ListOrdered,
    BookOpen, ShieldCheck, FileSignature, Settings,
  Keyboard, Info, Edit3, Command, Grid2x2, Hash
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

  const props = defineProps<{
    documentTitle: string
    isDirty: boolean
    user: {
      name: string
      email?: string
      avatar?: string
    }
  }>()

  // typed emits (call-signature overloads) for SFC: list events emitted by this component
  const emit = defineEmits<
    {
      (e: 'update-title', title: string): void
      (e: 'new-document'): void
      (e: 'open-document'): void
      (e: 'save-document'): void
      (e: 'import-document'): void
      (e: 'undo'): void
      (e: 'redo'): void
      (e: 'cut'): void
      (e: 'copy'): void
      (e: 'paste'): void
      (e: 'select-all'): void
      (e: 'toggle-find'): void
      (e: 'toggle-sidebar'): void
      (e: 'set-zoom', level: number): void
      (e: 'insert-table'): void
      (e: 'insert-image'): void
      (e: 'insert-link'): void
      (e: 'insert-code-block'): void
      (e: 'insert-math'): void
      (e: 'insert-date'): void
      (e: 'insert-page-break'): void
      (e: 'format-bold'): void
      (e: 'format-italic'): void
      (e: 'format-underline'): void
      (e: 'set-heading', level: number): void
      (e: 'set-paragraph'): void
      (e: 'set-blockquote'): void
      (e: 'toggle-bullet-list'): void
      (e: 'toggle-ordered-list'): void
      (e: 'spell-check'): void
      (e: 'word-count'): void
      (e: 'verify-authorship'): void
      (e: 'generate-proof'): void
      (e: 'show-shortcuts'): void
    }
  >()

  // View state
  const showToolbar = ref(true)
  const showStatusBar = ref(true)
  const typewriterMode = ref(false)
  const focusMode = ref(false)

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

  // Title editing functions
  async function startEditingTitle() {
    isEditingTitle.value = true
    editingTitle.value = props.documentTitle || 'Untitled Document'
    await nextTick()
    titleInput.value?.focus()
    titleInput.value?.select()
  }

  function saveTitle() {
    if (editingTitle.value.trim()) {
      emit('update-title', editingTitle.value.trim())
    } else {
      emit('update-title', 'Untitled Document')
    }
    isEditingTitle.value = false
  }

  function cancelEdit() {
    isEditingTitle.value = false
    editingTitle.value = props.documentTitle || 'Untitled Document'
  }

  // Editor actions emit events for parent to handle (use typed `emit` above)

  function handleUndo() {
    emit('undo')
  }

  function handleRedo() {
    emit('redo')
  }

  function handleCut() {
    emit('cut')
  }

  function handleCopy() {
    emit('copy')
  }

  function handlePaste() {
    emit('paste')
  }

  function handleSelectAll() {
    emit('select-all')
  }

  function handleFind() {
    emit('toggle-find')
  }

  function toggleSidebar() {
    emit('toggle-sidebar')
  }

  function setZoom(level: number) {
    emit('set-zoom', level)
  }

  // Insert actions

  function insertTable() {
    emit('insert-table')
  }

  function insertImage() {
    emit('insert-image')
  }

  function insertLink() {
    emit('insert-link')
  }

  function insertCodeBlock() {
    emit('insert-code-block')
  }

  function insertMath() {
    emit('insert-math')
  }

  function insertDate() {
    emit('insert-date')
  }

  function insertPageBreak() {
    emit('insert-page-break')
  }

  // Format actions
  function toggleBold() {
    emit('format-bold')
  }

  function toggleItalic() {
    emit('format-italic')
  }

  function toggleUnderline() {
    emit('format-underline')
  }

  function setHeading(level: number) {
    emit('set-heading', level)
  }

  function setParagraph() {
    emit('set-paragraph')
  }

  function setBlockquote() {
    emit('set-blockquote')
  }

  function toggleBulletList() {
    emit('toggle-bullet-list')
  }

  function toggleOrderedList() {
    emit('toggle-ordered-list')
  }

  // Tool actions
  function spellCheck() {
    emit('spell-check')
  }

  function wordCount() {
    emit('word-count')
  }

  function verifyAuthorship() {
    emit('verify-authorship')
  }

  function generateProof() {
    emit('generate-proof')
  }

  function showKeyboardShortcuts() {
    emit('show-shortcuts')
  }

  function showDocumentation() {
    // keep original behavior to open docs
    window.open('https://github.com/KurutoDenzeru/ChainPaper/blob/master/README.md', '_blank')
  }
</script>
