<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-3xl w-full p-2 sm:p-6">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-base sm:text-lg">
          <BookOpen class="w-5 h-5 text-green-600 dark:text-green-500" />
          Markdown Guide
        </DialogTitle>
        <DialogDescription class="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          Quick reference for markdown syntax and formatting
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh] sm:max-h-[50vh] w-full pr-2">
        <div class="space-y-4 py-2 px-1 sm:px-0">
          <!-- Basic Syntax -->
          <div class="space-y-3">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Syntax</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100"># Heading</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Heading 1</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">## Subheading</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Heading 2</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">**bold**</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ <strong>bold</strong></span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">*italic*</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ <em>italic</em></span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">- item</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Bullet list</span>
                </div>
                <div class="flex items-center gap-2">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">1. item</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Numbered list</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">[link](url)</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Link</span>
                </div>
                <div class="flex items-center gap-2">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">`code`</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Inline code</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Features -->
          <div class="space-y-3">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Advanced Features</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">```code```</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Code block</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">| A | B |</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Table</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">![alt](url)</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Image</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">&gt; quote</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Blockquote</span>
                </div>
                <div class="flex items-center gap-2">
                  <code
                    class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">~~strikethrough~~</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Strikethrough</span>
                </div>
                <div class="flex items-center gap-2">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-gray-100">---</code>
                  <span class="text-sm text-gray-600 dark:text-gray-400">→ Horizontal rule</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="space-y-2">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Tips</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div>• Use Ctrl+B for bold, Ctrl+I for italic</div>
              <div>• Press Enter twice for new paragraph</div>
              <div>• Use # ## ### for headings 1-6</div>
              <div>• Add spaces after # and list markers</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter class="w-full mt-4">
        <div class="w-full flex items-center gap-2">
          <Button variant="outline" class="w-1/2 dark:border-gray-700 dark:text-gray-100"
            @click="$emit('update:open', false)">
            Close
          </Button>
          <Button
            class="w-1/2 bg-green-600 hover:bg-green-700 text-white border-none dark:bg-green-500 dark:hover:bg-green-600"
            @click="openExternalGuide">
            <ExternalLink class="w-4 h-4 mr-2" />
            Full Guide
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { BookOpen, ExternalLink } from 'lucide-vue-next'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { ScrollArea } from '@/components/ui/scroll-area'

  const props = defineProps<{
    open: boolean
  }>()

  defineEmits<{
    'update:open': [value: boolean]
  }>()

  function openExternalGuide() {
    window.open('https://www.markdownguide.org/', '_blank')
  }
</script>
