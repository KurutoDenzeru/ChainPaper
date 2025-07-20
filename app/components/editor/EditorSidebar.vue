<template>
  <div class="w-64 lg:w-80 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-gray-900">Document Tools</h2>
        <Button variant="ghost" size="sm" @click="$emit('close')" class="h-8 w-8 p-0">
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <Tabs v-model="activeTab" class="flex-1 flex flex-col">
      <TabsList class="grid w-full grid-cols-3 mx-4 mt-3">
        <TabsTrigger value="toc" class="text-xs">TOC</TabsTrigger>
        <TabsTrigger value="comments" class="text-xs">Comments</TabsTrigger>
        <TabsTrigger value="authorship" class="text-xs">Authors</TabsTrigger>
      </TabsList>

      <div class="flex-1 overflow-hidden">
        <!-- Table of Contents -->
        <TabsContent value="toc" class="flex-1 m-0 p-4 overflow-y-auto">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Table of Contents</h3>
          <div class="space-y-1">
            <div
              v-for="entry in documentIndex.tableOfContents"
              :key="entry.id"
              :class="[
                'p-2 text-sm rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100',
                entry.level === 1 && 'font-semibold',
                entry.level === 2 && 'pl-4 text-sm',
                entry.level === 3 && 'pl-8 text-xs text-gray-600'
              ]"
              @click="handleTOCNavigation(entry)"
            >
              {{ entry.title }}
            </div>
            <div v-if="!documentIndex.tableOfContents?.length" class="text-sm text-gray-500 italic">
              No headings found. Start typing to add content.
            </div>
          </div>
        </TabsContent>

        <!-- Comments -->
        <TabsContent value="comments" class="flex-1 m-0 p-4 overflow-y-auto">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Comments</h3>
          <div class="space-y-3">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <div class="font-semibold text-sm text-gray-900">{{ comment.author }}</div>
              <div class="mt-2 text-sm text-gray-700 leading-relaxed">{{ comment.content }}</div>
              <div class="mt-2 text-xs text-gray-500">{{ formatDate(comment.timestamp) }}</div>
            </div>
            <div v-if="!comments?.length" class="text-sm text-gray-500 italic">
              No comments yet. Select text to add a comment.
            </div>
          </div>
        </TabsContent>

        <!-- Authorship -->
        <TabsContent value="authorship" class="flex-1 m-0 p-4 overflow-y-auto">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Document Authors</h3>
          <div class="space-y-3">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="font-semibold text-sm text-gray-900">{{ documentMetadata.author || 'Anonymous' }}</div>
              <div class="mt-2 text-xs text-gray-600">Primary Author</div>
              <div class="mt-2 flex items-center gap-2 text-xs">
                <div :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  authorshipProof?.signature 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ authorshipProof?.signature ? 'Verified' : 'Unverified' }}
                </div>
              </div>
            </div>
            <div v-if="!documentMetadata.author" class="text-sm text-gray-500 italic">
              Set up your profile to enable authorship verification.
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  documentIndex: any
  comments: any[]
  documentMetadata: any
  authorshipProof: any
}>()

const emit = defineEmits<{
  'close': []
  'navigate-to-heading': [entry: any]
}>()

const activeTab = ref('toc')

function handleTOCNavigation(entry: any) {
  emit('navigate-to-heading', entry)
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}
</script>
