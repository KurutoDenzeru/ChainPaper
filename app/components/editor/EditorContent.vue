<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Main Editor Layout -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Toolbar -->
        <EditorToolbar 
          @toggle-sidebar="toggleSidebar"
          @toggle-find="toggleFindReplace"
        />

        <!-- Document Pages Container -->
        <div :class="[
          'flex-1 overflow-auto p-2 sm:p-4 lg:p-8 bg-gray-100 pb-16',
          {
            'pt-[50vh] pb-[50vh]': editorSettings.typewriterMode,
          }
        ]">
          <div class="flex flex-col items-center gap-8">
            <div :class="[
              'w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg rounded border transition-all duration-300',
              {
                'shadow-2xl': editorSettings.focusMode
              }
            ]" :style="pageStyles">
              <!-- ProseMirror Editor -->
              <div
                ref="editorRef"
                class="p-4 sm:p-6 lg:p-[25.4mm] min-h-[246.2mm] leading-relaxed focus:outline-none editor-container"
                :style="{ fontSize: editorSettings.fontSize + 'px' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="fixed bottom-0 left-0 right-0 flex items-center px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-600 shadow-lg z-20">
          <!-- Left Section: Page and Word Count -->
          <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div class="flex items-center whitespace-nowrap">
              Page {{ currentPage }} of {{ documentStats.pageCount }}
            </div>
            <div class="text-gray-400">|</div>
            <div class="flex items-center whitespace-nowrap">
              {{ documentStats.wordCount }} words
            </div>
            <div class="text-gray-400">|</div>
            <div class="flex items-center whitespace-nowrap">
              {{ documentStats.characterCount }} characters
            </div>
          </div>
          
          <!-- Center Section: Auto-saving -->
          <div class="flex-shrink-0 mx-2">
            <div v-if="documentStore.isAutoSaving" class="flex items-center text-blue-600 text-xs">
              Auto-saving...
            </div>
          </div>
          
          <!-- Right Section: Zoom Controls -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" @click="adjustZoom(-10)" class="h-6 w-6 p-0">
              <Minus class="w-3 h-3" />
            </Button>
            <span class="min-w-10 text-center font-medium text-gray-900 text-xs">{{ Math.round(editorSettings.zoom * 100) }}%</span>
            <Button variant="ghost" size="sm" @click="adjustZoom(10)" class="h-6 w-6 p-0">
              <Plus class="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Find/Replace Bar -->
    <div v-if="showFindReplace" class="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 shadow-sm">
      <div class="flex items-center gap-3 max-w-4xl mx-auto">
        <Input
          v-model="findText"
          placeholder="Find..."
          class="flex-1 max-w-48"
          @keyup.enter="findNext"
          @keyup.escape="closeFindReplace"
        />
        <Input
          v-model="replaceText"
          placeholder="Replace..."
          class="flex-1 max-w-48"
          @keyup.enter="replaceNext"
        />
        <div class="flex items-center gap-2">
          <Button size="sm" @click="findNext" variant="outline">Find Next</Button>
          <Button size="sm" @click="findPrevious" variant="outline">Find Previous</Button>
          <Button size="sm" @click="replaceNext" variant="outline">Replace</Button>
          <Button size="sm" @click="replaceAll" variant="outline">Replace All</Button>
          <Button size="sm" variant="ghost" @click="closeFindReplace" class="h-8 w-8 p-0">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { history, undo, redo } from 'prosemirror-history'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { Minus, Plus, X } from 'lucide-vue-next'
import { useDocumentStore } from '~/stores/document'
import { useEditorStore } from '~/stores/editor'
import EditorToolbar from './EditorToolbar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Stores
const documentStore = useDocumentStore()
const editorStore = useEditorStore()

// Refs
const editorRef = ref<HTMLElement>()
const proseMirrorView = ref<EditorView>()
const isInitialized = ref(false)

// UI State
const showFindReplace = ref(false)

// Find/Replace
const findText = ref('')
const replaceText = ref('')

// Settings
const editorSettings = ref({
  zoom: 1,
  fontSize: 14,
  typewriterMode: false,
  focusMode: false,
  theme: 'light'
})

// Computed
const documentStats = computed(() => documentStore.statistics)
const currentPage = computed(() => {
  return Math.ceil((editorStore.selection?.from || 0) / 500) + 1
})

const pageStyles = computed(() => ({
  transform: `scale(${editorSettings.value.zoom})`,
  transformOrigin: 'top center'
}))

// Lifecycle
onMounted(() => {
  // Use nextTick to ensure the DOM is ready
  nextTick(() => {
    initializeProseMirror()
    setupEventListeners()
  })
})

onBeforeUnmount(() => {
  if (proseMirrorView.value) {
    proseMirrorView.value.destroy()
    proseMirrorView.value = undefined
  }
  isInitialized.value = false
  removeEventListeners()
})

// Methods
function initializeProseMirror() {
  if (!editorRef.value || isInitialized.value) {
    console.log('Editor already initialized or ref not available')
    return
  }

  console.log('Initializing ProseMirror...', editorRef.value)

  try {
    // Clear the editor container completely
    editorRef.value.innerHTML = ''

    // Create a simple schema - no lists for now to avoid complexity
    const mySchema = new Schema({
      nodes: schema.spec.nodes,
      marks: schema.spec.marks
    })

    // Create plugins array - NO exampleSetup to avoid menubar
    const plugins = [
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
        ...baseKeymap
      }),
      dropCursor(),
      gapCursor()
    ]

    // Create initial state
    const state = EditorState.create({
      schema: mySchema,
      plugins
    })

    // Create editor view
    proseMirrorView.value = new EditorView(editorRef.value, {
      state,
      editable: () => true,
      attributes: {
        class: 'ProseMirror',
        spellcheck: 'true',
        'data-placeholder': 'Start writing your document...'
      }
    })

    // Set up proper transaction handling
    const originalDispatch = proseMirrorView.value.dispatch.bind(proseMirrorView.value)
    proseMirrorView.value.dispatch = (tr) => {
      try {
        originalDispatch(tr)
        
        if (tr.docChanged) {
          console.log('Document content changed')
          emit('document-change')
        }
      } catch (error) {
        console.error('Dispatch error:', error)
      }
    }

    isInitialized.value = true
    console.log('ProseMirror view created successfully')

    // Focus the editor
    setTimeout(() => {
      if (proseMirrorView.value) {
        proseMirrorView.value.focus()
        console.log('Editor focused and ready for input')
      }
    }, 100)

  } catch (error) {
    console.error('Error initializing ProseMirror:', error)
  }
}

function setupEventListeners() {
  // Set up keyboard shortcuts
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'f':
          e.preventDefault()
          toggleFindReplace()
          break
        case 'h':
          e.preventDefault()
          toggleFindReplace()
          break
      }
    }
    
    if (e.key === 'Escape') {
      closeFindReplace()
    }
  }

  document.addEventListener('keydown', handleKeyboard)

  // Listen for custom events from menu bar
  window.addEventListener('editor:find', toggleFindReplace)
  window.addEventListener('editor:toggle-sidebar', toggleSidebar)
  window.addEventListener('editor:zoom', handleZoomEvent)
}

function removeEventListeners() {
  // Remove event listeners
  window.removeEventListener('editor:find', toggleFindReplace)
  window.removeEventListener('editor:toggle-sidebar', toggleSidebar)
  window.removeEventListener('editor:zoom', handleZoomEvent)
}

function toggleSidebar() {
  emit('toggle-sidebar')
}

function toggleFindReplace() {
  showFindReplace.value = !showFindReplace.value
  if (showFindReplace.value) {
    // Focus find input
    setTimeout(() => {
      const findInput = document.querySelector('.find-input input') as HTMLInputElement
      findInput?.focus()
    }, 100)
  }
}

function closeFindReplace() {
  showFindReplace.value = false
  findText.value = ''
  replaceText.value = ''
}

function findNext() {
  if (findText.value) {
    editorStore.findNext(findText.value)
  }
}

function findPrevious() {
  if (findText.value) {
    editorStore.findPrevious(findText.value)
  }
}

function replaceNext() {
  if (findText.value && replaceText.value) {
    editorStore.replaceNext(findText.value, replaceText.value)
  }
}

function replaceAll() {
  if (findText.value && replaceText.value) {
    editorStore.replaceAll(replaceText.value)
  }
}

function adjustZoom(delta: number) {
  const newZoom = Math.max(0.25, Math.min(3, editorSettings.value.zoom + (delta / 100)))
  editorSettings.value.zoom = newZoom
}

function handleZoomEvent(e: Event) {
  const customEvent = e as CustomEvent
  editorSettings.value.zoom = customEvent.detail
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Expose methods to parent
defineExpose({
  showExportDialog: () => {
    // This would be implemented to show export dialog
    console.log('Show export dialog')
  }
})

// Events
const emit = defineEmits<{
  'document-change': []
  'toggle-sidebar': []
}>()
</script>

<style>
/* Editor container */
.editor-container {
  position: relative;
  background: white;
  border-radius: 0;
}

/* ProseMirror editor styles */
.ProseMirror {
  position: relative;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0;
  min-height: 200px;
  width: 100%;
  line-height: 1.6;
}

.ProseMirror p {
  margin: 1em 0;
  line-height: 1.6;
}

.ProseMirror p:first-child {
  margin-top: 0;
}

.ProseMirror p:last-child {
  margin-bottom: 0;
}

.ProseMirror h1,
.ProseMirror h2,
.ProseMirror h3,
.ProseMirror h4,
.ProseMirror h5,
.ProseMirror h6 {
  margin: 1.5em 0 0.5em;
  font-weight: bold;
  line-height: 1.4;
}

.ProseMirror h1 { font-size: 2em; }
.ProseMirror h2 { font-size: 1.5em; }
.ProseMirror h3 { font-size: 1.25em; }

.ProseMirror ul,
.ProseMirror ol {
  margin: 1em 0;
  padding-left: 2em;
}

.ProseMirror li {
  margin: 0.5em 0;
}

.ProseMirror strong {
  font-weight: bold;
}

.ProseMirror em {
  font-style: italic;
}

.ProseMirror u {
  text-decoration: underline;
}

.ProseMirror blockquote {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding-left: 1em;
  font-style: italic;
}

.ProseMirror:focus {
  outline: none;
}

/* Selection styling */
.ProseMirror ::selection {
  background: rgba(59, 130, 246, 0.15);
}

.ProseMirror ::-moz-selection {
  background: rgba(59, 130, 246, 0.15);
}

/* Placeholder when editor is empty */
.ProseMirror:empty::before,
.ProseMirror[data-placeholder]:empty::before {
  content: attr(data-placeholder);
  position: absolute;
  color: #9ca3af;
  pointer-events: none;
  font-style: italic;
  z-index: 1;
}

.ProseMirror p.is-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

/* Completely hide any ProseMirror menubar components */
.ProseMirror-menubar-wrapper,
.ProseMirror-menubar,
.ProseMirror-menuitem,
.ProseMirror-menu-dropdown,
.ProseMirror-menuseparator,
.ProseMirror-icon {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  z-index: -9999 !important;
}

/* Ensure the actual editor content is visible and editable */
.ProseMirror[contenteditable="true"] {
  position: relative;
  z-index: 1;
  width: 100%;
  height: auto;
  min-height: 200px;
  background: transparent;
  cursor: text;
}

/* Make sure the editor container is properly set up */
.editor-container {
  position: relative;
  z-index: 1;
}

.editor-container .ProseMirror {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* Add some spacing for better readability */
.ProseMirror br {
  content: "";
  display: block;
  margin: 0;
}

/* Make sure links are styled properly */
.ProseMirror a {
  color: #3b82f6;
  text-decoration: underline;
}

.ProseMirror a:hover {
  color: #1d4ed8;
}
</style>
