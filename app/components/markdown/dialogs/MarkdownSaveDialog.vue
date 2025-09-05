<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Save class="w-5 h-5 text-blue-600" />
          Save Markdown Document
        </DialogTitle>
        <DialogDescription>
          Save your markdown document to local storage or export as file.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Save Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" class="h-24 flex flex-col items-center gap-2 p-4" @click="saveToLocal">
            <HardDrive class="w-8 h-8 text-blue-600" />
            <div class="text-center">
              <div class="font-medium">Local Storage</div>
              <div class="text-xs text-gray-600">Browser storage</div>
            </div>
          </Button>

          <Button variant="outline" class="h-24 flex flex-col items-center gap-2 p-4" @click="downloadFile">
            <Download class="w-8 h-8 text-green-600" />
            <div class="text-center">
              <div class="font-medium">Download File</div>
              <div class="text-xs text-gray-600">.md file</div>
            </div>
          </Button>
        </div>

        <!-- Save Settings -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900">Save Options</h4>

          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox id="auto-save" v-model:checked="autoSave" />
              <Label for="auto-save">Enable auto-save every 30 seconds</Label>
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox id="save-metadata" v-model:checked="saveMetadata" />
              <Label for="save-metadata">Include document metadata</Label>
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox id="create-backup" v-model:checked="createBackup" />
              <Label for="create-backup">Create backup copy</Label>
            </div>
          </div>
        </div>

        <!-- File Name Input -->
        <div class="space-y-2">
          <Label for="filename">File Name</Label>
          <Input id="filename" v-model="filename" placeholder="Enter filename..." class="w-full" />
        </div>

        <!-- Document Info -->
        <div class="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 class="font-semibold text-gray-900">Document Information</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Title:</span>
              <span class="ml-2 font-medium">{{ store.title || 'Untitled' }}</span>
            </div>
            <div>
              <span class="text-gray-600">Word Count:</span>
              <span class="ml-2 font-medium">{{ wordCount }}</span>
            </div>
            <div>
              <span class="text-gray-600">Characters:</span>
              <span class="ml-2 font-medium">{{ characterCount }}</span>
            </div>
            <div>
              <span class="text-gray-600">Last Modified:</span>
              <span class="ml-2 font-medium">{{ lastModified }}</span>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" class="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-600">
          {{ statusMessage }}
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {{ errorMessage }}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSave" :disabled="!filename.trim()">
          <Save class="w-4 h-4 mr-2" />
          Save Document
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Label } from '@/components/ui/label'
  import {
    Save,
    HardDrive,
    Download
  } from 'lucide-vue-next'
  import { useMarkdownDocStore } from '@/stores/markdownDoc'

  interface Props {
    open: boolean
  }

  defineProps<Props>()
  defineEmits<{
    'update:open': [value: boolean]
  }>()

  const store = useMarkdownDocStore()

  // State
  const autoSave = ref(false)
  const saveMetadata = ref(true)
  const createBackup = ref(false)
  const filename = ref('')
  const statusMessage = ref('')
  const errorMessage = ref('')

  // Computed
  const wordCount = computed(() => {
    if (!store.content.trim()) return 0
    return store.content.trim().split(/\s+/).length
  })

  const characterCount = computed(() => store.content.length)

  const lastModified = computed(() => {
    return new Date().toLocaleString()
  })

  // Watch for store title changes to update filename
  watch(() => store.title, (newTitle) => {
    if (newTitle && !filename.value) {
      filename.value = sanitizeFilename(newTitle)
    }
  }, { immediate: true })

  // Methods
  function sanitizeFilename(title: string): string {
    return title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      || 'untitled'
  }

  async function saveToLocal() {
    try {
      statusMessage.value = 'Saving to local storage...'
      errorMessage.value = ''

      const saveData = {
        title: store.title,
        content: store.content,
        filename: filename.value || sanitizeFilename(store.title),
        savedAt: new Date().toISOString(),
        metadata: saveMetadata.value ? {
          wordCount: wordCount.value,
          characterCount: characterCount.value,
          createdAt: new Date().toISOString()
        } : undefined
      }

      // Create backup if requested
      if (createBackup.value) {
        const backupKey = `chainpaper_backup_${Date.now()}`
        localStorage.setItem(backupKey, JSON.stringify(saveData))
      }

      // Save to main storage
      const storageKey = `chainpaper_doc_${filename.value || 'untitled'}`
      localStorage.setItem(storageKey, JSON.stringify(saveData))

      // Update store save state
      store.markSaved()

      statusMessage.value = 'Successfully saved to local storage!'

      setTimeout(() => {
        statusMessage.value = ''
      }, 3000)

    } catch (error: any) {
      errorMessage.value = `Failed to save: ${error.message}`
    }
  }

  async function downloadFile() {
    try {
      statusMessage.value = 'Preparing download...'
      errorMessage.value = ''

      let content = store.content

      if (saveMetadata.value) {
        const metadata = `---
        title: ${store.title}
        date: ${new Date().toISOString()}
        word_count: ${wordCount.value}
        character_count: ${characterCount.value}
        ---
        `
        content = metadata + content
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.value || 'untitled'}.md`
      link.click()
      URL.revokeObjectURL(url)

      statusMessage.value = 'File downloaded successfully!'

      setTimeout(() => {
        statusMessage.value = ''
      }, 3000)

    } catch (error: any) {
      errorMessage.value = `Download failed: ${error.message}`
    }
  }

  async function handleSave() {
    // Default to local storage save
    await saveToLocal()
  }

  // Auto-save functionality
  let autoSaveInterval: NodeJS.Timeout | null = null

  watch(autoSave, (enabled) => {
    if (enabled) {
      autoSaveInterval = setInterval(async () => {
        if (store.content && filename.value) {
          await saveToLocal()
        }
      }, 30000) // 30 seconds
    } else if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
  })

  // Clean up interval on unmount
  import { onUnmounted } from 'vue'
  onUnmounted(() => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }
  })
</script>
