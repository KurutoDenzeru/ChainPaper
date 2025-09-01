<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-4xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <BookOpen class="w-5 h-5" />
          Markdown Guide
        </DialogTitle>
        <DialogDescription>
          Quick reference for markdown syntax and formatting
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2">
        <!-- Basic Syntax -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Basic Syntax</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm"># Heading</code>
                <span class="text-sm text-gray-600">→ Heading 1</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">## Subheading</code>
                <span class="text-sm text-gray-600">→ Heading 2</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">**bold**</code>
                <span class="text-sm text-gray-600">→ <strong>bold</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">*italic*</code>
                <span class="text-sm text-gray-600">→ <em>italic</em></span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">- item</code>
                <span class="text-sm text-gray-600">→ Bullet list</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">1. item</code>
                <span class="text-sm text-gray-600">→ Numbered list</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">[link](url)</code>
                <span class="text-sm text-gray-600">→ Link</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">`code`</code>
                <span class="text-sm text-gray-600">→ Inline code</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Features -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Advanced Features</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">```code```</code>
                <span class="text-sm text-gray-600">→ Code block</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">| A | B |</code>
                <span class="text-sm text-gray-600">→ Table</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">![alt](url)</code>
                <span class="text-sm text-gray-600">→ Image</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">> quote</code>
                <span class="text-sm text-gray-600">→ Blockquote</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">~~strikethrough~~</code>
                <span class="text-sm text-gray-600">→ Strikethrough</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">---</code>
                <span class="text-sm text-gray-600">→ Horizontal rule</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Quick Tips</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Use Ctrl+B for bold, Ctrl+I for italic</div>
            <div>• Press Enter twice for new paragraph</div>
            <div>• Use # ## ### for headings 1-6</div>
            <div>• Add spaces after # and list markers</div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <div class="flex flex-col gap-2 w-full">
          <Button variant="outline" class="w-full" @click="openExternalGuide">
            <ExternalLink class="w-4 h-4 mr-2" />
            Full Guide
          </Button>
          <Button variant="outline" class="w-full" @click="$emit('update:open', false)">
            Close
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
