<template>
  <Menubar class="menu-bar">
    <!-- File Menu -->
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="$emit('new-document')" class="menu-item">
          <span class="menu-icon">📄</span>
          New Document
          <MenubarShortcut>Ctrl+N</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="$emit('open-document')" class="menu-item">
          <span class="menu-icon">📂</span>
          Open
          <MenubarShortcut>Ctrl+O</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="$emit('save-document')" class="menu-item" :disabled="!isDirty">
          <span class="menu-icon">💾</span>
          Save
          <MenubarShortcut>Ctrl+S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>
            <span class="menu-icon">📤</span>
            Export As
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem @click="$emit('export-document', 'json')">
              <span class="menu-icon">📋</span>
              ChainPaper JSON
            </MenubarItem>
            <MenubarItem @click="$emit('export-document', 'pdf')">
              <span class="menu-icon">📕</span>
              PDF Document
            </MenubarItem>
            <MenubarItem @click="$emit('export-document', 'docx')">
              <span class="menu-icon">📘</span>
              Word Document
            </MenubarItem>
            <MenubarItem @click="$emit('export-document', 'html')">
              <span class="menu-icon">🌐</span>
              HTML Page
            </MenubarItem>
            <MenubarItem @click="$emit('export-document', 'markdown')">
              <span class="menu-icon">📝</span>
              Markdown
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarItem @click="$emit('import-document')" class="menu-item">
          <span class="menu-icon">📥</span>
          Import Document
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Edit Menu -->
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="handleUndo" class="menu-item">
          <span class="menu-icon">↩️</span>
          Undo
          <MenubarShortcut>Ctrl+Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="handleRedo" class="menu-item">
          <span class="menu-icon">↪️</span>
          Redo
          <MenubarShortcut>Ctrl+Y</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="handleCut" class="menu-item">
          <span class="menu-icon">✂️</span>
          Cut
          <MenubarShortcut>Ctrl+X</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="handleCopy" class="menu-item">
          <span class="menu-icon">📋</span>
          Copy
          <MenubarShortcut>Ctrl+C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="handlePaste" class="menu-item">
          <span class="menu-icon">📄</span>
          Paste
          <MenubarShortcut>Ctrl+V</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="handleSelectAll" class="menu-item">
          <span class="menu-icon">📌</span>
          Select All
          <MenubarShortcut>Ctrl+A</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="handleFind" class="menu-item">
          <span class="menu-icon">🔍</span>
          Find & Replace
          <MenubarShortcut>Ctrl+F</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- View Menu -->
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="toggleSidebar" class="menu-item">
          <span class="menu-icon">📑</span>
          Toggle Sidebar
        </MenubarItem>
        <MenubarSeparator />
        <MenubarCheckboxItem v-model:checked="showToolbar">
          <span class="menu-icon">🛠️</span>
          Show Toolbar
        </MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="showStatusBar">
          <span class="menu-icon">📊</span>
          Show Status Bar
        </MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>
            <span class="menu-icon">🔍</span>
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
        <MenubarCheckboxItem v-model:checked="typewriterMode">
          <span class="menu-icon">⌨️</span>
          Typewriter Mode
        </MenubarCheckboxItem>
        <MenubarCheckboxItem v-model:checked="focusMode">
          <span class="menu-icon">🎯</span>
          Focus Mode
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Insert Menu -->
    <MenubarMenu>
      <MenubarTrigger>Insert</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="insertTable" class="menu-item">
          <span class="menu-icon">📊</span>
          Table
        </MenubarItem>
        <MenubarItem @click="insertImage" class="menu-item">
          <span class="menu-icon">🖼️</span>
          Image
        </MenubarItem>
        <MenubarItem @click="insertLink" class="menu-item">
          <span class="menu-icon">🔗</span>
          Link
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="insertCodeBlock" class="menu-item">
          <span class="menu-icon">💻</span>
          Code Block
        </MenubarItem>
        <MenubarItem @click="insertMath" class="menu-item">
          <span class="menu-icon">🧮</span>
          Math Formula
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="insertDate" class="menu-item">
          <span class="menu-icon">📅</span>
          Date & Time
        </MenubarItem>
        <MenubarItem @click="insertPageBreak" class="menu-item">
          <span class="menu-icon">📄</span>
          Page Break
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Format Menu -->
    <MenubarMenu>
      <MenubarTrigger>Format</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="toggleBold" class="menu-item">
          <span class="menu-icon">𝐁</span>
          Bold
          <MenubarShortcut>Ctrl+B</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="toggleItalic" class="menu-item">
          <span class="menu-icon">𝐼</span>
          Italic
          <MenubarShortcut>Ctrl+I</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="toggleUnderline" class="menu-item">
          <span class="menu-icon">U̲</span>
          Underline
          <MenubarShortcut>Ctrl+U</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>
            <span class="menu-icon">📝</span>
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
        <MenubarItem @click="toggleBulletList" class="menu-item">
          <span class="menu-icon">•</span>
          Bullet List
        </MenubarItem>
        <MenubarItem @click="toggleOrderedList" class="menu-item">
          <span class="menu-icon">1.</span>
          Numbered List
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Tools Menu -->
    <MenubarMenu>
      <MenubarTrigger>Tools</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="spellCheck" class="menu-item">
          <span class="menu-icon">📖</span>
          Spell Check
          <MenubarShortcut>F7</MenubarShortcut>
        </MenubarItem>
        <MenubarItem @click="wordCount" class="menu-item">
          <span class="menu-icon">🔢</span>
          Word Count
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="verifyAuthorship" class="menu-item">
          <span class="menu-icon">🔐</span>
          Verify Authorship
        </MenubarItem>
        <MenubarItem @click="generateProof" class="menu-item">
          <span class="menu-icon">📜</span>
          Generate Proof
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="$emit('settings')" class="menu-item">
          <span class="menu-icon">⚙️</span>
          Preferences
          <MenubarShortcut>Ctrl+,</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Help Menu -->
    <MenubarMenu>
      <MenubarTrigger>Help</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @click="showKeyboardShortcuts" class="menu-item">
          <span class="menu-icon">⌨️</span>
          Keyboard Shortcuts
        </MenubarItem>
        <MenubarItem @click="showDocumentation" class="menu-item">
          <span class="menu-icon">📚</span>
          Documentation
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem @click="$emit('about')" class="menu-item">
          <span class="menu-icon">ℹ️</span>
          About ChainPaper
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Document Title -->
    <div class="document-title-section">
      <div class="document-title">
        {{ documentTitle || 'Untitled Document' }}
        <span v-if="isDirty" class="dirty-indicator">•</span>
      </div>
      <div class="document-info">
        <span v-if="user.name" class="user-name">{{ user.name }}</span>
      </div>
    </div>

    <!-- User Menu -->
    <div class="user-section">
      <div class="user-avatar" :title="user.name || 'Anonymous'">
        {{ (user.name || 'A').charAt(0).toUpperCase() }}
      </div>
    </div>
  </Menubar>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
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
}>()

// View state
const showToolbar = ref(true)
const showStatusBar = ref(true)
const typewriterMode = ref(false)
const focusMode = ref(false)

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

<style scoped>
.menu-bar {
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3rem;
  flex-shrink: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-icon {
  font-size: 1rem;
  width: 1.25rem;
  text-align: center;
}

.document-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0 2rem;
  min-width: 0;
}

.document-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.dirty-indicator {
  color: #ef4444;
  font-size: 1.25rem;
  line-height: 1;
}

.document-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.user-name {
  font-weight: 500;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .menu-bar {
    background: #1f2937;
    border-bottom-color: #374151;
  }
  
  .document-title {
    color: #f9fafb;
  }
  
  .document-info {
    color: #9ca3af;
  }
  
  .menu-item:hover {
    background-color: #374151;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .document-title-section {
    margin: 0 1rem;
  }
  
  .document-title {
    font-size: 0.875rem;
  }
  
  .user-avatar {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}
</style>
