<template>
  <div 
    :class="[
      'fixed top-0 right-0 h-full w-100 bg-white border-l border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out',
      isVisible ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Document Tools</h2>
          <Button variant="ghost" size="sm" @click="$emit('close')" class="h-8 w-8 p-0">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Tabs -->
      <Tabs v-model="activeTab" class="flex-1 flex flex-col">
        <TabsList class="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="toc" class="text-sm">
            <BookOpen class="w-4 h-4 mr-2" />
            TOC
          </TabsTrigger>
          <TabsTrigger value="comments" class="text-sm">
            <MessageSquare class="w-4 h-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="authorship" class="text-sm">
            <Users class="w-4 h-4 mr-2" />
            Authors
          </TabsTrigger>
        </TabsList>

        <div class="flex-1 overflow-hidden">
          <!-- Table of Contents -->
          <TabsContent value="toc" class="flex-1 m-0 p-4 overflow-y-auto">
            <div class="space-y-2">
              <div
                v-for="entry in documentIndex.tableOfContents"
                :key="entry.id"
                :class="[
                  'p-3 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 border border-transparent hover:border-gray-200',
                  entry.level === 1 && 'font-semibold text-gray-900',
                  entry.level === 2 && 'pl-6 text-gray-700',
                  entry.level === 3 && 'pl-10 text-sm text-gray-600'
                ]"
                @click="handleTOCNavigation(entry)"
              >
                <div class="flex items-center gap-2">
                  <Hash class="w-3 h-3 text-gray-400" />
                  {{ entry.title }}
                </div>
              </div>
              <div v-if="!documentIndex.tableOfContents?.length" class="text-center py-8">
                <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p class="text-sm text-gray-500">No headings found</p>
                <p class="text-xs text-gray-400 mt-1">Start typing to add content</p>
              </div>
            </div>
          </TabsContent>

          <!-- Comments -->
          <TabsContent value="comments" class="flex-1 m-0 p-4 overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-sm text-gray-900">{{ comment.author }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ comment.text }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!comments?.length" class="text-center py-8">
                <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p class="text-sm text-gray-500">No comments yet</p>
                <p class="text-xs text-gray-400 mt-1">Add comments to collaborate</p>
              </div>
            </div>
          </TabsContent>

          <!-- Authorship -->
          <TabsContent value="authorship" class="flex-1 m-0 p-4 overflow-y-auto">
            <div class="space-y-4">
              <!-- Document Info -->
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="font-medium text-blue-900 mb-2">Document Info</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-blue-700">Created:</span>
                    <span class="text-blue-900">{{ formatDate(documentMetadata.createdAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-blue-700">Modified:</span>
                    <span class="text-blue-900">{{ formatDate(documentMetadata.updatedAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-blue-700">Author:</span>
                    <span class="text-blue-900">{{ documentMetadata.author }}</span>
                  </div>
                </div>
              </div>

              <!-- Blockchain Proof -->
              <div v-if="authorshipProof" class="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 class="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <Shield class="w-4 h-4" />
                  Blockchain Proof
                </h4>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="text-green-700">Hash:</span>
                    <code class="block text-xs bg-green-100 p-2 rounded mt-1 break-all">{{ authorshipProof.hash }}</code>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-green-700">Block:</span>
                    <span class="text-green-900">#{{ authorshipProof.blockNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-green-700">Timestamp:</span>
                    <span class="text-green-900">{{ formatDate(authorshipProof.timestamp) }}</span>
                  </div>
                </div>
              </div>

              <!-- Contributors -->
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users class="w-4 h-4" />
                  Contributors
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="contributor in documentMetadata.contributors"
                    :key="contributor.id"
                    class="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                  >
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User class="w-4 h-4 text-gray-600" />
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-sm text-gray-900">{{ contributor.name }}</div>
                      <div class="text-xs text-gray-500">{{ contributor.contributions }} contributions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </div>
  
  <!-- Backdrop -->
  <div 
    v-if="isVisible"
    class="fixed inset-0 bg-black/20 z-30"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, BookOpen, MessageSquare, Users, Hash, User, Shield } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  isVisible: boolean
  documentIndex: any
  comments: any[]
  documentMetadata: any
  authorshipProof?: any
}

defineProps<Props>()

defineEmits<{
  close: []
  'navigate-to-heading': [entry: any]
}>()

const activeTab = ref('toc')

function handleTOCNavigation(entry: any) {
  // Navigate to the TOC entry
  console.log('Navigate to:', entry)
}

function formatDate(date: Date | string) {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}
</script>
