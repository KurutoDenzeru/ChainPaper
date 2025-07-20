<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-xl shadow-2xl max-w-6xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 lg:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-4">
        <div class="flex items-center gap-3 sm:gap-4">
          <FileText class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12" />
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">ChainPaper</h1>
            <p class="text-xs sm:text-sm opacity-90 mt-1">Decentralized Document Editor with Verifiable Authorship</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          class="w-8 h-8 sm:w-10 sm:h-10 self-end sm:self-auto flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <X class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <!-- Quick Actions -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get Started</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="$emit('create-new')"
              class="flex items-center gap-4 p-6 border-2 border-blue-500 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <FilePlus class="w-10 h-10 flex-shrink-0" />
              <div class="text-left">
                <h3 class="text-lg font-semibold">Create New Document</h3>
                <p class="text-sm opacity-90">Start with a blank document</p>
              </div>
            </button>

            <button 
              @click="handleOpenDocument"
              class="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <FolderOpen class="w-10 h-10 flex-shrink-0 text-gray-600" />
              <div class="text-left">
                <h3 class="text-lg font-semibold text-gray-900">Open Document</h3>
                <p class="text-sm text-gray-600">Import existing document</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Templates -->
        <div v-if="templates.length > 0" class="mb-8 sm:mb-12">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Templates</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              v-for="template in templates"
              :key="template.id"
              @click="$emit('use-template', template)"
              class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left"
            >
              <div class="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                <FileText v-if="!template.thumbnail" class="w-12 h-12 text-gray-400" />
                <img v-else :src="template.thumbnail" :alt="template.name" class="w-full h-full object-cover" />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-2">{{ template.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ template.description }}</p>
                <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                  {{ template.category }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Documents -->
        <div v-if="recentDocuments.length > 0" class="mb-8 sm:mb-12">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Documents</h2>
          <div class="space-y-2">
            <button
              v-for="doc in recentDocuments.slice(0, 5)"
              :key="doc.id"
              @click="$emit('open-document', doc)"
              class="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 text-left"
            >
              <div class="w-8 sm:w-10 h-8 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText class="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-semibold text-gray-900 truncate">{{ doc.title || 'Untitled Document' }}</h4>
                <p class="text-xs sm:text-sm text-gray-600">{{ formatDate(doc.updatedAt) }}</p>
                <p class="text-xs text-gray-500">by {{ doc.author }}</p>
              </div>
              <div class="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                {{ doc.wordCount || 0 }} words
              </div>
            </button>
          </div>
        </div>

        <!-- Features -->
        <div class="features-section mb-8 sm:mb-12">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Features</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="text-center p-4 sm:p-6">
              <Shield class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Blockchain Verification</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Verify document authorship and integrity using blockchain technology.
              </p>
            </div>

            <div class="text-center p-4 sm:p-6">
              <Users class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Real-time Collaboration</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Work together on documents with real-time editing and commenting.
              </p>
            </div>

            <div class="text-center p-4 sm:p-6">
              <Download class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Export Anywhere</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Export your documents to PDF, Word, HTML, and more formats.
              </p>
            </div>

            <div class="text-center p-4 sm:p-6">
              <Lock class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your documents are encrypted and only accessible by authorized users.
              </p>
            </div>

            <div class="text-center p-4 sm:p-6">
              <Search class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Find anything in your documents with intelligent search capabilities.
              </p>
            </div>

            <div class="text-center p-4 sm:p-6">
              <Smartphone class="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Edit and review documents on any device, anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, FilePlus, FolderOpen, X, Shield, Users, Download, Lock, Search, Smartphone } from 'lucide-vue-next'

const props = defineProps<{
  recentDocuments: any[]
  templates: any[]
}>()

const emit = defineEmits<{
  'create-new': []
  'open-document': [file?: File]
  'use-template': [template: any]
  'close': []
}>()

function handleOpenDocument() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.docx,.html,.txt'
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      emit('open-document', file)
    }
  }
  input.click()
}

function handleOpenRecent(doc: any) {
  // In a real implementation, this would load the document from storage
  console.log('Opening recent document:', doc)
  emit('close')
}

function formatDate(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return d.toLocaleDateString()
  }
}
</script>
