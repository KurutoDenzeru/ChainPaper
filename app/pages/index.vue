<template>
  <div class="w-screen h-screen overflow-hidden">
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
    <div v-else class="flex flex-col h-screen">
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
        @toggle-sidebar="showSidebar = !showSidebar"
      />

      <!-- Document Sidebar -->
      <DocumentSidebar
        :is-visible="showSidebar"
        :document-index="documentStore.documentIndex"
        :comments="documentStore.comments"
        :document-metadata="documentStore.metadata"
        :authorship-proof="documentStore.authorshipProof"
        @close="showSidebar = false"
        @navigate-to-heading="handleTOCNavigation"
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
        :is-visible="documentStore.isLoading"
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
import DocumentSidebar from '~/components/editor/DocumentSidebar.vue'
import WelcomeScreen from '~/components/welcome/WelcomeScreen.vue'
import MenuBar from '~/components/layout/MenuBar.vue'
import DocumentSettingsDialog from '~/components/dialogs/DocumentSettingsDialog.vue'
import AboutDialog from '~/components/dialogs/AboutDialog.vue'
import UserSetupDialog from '~/components/dialogs/UserSetupDialog.vue'
import LoadingOverlay from '~/components/ui/LoadingOverlay'
import NotificationSystem from '~/components/ui/NotificationSystem'

// Stores
const documentStore = useDocumentStore()
const editorStore = useEditorStore()

// UI State
const showWelcome = ref(!documentStore.currentDocument || !documentStore.currentUser.name)
const showSettings = ref(false)
const showAbout = ref(false)
const showUserSetup = ref(false)
const showSidebar = ref(false)

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
  if (!title && !template) {
    // Show welcome screen to choose template or create blank
    showWelcome.value = true
    return
  }
  
  documentStore.createNewDocument(title || 'Untitled Document', documentStore.currentUser.name, template)
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

function handleTOCNavigation(entry: any) {
  // Navigate to the TOC entry in the editor
  // This would typically scroll to the heading or set cursor position
  console.log('Navigate to TOC entry:', entry)
  // TODO: Implement actual navigation logic
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