<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Info class="w-5 h-5 text-green-600 dark:text-green-500" />
          About ChainPaper - Trustless Whitepaper
        </DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-300">
          Information on how this project encapsulates authorship assurance using modern web technologies.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2">
        <!-- Project Description -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Project Description</h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            ✍️ Secure markdown platform for authorship assurance, crafted with Nuxt, Tailwind, and Shadcn for instant
            preview and modern usability.
          </p>
        </div>

        <!-- Features -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Features</h3>
          <ul class="list-disc pl-5 text-gray-600 dark:text-gray-300">
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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tech Stack</h3>
          <ul class="list-disc pl-5 text-gray-600 dark:text-gray-300">
            <li>Nuxt.js & Vue 3</li>
            <li>TypeScript</li>
            <li>Shadcn Vue & Tailwind CSS</li>
            <li>KaTeX for math rendering</li>
            <li>Markdown-it parser</li>
          </ul>
        </div>

        <!-- Links -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Connect</h3>
          <div class="flex items-center gap-2">
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

      <DialogFooter>
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

  const props = defineProps<{
    open: boolean
  }>()

  defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>
