<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Download class="w-5 h-5 text-green-600" />
          Export Markdown Document
        </DialogTitle>
        <DialogDescription>
          Export your markdown document in various formats.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Export Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            class="h-24 flex flex-col items-center gap-2 p-4"
            @click="exportAsMarkdown"
          >
            <FileText class="w-8 h-8 text-blue-600" />
            <div class="text-center">
              <div class="font-medium">Markdown</div>
              <div class="text-xs text-gray-600">.md file</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            class="h-24 flex flex-col items-center gap-2 p-4"
            @click="exportAsHTML"
          >
            <Globe class="w-8 h-8 text-orange-600" />
            <div class="text-center">
              <div class="font-medium">HTML</div>
              <div class="text-xs text-gray-600">.html file</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            class="h-24 flex flex-col items-center gap-2 p-4"
            @click="exportAsJSON"
          >
            <FileDown class="w-8 h-8 text-purple-600" />
            <div class="text-center">
              <div class="font-medium">JSON</div>
              <div class="text-xs text-gray-600">.json file</div>
            </div>
          </Button>
        </div>

        <!-- Export Settings -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900">Export Settings</h4>
          
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox id="include-metadata" v-model:checked="includeMetadata" />
              <Label for="include-metadata">Include metadata (title, timestamp)</Label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox id="include-proof" v-model:checked="includeProof" />
              <Label for="include-proof">Include cryptographic proof (if available)</Label>
            </div>

            <div v-if="exportFormat === 'html'" class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox id="standalone-html" v-model:checked="standaloneHTML" />
                <Label for="standalone-html">Standalone HTML (include CSS)</Label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox id="syntax-highlight" v-model:checked="syntaxHighlight" />
                <Label for="syntax-highlight">Syntax highlighting for code blocks</Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="previewContent" class="space-y-2">
          <h4 class="font-semibold text-gray-900">Preview</h4>
          <Textarea 
            :model-value="previewContent" 
            readonly 
            rows="8" 
            class="font-mono text-xs bg-gray-50"
          />
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" class="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-600">
          {{ statusMessage }}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="performExport" :disabled="!exportFormat">
          <Download class="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  Download, 
  FileText, 
  Globe, 
  FileDown 
} from 'lucide-vue-next'
import { useMarkdownDocStore } from '@/stores/markdownDoc'

interface Props {
  open: boolean
  initialFormat?: 'markdown' | 'html' | 'json' | 'pdf' | null
}

defineEmits<{
  'update:open': [value: boolean]
}>()

const store = useMarkdownDocStore()

// Props-driven state
const props = defineProps<Props>()
// State
const exportFormat = ref<'markdown' | 'html' | 'json' | null>(null)
const includeMetadata = ref(true)
const includeProof = ref(false)
const standaloneHTML = ref(true)
const syntaxHighlight = ref(true)
const previewContent = ref('')
const statusMessage = ref('')

// Computed
const filename = computed(() => {
  const base = store.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'
  const timestamp = new Date().toISOString().slice(0, 10)
  return `${base}_${timestamp}`
})

// Methods
function exportAsMarkdown() {
  exportFormat.value = 'markdown'
  generatePreview()
}

function exportAsHTML() {
  exportFormat.value = 'html'
  generatePreview()
}

function exportAsJSON() {
  exportFormat.value = 'json'
  generatePreview()
}

// react to prop initialFormat when dialog opens
if (props.initialFormat) {
  // map pdf -> html fallback
  if (props.initialFormat === 'pdf') exportFormat.value = 'html'
  else if (props.initialFormat === 'markdown') exportFormat.value = 'markdown'
  else if (props.initialFormat === 'html') exportFormat.value = 'html'
  else if (props.initialFormat === 'json') exportFormat.value = 'json'
  // generate preview immediately
  generatePreview()
}

function generatePreview() {
  if (!exportFormat.value) return

  let content = ''

  switch (exportFormat.value) {
    case 'markdown':
      content = store.content
      if (includeMetadata.value) {
        const metadata = `---
title: ${store.title}
date: ${new Date().toISOString()}
---

`
        content = metadata + content
      }
      break

    case 'html':
      content = convertMarkdownToHTML(store.content)
      if (standaloneHTML.value) {
        content = wrapInHTMLDocument(content)
      }
      break

    case 'json':
      const jsonData: any = {
        title: store.title,
        content: store.content
      }
      
      if (includeMetadata.value) {
        jsonData.metadata = {
          exportedAt: new Date().toISOString(),
          version: 'chainpaper-md-1',
          wordCount: store.content.trim().split(/\s+/).length,
          characterCount: store.content.length
        }
      }
      
      content = JSON.stringify(jsonData, null, 2)
      break
  }

  previewContent.value = content.slice(0, 1000) + (content.length > 1000 ? '\n...' : '')
}

function convertMarkdownToHTML(markdown: string): string {
  // Simple markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n/gim, '<br>')

  return html
}

function wrapInHTMLDocument(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${store.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
        a { color: #0066cc; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`
}

async function performExport() {
  if (!exportFormat.value) return

  statusMessage.value = 'Preparing export...'

  try {
    let content = ''
    let mimeType = 'text/plain'
    let extension = '.txt'

    switch (exportFormat.value) {
      case 'markdown':
        content = store.content
        if (includeMetadata.value) {
          const metadata = `---
title: ${store.title}
date: ${new Date().toISOString()}
---

`
          content = metadata + content
        }
        mimeType = 'text/markdown'
        extension = '.md'
        break

      case 'html':
        content = convertMarkdownToHTML(store.content)
        if (standaloneHTML.value) {
          content = wrapInHTMLDocument(content)
        }
        mimeType = 'text/html'
        extension = '.html'
        break

      case 'json':
        const exportData = await store.exportJSON()
        content = JSON.stringify(exportData.obj, null, 2)
        mimeType = 'application/json'
        extension = '.json'
        break
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.value + extension
    link.click()
    URL.revokeObjectURL(url)

    statusMessage.value = `Successfully exported as ${exportFormat.value.toUpperCase()}`
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)

  } catch (error: any) {
    statusMessage.value = `Export failed: ${error.message}`
  }
}
</script>
