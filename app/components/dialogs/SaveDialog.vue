<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Save class="w-5 h-5 text-green-600" />
          Save Markdown Document
        </DialogTitle>
        <DialogDescription>
          Save your markdown document to local storage or export as file.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Save Settings (only auto-save toggle) -->
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100">Save Options</h4>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox id="auto-save" v-model:checked="autoSave" />
              <Label for="auto-save" class="text-gray-700 dark:text-gray-200">Enable auto-save every 30 seconds</Label>
            </div>
          </div>
        </div>

        <!-- File Name Input (two-way bound to document title) -->
        <div class="space-y-2">
          <Label for="filename" class="text-gray-700 dark:text-gray-200">File Name</Label>
          <Input id="filename" v-model="store.title"
            class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            placeholder="Enter file name..." />
        </div>

        <!-- Document Info -->
        <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100">Document Information</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-300">Title:</span>
              <span class="ml-2 font-medium dark:text-gray-100">{{ store.title || 'Untitled' }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">Word Count:</span>
              <span class="ml-2 font-medium dark:text-gray-100">{{ wordCount }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">Characters:</span>
              <span class="ml-2 font-medium dark:text-gray-100">{{ characterCount }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">Last Modified:</span>
              <span class="ml-2 font-medium dark:text-gray-100">{{ lastModified }}</span>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage"
          class="p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-sm text-blue-600 dark:text-blue-200">
          {{ statusMessage }}
        </div>

        <div v-if="errorMessage"
          class="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-sm text-red-600 dark:text-red-200">
          {{ errorMessage }}
        </div>
      </div>

      <DialogFooter class="w-full">
        <div class="flex w-full gap-3">
          <Button variant="outline" @click="$emit('update:open', false)" class="flex-1">
            Cancel
          </Button>
          <Button @click="handleSave"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white hover:text-white border-none dark:bg-green-500 dark:hover:bg-green-600">
            <Save class="w-4 h-4 mr-2 text-white" />
            Save Document
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
  import { Save } from 'lucide-vue-next'
  import { useMarkdownDocStore } from '@/stores/markdownDoc'
  import { toast } from 'vue-sonner'

  interface Props {
    open: boolean
  }

  const props = defineProps<Props>()
  defineEmits<{
    'update:open': [value: boolean]
  }>()

  const store = useMarkdownDocStore()

  // State
  // Bind autoSave directly to the Pinia store so preference persists across sessions
  const autoSave = computed({
    get: () => store.autoSaveEnabled,
    set: (v: boolean) => store.setAutoSaveEnabled(v)
  })
  // Always use the current document title as filename (even if Untitled Markdown)
  const computedFilename = computed(() => {
    const t = store.title?.trim() || 'Untitled Markdown'
    return sanitizeFilename(t)
  })
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


  // No need to watch for title changes; computedFilename is always up to date

  // Methods
  function sanitizeFilename(title: string): string {
    return title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      || 'untitled'
  }


  // Only save to local storage, always using computedFilename
  async function saveToLocal(silent = false) {
    try {
      if (!silent) {
        statusMessage.value = 'Saving to local storage...'
        errorMessage.value = ''
      }

      const saveData = {
        title: store.title,
        content: store.content,
        attachments: store.attachments || {},
        filename: computedFilename.value,
        savedAt: new Date().toISOString(),
        // Removed metadata block as it is no longer used
      }

      // Save to main storage
      const storageKey = `chainpaper_doc_${computedFilename.value}`
      localStorage.setItem(storageKey, JSON.stringify(saveData))

      // Also save as current document for auto-restoration
      localStorage.setItem('chainpaper_current_doc', JSON.stringify(saveData))

      // Update store save state
      store.markSaved()

      if (!silent) {
        statusMessage.value = 'Successfully saved to local storage!'
        toast.success('Document saved successfully!', {
          description: `Saved "${store.title || 'Untitled'}" to browser storage`
        })

        setTimeout(() => {
          statusMessage.value = ''
        }, 3000)
      } else {
        // Silent auto-save notification
        toast.success('Auto-saved', {
          description: `Document "${store.title || 'Untitled'}" saved automatically`,
          duration: 2000
        })
      }

    } catch (error: any) {
      const message = `Failed to save: ${error.message}`
      errorMessage.value = message
      toast.error('Save failed', {
        description: message
      })
    }
  }


  // Download functionality removed

  async function handleSave() {
    // Default to local storage save
    await saveToLocal()
  }

  // Auto-save functionality (client-only)
  let autoSaveInterval: number | null = null
  // store the watch stopper so it can be cleaned up on unmount
  let stopAutoSaveWatch: (() => void) | null = null

  onMounted(() => {
    // Watch the autoSave toggle and create/clear interval on the client
    stopAutoSaveWatch = watch(autoSave, (enabled) => {
      if (enabled) {
        // Ensure any previous interval is cleared
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval)
        }
        autoSaveInterval = window.setInterval(async () => {
          if (store.isDirty && store.content.trim()) {
            await saveToLocal(true) // Silent save for auto-save
          }
        }, 30000) // 30 seconds
      } else {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval)
          autoSaveInterval = null
        }
      }
    }, { immediate: true })
  })

  // Clean up when component unmounts (registered at top-level to avoid nested hooks)
  onUnmounted(() => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
    if (stopAutoSaveWatch) {
      stopAutoSaveWatch()
      stopAutoSaveWatch = null
    }
  })
</script>
