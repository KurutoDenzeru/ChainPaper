<template>
  <Dialog :open="props.open" @update:open="onUpdateOpen">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Download class="w-5 h-5 text-primary" />
          Export Markdown Document
        </DialogTitle>
        <DialogDescription>
          Export your markdown document in various formats.
        </DialogDescription>
      </DialogHeader>


      <div class="space-y-6">
        <!-- Export Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" :class="[
            'h-24 flex flex-col items-center justify-center gap-2 transition-all duration-200 ease-in-out border-border',
            exportFormat === 'markdown'
              ? 'bg-primary/5 border-primary text-primary ring-1 ring-primary'
              : 'hover:bg-accent/50 hover:border-border/80 text-muted-foreground'
          ]" @click="exportAsMarkdown">
            <FileText class="w-6 h-6 mb-1 transition-transform" :class="exportFormat === 'markdown' ? 'scale-110' : ''" />
            <div class="text-center">
              <div class="font-medium text-sm text-foreground">Markdown</div>
              <div class="text-[10px] uppercase tracking-wider opacity-70">.md</div>
            </div>
          </Button>

          <Button variant="outline" :class="[
            'h-24 flex flex-col items-center justify-center gap-2 transition-all duration-200 ease-in-out border-border',
            exportFormat === 'html'
              ? 'bg-primary/5 border-primary text-primary ring-1 ring-primary'
              : 'hover:bg-accent/50 hover:border-border/80 text-muted-foreground'
          ]" @click="exportAsHTML">
            <Globe class="w-6 h-6 mb-1 transition-transform" :class="exportFormat === 'html' ? 'scale-110' : ''" />
            <div class="text-center">
              <div class="font-medium text-sm text-foreground">HTML</div>
              <div class="text-[10px] uppercase tracking-wider opacity-70">.html</div>
            </div>
          </Button>

          <Button variant="outline" :class="[
            'h-24 flex flex-col items-center justify-center gap-2 transition-all duration-200 ease-in-out border-border',
            exportFormat === 'json'
              ? 'bg-primary/5 border-primary text-primary ring-1 ring-primary'
              : 'hover:bg-accent/50 hover:border-border/80 text-muted-foreground'
          ]" @click="exportAsJSON">
            <FileDown class="w-6 h-6 mb-1 transition-transform" :class="exportFormat === 'json' ? 'scale-110' : ''" />
            <div class="text-center">
              <div class="font-medium text-sm text-foreground">JSON</div>
              <div class="text-[10px] uppercase tracking-wider opacity-70">.json</div>
            </div>
          </Button>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage"
          class="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary text-center animate-in fade-in zoom-in-95 duration-200">
          {{ statusMessage }}
        </div>
      </div>

      <DialogFooter>
        <div class="flex w-full gap-2 pt-2 border-t border-border">
          <Button class="flex-1" variant="outline" @click="close">
            Cancel
          </Button>
          <Button @click="performExport" :disabled="!exportFormat"
            class="flex-1 bg-primary hover:bg-primary/90 text-white hover:text-white border-none dark:bg-primary dark:hover:bg-primary">
            <Download class="w-4 h-4 mr-2 text-white" />
            Export
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
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
 code { background: var(--muted, #f4f4f4); color: var(--muted-foreground, #111827); padding: 0.2em 0.4em; border-radius: 3px; }
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

          // Attach proof if available
          try {
            const stored = localStorage.getItem('chainpaper_current_proof')
            if (stored) {
              const proofObj = JSON.parse(stored)
              content = content + `\n\n<!-- Cryptographic Proof: ${JSON.stringify(proofObj)} -->\n`
            } else {
              content = content + `\n\n<!-- No cryptographic proof available. Generate one via Tools> Verify Authorship -->\n`
            }
          } catch (_e) {
            // ignore
          }
          mimeType = 'text/markdown'
          extension = '.md'
          break

        case 'html':
          content = convertMarkdownToHTML(store.content)

          // Attach proof if available
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

          // Always wrap in full HTML document
          content = wrapInHTMLDocument(content)
          mimeType = 'text/html'
          extension = '.html'
          break

        case 'json':
          const exportData = await store.exportJSON()
          const obj = exportData.obj

          // Attach proof if available
          try {
            const stored = localStorage.getItem('chainpaper_current_proof')
            if (stored) {
              const proofObj = JSON.parse(stored)
                ; (obj as any).proof = proofObj
            } else {
              ; (obj as any).proofNote = 'No cryptographic proof available. Generate one via Tools> Verify Authorship'
            }
          } catch (_e) {
            // ignore
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
