<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-3xl w-full p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row">
        <!-- Left: Welcome Illustration -->
        <div class="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 min-w-[320px]">
          <img src="/markdown.webp" alt="ChainPaper Welcome" class="w-32 h-32 object-contain mb-4" />
          <h2 class="text-2xl font-bold text-blue-700 dark:text-indigo-300 mb-2">Welcome to ChainPaper</h2>
          <p class="text-gray-600 dark:text-gray-300 text-center">Trustless Whitepaper Platform</p>
        </div>
        <!-- Right: Content -->
        <div class="flex-1 flex flex-col p-6 gap-6">
          <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles class="w-6 h-6 text-blue-500" /> Getting Started
            </h1>
            <p class="text-gray-700 dark:text-gray-200">ChainPaper lets you create, edit, and verify markdown documents with cryptographic authorship. Choose a template to begin:</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button @click="selectTemplate('blank')" class="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-blue-50 dark:hover:bg-gray-800 transition">
              <FileText class="w-6 h-6 text-blue-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Blank Document</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Start from scratch</span>
            </button>
            <button @click="selectTemplate('welcome')" class="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-green-50 dark:hover:bg-gray-800 transition">
              <BookOpen class="w-6 h-6 text-green-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Welcome Guide</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Learn how to use ChainPaper</span>
            </button>
            <button @click="selectTemplate('whitepaper')" class="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-yellow-50 dark:hover:bg-gray-800 transition">
              <Scroll class="w-6 h-6 text-yellow-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Whitepaper Template</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Start a technical whitepaper</span>
            </button>
            <button @click="selectTemplate('research')" class="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-purple-50 dark:hover:bg-gray-800 transition">
              <FlaskConical class="w-6 h-6 text-purple-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Research Paper</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Academic research starter</span>
            </button>
          </div>
          <div class="flex flex-col gap-2 mt-4">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Info class="w-4 h-4" />
              You can always access this screen from the Help menu.
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <Button variant="outline" @click="$emit('update:open', false)">Close</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, BookOpen, Scroll, FlaskConical, Info, Sparkles } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'select-template', template: string): void
}>()

function selectTemplate(template: string) {
  emit('select-template', template)
  emit('update:open', false)
}
</script>
