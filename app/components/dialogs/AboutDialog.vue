<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3 text-2xl font-bold">
          <div class="flex items-center gap-2">
            <FileText class="w-8 h-8 text-blue-600" stroke-width="1.5" />
            ChainPaper
          </div>
        </DialogTitle>
        <DialogDescription>
          A sophisticated decentralized document editor with verifiable authorship
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto flex flex-col gap-8 px-1">
        <!-- Version Info -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          <div class="flex gap-2 text-sm">
            <strong>Version:</strong> 1.0.0 Beta
          </div>
          <div class="flex gap-2 text-sm">
            <strong>Build:</strong> {{ getBuildInfo() }}
          </div>
          <div class="flex gap-2 text-sm">
            <strong>License:</strong> MIT
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Key Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Shield class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Cryptographic authorship verification
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Database class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Decentralized document storage
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Rich text editing with ProseMirror
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Download class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Multiple export formats (PDF, DOCX, HTML, Markdown)
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Search class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Advanced spell checking and grammar
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Puzzle class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" stroke-width="1.5" />
              Modular and extensible architecture
            </li>
          </ul>
        </div>

        <!-- Technology Stack -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Technology Stack</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Frontend:</strong> Nuxt.js 4, Vue.js 3, TypeScript
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Editor:</strong> ProseMirror
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Styling:</strong> Tailwind CSS, Shadcn Vue
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Crypto:</strong> Web Crypto API, CryptoJS
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Storage:</strong> IndexedDB, LocalStorage
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <strong>Export:</strong> jsPDF, Mammoth, html2canvas
            </div>
          </div>
        </div>

        <!-- Links -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Links</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button @click="openGitHub"
              class="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <Github class="w-4 h-4 flex-shrink-0" stroke-width="1.5" />
              GitHub Repository
            </button>
            <button @click="openDocumentation"
              class="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <BookOpen class="w-4 h-4 flex-shrink-0" stroke-width="1.5" />
              Documentation
            </button>
            <button @click="openSupport"
              class="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <MessageCircle class="w-4 h-4 flex-shrink-0" stroke-width="1.5" />
              Support & Feedback
            </button>
            <button @click="openLicense"
              class="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <Lock class="w-4 h-4 flex-shrink-0" stroke-width="1.5" />
              License (MIT)
            </button>
          </div>
        </div>

        <!-- Credits -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Credits</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            ChainPaper is built with open-source technologies and libraries.
            Special thanks to the Vue.js, Nuxt.js, and ProseMirror communities
            for their excellent work.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button @click="open = false" class="w-full">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, watch, defineEmits, defineProps } from 'vue'
  import {
    Shield, Database, FileText, Download, Search, Puzzle,
    Github, BookOpen, MessageCircle, Lock
  } from 'lucide-vue-next'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'

  const props = defineProps<{
    open: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const open = ref(props.open)

  // Watch for prop changes
  watch(() => props.open, (newValue) => {
    open.value = newValue
  })

  // Watch for open changes and emit
  watch(open, (newValue) => {
    emit('update:open', newValue)
  })

  function getBuildInfo() {
    const now = new Date()
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
  }

  function openGitHub() {
    window.open('https://github.com/chainpaper/chainpaper', '_blank')
  }

  function openDocumentation() {
    window.open('https://docs.chainpaper.io', '_blank')
  }

  function openSupport() {
    window.open('https://github.com/chainpaper/chainpaper/issues', '_blank')
  }

  function openLicense() {
    window.open('https://github.com/chainpaper/chainpaper/blob/main/LICENSE', '_blank')
  }
</script>
