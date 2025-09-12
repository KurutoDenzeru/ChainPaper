<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="max-w-3xl w-full p-4 overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col w-full items-center">
        <!-- Top illustration -->
        <div class="flex flex-col items-center gap-3 mb-4">
          <NuxtImg src="/markdown.webp" alt="ChainPaper Welcome" class="w-28 h-28 object-contain" />
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-white">Welcome to ChainPaper</DialogTitle>
          <DialogDescription class="text-sm text-gray-500 dark:text-gray-400 text-center">Trustless Whitepaper Platform
            — create and verify documents locally with cryptographic proofs.</DialogDescription>
        </div>

        <!-- Content -->
        <div class="w-full max-h-[65vh] overflow-y-auto">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-blue-500" /> Getting Started
            </h3>
            <p class="text-gray-700 dark:text-gray-200 mt-1">Choose a template to begin.</p>
          </div>

          <div class="p-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button ref="blankBtn" @click="selectTemplate('blank')"
              class="w-full text-left group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer">
              <FileText class="w-6 h-6 text-blue-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Blank Document</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Start from scratch</span>
            </button>

            <button @click="selectTemplate('welcome')"
              class="w-full text-left group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-green-50 dark:hover:bg-gray-800 transition cursor-pointer">
              <BookOpen class="w-6 h-6 text-green-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Welcome Guide</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Learn how to use ChainPaper</span>
            </button>

            <button @click="selectTemplate('whitepaper')"
              class="w-full text-left group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-yellow-50 dark:hover:bg-gray-800 transition cursor-pointer">
              <Scroll class="w-6 h-6 text-yellow-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Whitepaper Template</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Start a technical whitepaper</span>
            </button>

            <button @click="selectTemplate('research')"
              class="w-full text-left group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-start hover:bg-purple-50 dark:hover:bg-gray-800 transition cursor-pointer">
              <FlaskConical class="w-6 h-6 text-purple-500 mb-2" />
              <span class="font-semibold text-gray-900 dark:text-white">Research Paper</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Academic research starter</span>
            </button>
          </div>

          <div class="w-full mt-6 p-1">
            <Button class="w-full" variant="outline" @click="$emit('update:open', false)">Close</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch, nextTick } from 'vue'
  import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { FileText, BookOpen, Scroll, FlaskConical, Sparkles } from 'lucide-vue-next'

  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{
    (e: 'update:open', v: boolean): void
    (e: 'select-template', template: string): void
  }>()

  const blankBtn = ref<HTMLButtonElement | null>(null)

  // When the dialog opens, prevent the first template button from receiving initial focus
  // by temporarily removing it from the tab order. Restore shortly after so it remains tabbable.
  watch(() => props.open, async (open) => {
    if (!open) return
    try {
      if (blankBtn.value) blankBtn.value.setAttribute('tabindex', '-1')
    } catch (e) {}
    await nextTick()
    setTimeout(() => {
      try { blankBtn.value?.removeAttribute('tabindex') } catch (e) {}
    }, 50)
  })

  function selectTemplate(template: string) {
    emit('select-template', template)
    emit('update:open', false)
  }
</script>
