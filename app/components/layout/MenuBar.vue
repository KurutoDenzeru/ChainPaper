<template>
  <Menubar class="px-2 sm:px-4 py-11 border-none rounded-none bg-white border-b border-gray-200">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-6">
        <NuxtImg src="/Palimphest.png" alt="ChainPaper Logo" loading="lazy"
          class="w-18 h-18 flex items-center justify-center" />
      </div>
      <!-- Right Side: Two rows -->
      <div class="flex flex-col flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1">
          <div v-if="!isEditingTitle" @click="startEditingTitle"
            class="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <span class="text-lg text-gray-900">{{ documentTitle || 'Untitled Document' }}</span>
            <Edit3 class="w-4 h-4 text-gray-500" />
            <span v-if="isDirty" class="text-orange-500">•</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <Input ref="titleInput" v-model="editingTitle" @blur="saveTitle" @keyup.enter="saveTitle"
              @keyup.escape="cancelEdit"
              class="text-lg bg-transparent border-2 rounded-md outline-none px-1 min-w-48"
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
              <MenubarItem @click="$emit('new-document')" class="flex items-center gap-2">
                <FileText class="w-4 h-4" />
                New Document
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="$emit('open-document')" class="flex items-center gap-2">
                <FolderOpen class="w-4 h-4" />
                Open
                <MenubarShortcut>Ctrl+O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="$emit('save-document')" class="flex items-center gap-2" :disabled="!isDirty">
                <Save class="w-4 h-4" />
                Save
                <MenubarShortcut>Ctrl+S</MenubarShortcut>
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
              <MenubarItem @click="$emit('import-document')" class="flex items-center gap-2">
                <Download class="w-4 h-4" />
                Import Document
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <!-- Edit Menu -->
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="handleUndo" class="flex items-center gap-2">
                <Undo2 class="w-4 h-4" />
                Undo
                <MenubarShortcut>Ctrl+Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleRedo" class="flex items-center gap-2">
                <Redo2 class="w-4 h-4" />
                Redo
                <MenubarShortcut>Ctrl+Y</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="handleCut" class="flex items-center gap-2">
                <Scissors class="w-4 h-4" />
                Cut
                <MenubarShortcut>Ctrl+X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleCopy" class="flex items-center gap-2">
                <Copy class="w-4 h-4" />
                Copy
                <MenubarShortcut>Ctrl+C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handlePaste" class="flex items-center gap-2">
                <Clipboard class="w-4 h-4" />
                Paste
                <MenubarShortcut>Ctrl+V</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="handleSelectAll" class="flex items-center gap-2">
                <MousePointer class="w-4 h-4" />
                Select All
                <MenubarShortcut>Ctrl+A</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="handleFind" class="flex items-center gap-2">
                <Search class="w-4 h-4" />
                Find & Replace
                <MenubarShortcut>Ctrl+F</MenubarShortcut>
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
              <MenubarItem @click="toggleBold" class="flex items-center gap-2">
                <Bold class="w-4 h-4" />
                Bold
                <MenubarShortcut>Ctrl+B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="toggleItalic" class="flex items-center gap-2">
                <Italic class="w-4 h-4" />
                Italic
                <MenubarShortcut>Ctrl+I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem @click="toggleUnderline" class="flex items-center gap-2">
                <Underline class="w-4 h-4" />
                Underline
                <MenubarShortcut>Ctrl+U</MenubarShortcut>
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
                <MenubarShortcut>F7</MenubarShortcut>
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
              <MenubarItem @click="$emit('settings')" class="flex items-center gap-2">
                <Settings class="w-4 h-4" />
                Preferences
                <MenubarShortcut>Ctrl+,</MenubarShortcut>
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
      <!-- Right Side: User Menu -->
      <div class="flex items-center ml-auto">
        <div
          class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
          :title="user.name || 'Anonymous'">
          {{ (user.name || 'A').charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
  </Menubar>
</template>

<script setup lang="ts">
  import { ref, defineEmits, defineProps, nextTick } from 'vue'
  import {
    FileText, FolderOpen, Save, Upload, Download, FileJson, FileImage, Globe, Hash,
    Undo2, Redo2, Scissors, Copy, Clipboard, MousePointer, Search,
    Sidebar, Wrench, BarChart3, ZoomIn, Type, Target,
    Table, ImageIcon, Link, Code2, Calculator, Calendar,
    Bold, Italic, Underline, Heading, List, ListOrdered,
    BookOpen, ShieldCheck, FileSignature, Settings,
    Keyboard, Info, Edit3
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

  const emit = defineEmits<{
    'new-document': []
    'open-document': []
    'save-document': []
    'export-document': [format: string]
    'import-document': []
    'settings': []
    'about': []
    'update-title': [title: string]
  }>()

  // View state
  const showToolbar = ref(true)
  const showStatusBar = ref(true)
  const typewriterMode = ref(false)
  const focusMode = ref(false)

  // Title editing state
  const isEditingTitle = ref(false)
  const editingTitle = ref('')
  const titleInput = ref<HTMLInputElement | null>(null)

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

  // Editor actions
  function handleUndo() {
    document.execCommand('undo')
  }

  function handleRedo() {
    document.execCommand('redo')
  }

  function handleCut() {
    document.execCommand('cut')
  }

  function handleCopy() {
    document.execCommand('copy')
  }

  function handlePaste() {
    document.execCommand('paste')
  }

  function handleSelectAll() {
    document.execCommand('selectAll')
  }

  function handleFind() {
    // This would trigger the find dialog in the editor
    window.dispatchEvent(new CustomEvent('editor:find'))
  }

  function toggleSidebar() {
    window.dispatchEvent(new CustomEvent('editor:toggle-sidebar'))
  }

  function setZoom(level: number) {
    window.dispatchEvent(new CustomEvent('editor:zoom', { detail: level }))
  }

  // Insert actions
  function insertTable() {
    window.dispatchEvent(new CustomEvent('editor:insert-table'))
  }

  function insertImage() {
    window.dispatchEvent(new CustomEvent('editor:insert-image'))
  }

  function insertLink() {
    window.dispatchEvent(new CustomEvent('editor:insert-link'))
  }

  function insertCodeBlock() {
    window.dispatchEvent(new CustomEvent('editor:insert-code-block'))
  }

  function insertMath() {
    window.dispatchEvent(new CustomEvent('editor:insert-math'))
  }

  function insertDate() {
    window.dispatchEvent(new CustomEvent('editor:insert-date'))
  }

  function insertPageBreak() {
    window.dispatchEvent(new CustomEvent('editor:insert-page-break'))
  }

  // Format actions
  function toggleBold() {
    document.execCommand('bold')
  }

  function toggleItalic() {
    document.execCommand('italic')
  }

  function toggleUnderline() {
    document.execCommand('underline')
  }

  function setHeading(level: number) {
    window.dispatchEvent(new CustomEvent('editor:set-heading', { detail: level }))
  }

  function setParagraph() {
    window.dispatchEvent(new CustomEvent('editor:set-paragraph'))
  }

  function setBlockquote() {
    window.dispatchEvent(new CustomEvent('editor:set-blockquote'))
  }

  function toggleBulletList() {
    window.dispatchEvent(new CustomEvent('editor:toggle-bullet-list'))
  }

  function toggleOrderedList() {
    window.dispatchEvent(new CustomEvent('editor:toggle-ordered-list'))
  }

  // Tool actions
  function spellCheck() {
    window.dispatchEvent(new CustomEvent('editor:spell-check'))
  }

  function wordCount() {
    window.dispatchEvent(new CustomEvent('editor:word-count'))
  }

  function verifyAuthorship() {
    window.dispatchEvent(new CustomEvent('editor:verify-authorship'))
  }

  function generateProof() {
    window.dispatchEvent(new CustomEvent('editor:generate-proof'))
  }

  function showKeyboardShortcuts() {
    window.dispatchEvent(new CustomEvent('app:show-shortcuts'))
  }

  function showDocumentation() {
    window.open('https://github.com/chainpaper/docs', '_blank')
  }
</script>
