<template>
  <Dialog :open="props.open" @update:open="onUpdateOpen">
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
                <!-- Export Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            :class="[
              'h-24 flex flex-col items-center gap-2 p-4 transition-all',
              exportFormat === 'markdown' 
                ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                : 'hover:ring-1 hover:ring-gray-300'
            ]" 
            @click="exportAsMarkdown">
            <FileText class="w-8 h-8 text-blue-600" />
            <div class="text-center">
              <div class="font-medium">Markdown</div>
              <div class="text-xs text-gray-600">.md file</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            :class="[
              'h-24 flex flex-col items-center gap-2 p-4 transition-all',
              exportFormat === 'html' 
                ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50' 
                : 'hover:ring-1 hover:ring-gray-300'
            ]" 
            @click="exportAsHTML">
            <Globe class="w-8 h-8 text-orange-600" />
            <div class="text-center">
              <div class="font-medium">HTML</div>
              <div class="text-xs text-gray-600">.html file</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            :class="[
              'h-24 flex flex-col items-center gap-2 p-4 transition-all',
              exportFormat === 'json' 
                ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' 
                : 'hover:ring-1 hover:ring-gray-300'
            ]" 
            @click="exportAsJSON">
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
              <Checkbox id="include-proof" v-model:checked="includeProof" />
              <Label for="include-proof">Include cryptographic proof (if available)</Label>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" class="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-600">
          {{ statusMessage }}
        </div>
      </div>

      <DialogFooter class="w-full">
        <div class="flex w-full gap-3">
          <Button variant="outline" @click="close" class="flex-1">
            Cancel
          </Button>
          <Button @click="performExport" :disabled="!exportFormat" class="flex-1">
            <Download class="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Label } from '@/components/ui/label'
  import {
    Download,
    FileText,
    Globe,
    FileDown
  } from 'lucide-vue-next'
  import { useMarkdownDocStore } from '@/stores/markdownDoc'
  import { toast } from 'vue-sonner'

  interface Props {
    open: boolean
    initialFormat?: 'markdown' | 'html' | 'json' | 'pdf' | null
  }

  const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

  const store = useMarkdownDocStore()

  // Props-driven state
  const props = defineProps<Props>()
  // State
  const exportFormat = ref<'markdown' | 'html' | 'json' | null>(null)
  const includeProof = ref(true)
  const statusMessage = ref('')

  // Computed
  const filename = computed(() => {
    const base = store.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'
    const timestamp = new Date().toISOString().slice(0, 10)
    return `${base}_${timestamp}`
  })

  // Methods
  const onUpdateOpen = (v: boolean) => emit('update:open', v)
  const close = () => emit('update:open', false)
  function exportAsMarkdown() { exportFormat.value = 'markdown' }

  function exportAsHTML() { exportFormat.value = 'html' }

  function exportAsJSON() { exportFormat.value = 'json' }

  // react to prop initialFormat when dialog opens
  if (props.initialFormat) {
    // map pdf -> html fallback
    if (props.initialFormat === 'pdf') exportFormat.value = 'html'
    else if (props.initialFormat === 'markdown') exportFormat.value = 'markdown'
    else if (props.initialFormat === 'html') exportFormat.value = 'html'
    else if (props.initialFormat === 'json') exportFormat.value = 'json'
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
          // Always include metadata
          const metadata = `---
title: ${store.title}
date: ${new Date().toISOString()}
---

`
          content = metadata + store.content
          
          // Attach proof only if user enabled it and proof exists
          if (includeProof.value) {
            try {
              const stored = localStorage.getItem('chainpaper_current_proof')
              if (stored) {
                const proofObj = JSON.parse(stored)
                content = content + `\n\n<!-- Cryptographic Proof: ${JSON.stringify(proofObj)} -->\n`
              } else {
                content = content + `\n\n<!-- No cryptographic proof available. Generate one via Tools > Verify Authorship -->\n`
              }
            } catch (_e) {
              // ignore
            }
          }
          mimeType = 'text/markdown'
          extension = '.md'
          break

        case 'html':
          content = convertMarkdownToHTML(store.content)
          
          // Attach proof only if user enabled it and proof exists
          if (includeProof.value) {
            try {
              const stored = localStorage.getItem('chainpaper_current_proof')
              if (stored) {
                const proofObj = JSON.parse(stored)
                // Append proof metadata as a JSON script block
                content = content + "\n<script type=\"application/json\" id=\"chainpaper-proof\">" + JSON.stringify(proofObj) + "</scr" + "ipt>"
              } else {
                content = content + "\n<!-- No cryptographic proof available -->"
              }
            } catch (_e) {
              // ignore
            }
          }
          
          // Always wrap in full HTML document
          content = wrapInHTMLDocument(content)
          mimeType = 'text/html'
          extension = '.html'
          break

        case 'json':
          const exportData = await store.exportJSON()
          const obj = exportData.obj
          
          // Attach proof only if user enabled it and proof exists
          if (includeProof.value) {
            try {
              const stored = localStorage.getItem('chainpaper_current_proof')
              if (stored) {
                const proofObj = JSON.parse(stored)
                ;(obj as any).proof = proofObj
              } else {
                ;(obj as any).proofNote = 'No cryptographic proof available. Generate one via Tools > Verify Authorship'
              }
            } catch (_e) {
              // ignore
            }
          }
          
          content = JSON.stringify(obj, null, 2)
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
      // show a sonner toast on successful export
      toast.success('Export complete', {
        description: `Exported ${filename.value}${extension} (${exportFormat.value.toUpperCase()})`
      })

      setTimeout(() => {
        statusMessage.value = ''
      }, 3000)

    } catch (error: any) {
      statusMessage.value = `Export failed: ${error.message}`
      toast.error('Export failed', { description: error.message })
    }
  }
</script>
