<template>
  <div class="app-container">
    <!-- Welcome Screen for New Users -->
    <WelcomeScreen 
      v-if="showWelcome"
      :recent-documents="documentStore.recentDocuments"
      :templates="documentStore.availableTemplates"
      @create-new="handleCreateNew"
      @open-document="handleOpenDocument"
      @use-template="handleUseTemplate"
      @close="showWelcome = false"
    />

    <!-- Main Editor Interface -->
    <div v-else class="editor-interface">
      <!-- Menu Bar -->
      <MenuBar
        :document-title="documentStore.metadata.title"
        :is-dirty="documentStore.isDirty"
        :user="documentStore.currentUser"
        @new-document="handleCreateNew"
        @open-document="handleOpenDocument"
        @save-document="handleSave"
        @export-document="handleExport"
        @import-document="handleImport"
        @settings="showSettings = true"
        @about="showAbout = true"
      />

      <!-- Editor Content -->
      <EditorContent 
        ref="editorContent"
        @document-change="handleDocumentChange"
      />

      <!-- Settings Dialog -->
      <DocumentSettingsDialog
        v-model:open="showSettings"
        :settings="documentStore.settings"
        :security="documentStore.security"
        @save="handleSaveSettings"
      />

      <!-- About Dialog -->
      <AboutDialog
        v-model:open="showAbout"
      />

      <!-- User Setup Dialog -->
      <UserSetupDialog
        v-model:open="showUserSetup"
        @save="handleUserSetup"
      />

      <!-- Loading Overlay -->
      <LoadingOverlay
        v-if="documentStore.isLoading"
        :message="loadingMessage"
      />

      <!-- Notifications -->
      <NotificationSystem ref="notifications" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDocumentStore } from '~/stores/document'
import { useEditorStore } from '~/stores/editor'
import EditorContent from '~/components/editor/EditorContent.vue'
import WelcomeScreen from '~/components/welcome/WelcomeScreen.vue'
import MenuBar from '~/components/layout/MenuBar.vue'
import DocumentSettingsDialog from '~/components/dialogs/DocumentSettingsDialog.vue'
import AboutDialog from '~/components/dialogs/AboutDialog.vue'
import UserSetupDialog from '~/components/dialogs/UserSetupDialog.vue'
import LoadingOverlay from '~/components/ui/LoadingOverlay.vue'
import NotificationSystem from '~/components/ui/NotificationSystem.vue'

// Stores
const documentStore = useDocumentStore()
const editorStore = useEditorStore()

// UI State
const showWelcome = ref(!documentStore.currentUser.name)
const showSettings = ref(false)
const showAbout = ref(false)
const showUserSetup = ref(false)

// Refs
const editorContent = ref()
const notifications = ref()

// Computed
const loadingMessage = computed(() => {
  if (documentStore.isExporting) return 'Exporting document...'
  if (documentStore.isImporting) return 'Importing document...'
  if (documentStore.isAutoSaving) return 'Auto-saving...'
  return 'Loading...'
})

// Lifecycle
onMounted(async () => {
  // Initialize the application
  await initializeApp()
})

// Methods
async function initializeApp() {
  try {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('chainpaper-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      documentStore.setCurrentUser(user)
      showWelcome.value = false
    } else {
      showUserSetup.value = true
    }

    // Load recent documents
    const savedRecents = localStorage.getItem('chainpaper-recent-documents')
    if (savedRecents) {
      documentStore.recentDocuments = JSON.parse(savedRecents)
    }

    // Load templates
    await loadDefaultTemplates()

    // Auto-save user data
    setInterval(() => {
      localStorage.setItem('chainpaper-user', JSON.stringify(documentStore.currentUser))
      localStorage.setItem('chainpaper-recent-documents', JSON.stringify(documentStore.recentDocuments))
    }, 10000) // Every 10 seconds

  } catch (error) {
    console.error('Failed to initialize app:', error)
    notifications.value?.showError('Failed to initialize application')
  }
}

async function loadDefaultTemplates() {
  // Load built-in templates
  const templates = [
    {
      id: 'blank',
      name: 'Blank Document',
      description: 'Start with a blank document',
      category: 'Basic',
      thumbnail: '',
      content: {
        type: 'doc' as const,
        content: [{ type: 'paragraph', content: [] }]
      },
      metadata: {
        id: 'blank-template',
        title: 'Blank Document',
        author: 'ChainPaper',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      settings: {
        pageSize: 'A4' as const,
        margins: { top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 },
        lineSpacing: 1.15,
        fontSize: 12,
        fontFamily: 'Arial',
        theme: 'light' as const,
        spellCheck: true,
        grammarCheck: true,
        autoSave: true,
        autoSaveInterval: 30000,
        showComments: true,
        showAuthorship: true,
        showLineNumbers: false,
        showWordCount: true,
        enableCollaboration: false,
        readingMode: false,
        focusMode: false,
        typewriterMode: false,
        language: 'en',
        rtlSupport: false
      },
      variables: []
    },
    {
      id: 'academic-paper',
      name: 'Academic Paper',
      description: 'Template for academic papers with proper formatting',
      category: 'Academic',
      thumbnail: '',
      content: {
        type: 'doc' as const,
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Paper Title' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Author Name' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Institution' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Abstract' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Abstract content...' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Introduction' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Introduction content...' }]
          }
        ]
      },
      metadata: {
        id: 'academic-paper-template',
        title: 'Academic Paper',
        author: 'ChainPaper',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      settings: {
        pageSize: 'A4' as const,
        margins: { top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 },
        lineSpacing: 2.0,
        fontSize: 12,
        fontFamily: 'Times New Roman',
        theme: 'light' as const,
        spellCheck: true,
        grammarCheck: true,
        autoSave: true,
        autoSaveInterval: 30000,
        showComments: true,
        showAuthorship: true,
        showLineNumbers: false,
        showWordCount: true,
        enableCollaboration: false,
        readingMode: false,
        focusMode: false,
        typewriterMode: false,
        language: 'en',
        rtlSupport: false
      },
      variables: []
    },
    {
      id: 'business-letter',
      name: 'Business Letter',
      description: 'Professional business letter template',
      category: 'Business',
      thumbnail: '',
      content: {
        type: 'doc' as const,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Your Name]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Your Address]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[City, State ZIP Code]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Date]' }]
          },
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Recipient Name]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Title]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Company]' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Address]' }]
          },
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Dear [Recipient Name],' }]
          },
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Letter content...]' }]
          },
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Sincerely,' }]
          },
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '[Your Name]' }]
          }
        ]
      },
      metadata: {
        id: 'business-letter-template',
        title: 'Business Letter',
        author: 'ChainPaper',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      settings: {
        pageSize: 'A4' as const,
        margins: { top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 },
        lineSpacing: 1.15,
        fontSize: 11,
        fontFamily: 'Arial',
        theme: 'light' as const,
        spellCheck: true,
        grammarCheck: true,
        autoSave: true,
        autoSaveInterval: 30000,
        showComments: true,
        showAuthorship: true,
        showLineNumbers: false,
        showWordCount: true,
        enableCollaboration: false,
        readingMode: false,
        focusMode: false,
        typewriterMode: false,
        language: 'en',
        rtlSupport: false
      },
      variables: []
    }
  ]

  documentStore.availableTemplates = templates
}

function handleCreateNew(title?: string, template?: any) {
  documentStore.createNewDocument(title, documentStore.currentUser.name, template)
  showWelcome.value = false
  notifications.value?.showSuccess('New document created')
}

async function handleOpenDocument(file?: File) {
  try {
    if (file) {
      await documentStore.importDocument(file)
      showWelcome.value = false
      notifications.value?.showSuccess('Document opened successfully')
    } else {
      // Show file picker
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,.docx,.html,.txt'
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          await handleOpenDocument(file)
        }
      }
      input.click()
    }
  } catch (error) {
    console.error('Failed to open document:', error)
    notifications.value?.showError('Failed to open document')
  }
}

function handleUseTemplate(template: any) {
  documentStore.loadTemplate(template)
  showWelcome.value = false
  notifications.value?.showSuccess(`Template "${template.name}" loaded`)
}

async function handleSave() {
  try {
    await documentStore.saveDocument()
    notifications.value?.showSuccess('Document saved successfully')
  } catch (error) {
    console.error('Failed to save document:', error)
    notifications.value?.showError('Failed to save document')
  }
}

async function handleExport(format?: string, options?: any) {
  try {
    if (format) {
      await documentStore.exportDocument(format, options)
      notifications.value?.showSuccess(`Document exported as ${format.toUpperCase()}`)
    } else {
      // Show export dialog
      editorContent.value?.showExportDialog()
    }
  } catch (error) {
    console.error('Failed to export document:', error)
    notifications.value?.showError('Failed to export document')
  }
}

async function handleImport(file?: File) {
  try {
    if (file) {
      await documentStore.importDocument(file)
      notifications.value?.showSuccess('Document imported successfully')
    } else {
      // Show file picker
      handleOpenDocument()
    }
  } catch (error) {
    console.error('Failed to import document:', error)
    notifications.value?.showError('Failed to import document')
  }
}

function handleDocumentChange() {
  // Document content changed
  documentStore.updateDocumentStatistics()
}

function handleSaveSettings(settings: any, security?: any) {
  if (settings) {
    documentStore.updateSettings(settings)
  }
  if (security) {
    documentStore.security = { ...documentStore.security, ...security }
  }
  showSettings.value = false
  notifications.value?.showSuccess('Settings saved')
}

function handleUserSetup(userData: any) {
  documentStore.setCurrentUser(userData)
  showUserSetup.value = false
  showWelcome.value = false
  notifications.value?.showSuccess('User profile created')
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          handleSave()
          break
        case 'n':
          e.preventDefault()
          handleCreateNew()
          break
        case 'o':
          e.preventDefault()
          handleOpenDocument()
          break
        case ',':
          e.preventDefault()
          showSettings.value = true
          break
      }
    }
  }

  document.addEventListener('keydown', handleKeyboard)
  
  return () => {
    document.removeEventListener('keydown', handleKeyboard)
  }
})
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.editor-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Global styles for the application */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:global(.ProseMirror) {
  outline: none;
  min-height: 500px;
  padding: 1rem;
  line-height: 1.6;
}

:global(.ProseMirror p) {
  margin: 0.5rem 0;
}

:global(.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6) {
  margin: 1rem 0 0.5rem 0;
  font-weight: bold;
}

:global(.ProseMirror h1) {
  font-size: 2rem;
}

:global(.ProseMirror h2) {
  font-size: 1.5rem;
}

:global(.ProseMirror h3) {
  font-size: 1.25rem;
}

:global(.ProseMirror ul, .ProseMirror ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

:global(.ProseMirror li) {
  margin: 0.25rem 0;
}

:global(.ProseMirror blockquote) {
  border-left: 4px solid #ddd;
  margin: 1rem 0;
  padding-left: 1rem;
  color: #666;
}

:global(.ProseMirror code) {
  background: #f4f4f4;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

:global(.ProseMirror pre) {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

:global(.ProseMirror table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

:global(.ProseMirror th, .ProseMirror td) {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

:global(.ProseMirror th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

:global(.ProseMirror a) {
  color: #0066cc;
  text-decoration: underline;
}

:global(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  margin: 0.5rem 0;
}

/* Comment highlighting */
:global(.comment-highlight) {
  background-color: rgba(255, 255, 0, 0.3);
  border-radius: 2px;
  padding: 0 2px;
}

/* Spell check errors */
:global(.spell-error) {
  border-bottom: 2px wavy red;
}

/* Selection in comment mode */
:global(.comment-mode-selection) {
  background-color: rgba(59, 130, 246, 0.3);
}
</style>