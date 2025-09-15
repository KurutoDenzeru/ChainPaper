<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-2xl w-full p-2 sm:p-6">
      <DialogHeader>
        <div class="flex flex-col items-center justify-center w-full mb-2">
          <NuxtImg src="/markdown.webp" alt="ChainPaper Welcome"
            class="w-20 h-20 sm:w-28 sm:h-28 object-contain mx-auto rounded-lg shadow-sm" />
        </div>
        <DialogTitle class="flex items-center gap-2 text-base sm:text-lg justify-center text-center w-full">
          <Info class="w-5 h-5 text-green-600 dark:text-green-500" />
          About ChainPaper - Trustless Whitepaper
        </DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center w-full">
          Information on how this project encapsulates authorship assurance using modern web technologies.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh] sm:max-h-[50vh] w-full pr-2">
        <div class="space-y-4 py-2 px-1 sm:px-0">
          <!-- Project Description -->
          <div class="space-y-3">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Project Description</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              ✍️ Secure markdown platform for authorship assurance, crafted with Nuxt, Tailwind, and Shadcn for instant
              preview and modern usability.
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-2">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Features</h3>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <li>Real-time markdown editing and instant preview</li>
              <li>Authorship verification with cryptographic proofs</li>
              <li>Advanced formatting: tables, math, lists, alignment</li>
              <li>Rich media insertion: emojis, tables, code blocks</li>
              <li>Responsive design for all devices</li>
              <li>Export options with verification metadata</li>
            </ul>
          </div>

          <!-- Tech Stack -->
          <div class="space-y-2">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Tech Stack</h3>
            <ul class="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <li>Nuxt.js & Vue 3</li>
              <li>TypeScript</li>
              <li>Shadcn Vue & Tailwind CSS</li>
              <li>KaTeX for math rendering</li>
              <li>Markdown-it parser</li>
            </ul>
          </div>

          <!-- Links -->
          <div class="space-y-2">
            <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">Connect</h3>
            <div class="flex flex-wrap items-center gap-2">
              <a href="https://github.com/KurutoDenzeru/ChainPaper" target="_blank"
                class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="GitHub Repository">
                <Github class="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </a>

              <a href="https://www.linkedin.com/in/KurtCalacday" target="_blank"
                class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="LinkedIn Profile">
                <Linkedin class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </a>

              <a href="https://www.instagram.com/krtclcdy" target="_blank"
                class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Instagram">
                <Instagram class="w-5 h-5 text-pink-500 dark:text-pink-400" />
              </a>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter class="mt-4">
        <div class="w-full">
          <Button variant="outline" class="w-full" @click="$emit('update:open', false)">
            Close
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">

  import { Info, Github, Linkedin, Instagram } from 'lucide-vue-next'
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
</script>
