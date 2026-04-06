<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <div class="flex flex-col items-center gap-3 mb-2">
          <NuxtImg src="/markdown.webp" alt="ChainPaper Welcome" class="w-20 h-20 object-contain mx-auto" />
        </div>
        <DialogTitle class="flex items-center gap-2 justify-center">
          <Info class="w-5 h-5 text-green-600 dark:text-green-500" />
          About ChainPaper
        </DialogTitle>
        <DialogDescription class="text-center">
          Information on how this project encapsulates authorship assurance using modern web technologies.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh] sm:max-h-[50vh] w-full pr-2">
        <div class="space-y-2 py-2 px-1 sm:px-0">
          <!-- Project Description -->
          <div class="space-y-3">
            <h3 class="text-base sm:text-lg font-semibold text-foreground">Project Description</h3>
            <p class="text-foreground/80 leading-relaxed text-sm sm:text-base">
              ✍️ Secure markdown platform for authorship assurance, crafted with Nuxt, Pinia, Tailwind, and Shadcn,
              featuring cryptographic verification using SHA-256.
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-2">
            <h3 class="text-base sm:text-lg font-semibold text-foreground">Features</h3>
            <ul class="list-disc pl-5 text-foreground/80 text-sm sm:text-base">
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
            <h3 class="text-base sm:text-lg font-semibold text-foreground">Tech Stack</h3>
            <ul class="list-disc pl-5 text-foreground/80 text-sm sm:text-base">
              <li>Nuxt.js & Vue 3</li>
              <li>TypeScript</li>
              <li>Shadcn Vue & Tailwind CSS</li>
              <li>KaTeX for math rendering</li>
              <li>Markdown-it parser</li>
            </ul>
          </div>

          <!-- Links -->
          <div class="space-y-2">
            <h3 class="text-xs sm:text-sm font-semibold text-foreground-100">Connect</h3>
            <div class="flex flex-wrap items-center gap-2">
              <a href="https://github.com/KurutoDenzeru/ChainPaper" target="_blank"
                class="p-2 rounded-md border border-border/60 dark:border-border/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="GitHub Repository">
                <Github class="w-5 h-5 text-foreground" />
              </a>

              <a href="https://www.linkedin.com/in/KurtCalacday" target="_blank"
                class="p-2 rounded-md border border-border/60 dark:border-border/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="LinkedIn Profile">
                <Linkedin class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </a>

              <a href="https://www.instagram.com/krtclcdy" target="_blank"
                class="p-2 rounded-md border border-border/60 dark:border-border/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Instagram">
                <Instagram class="w-5 h-5 text-pink-500 dark:text-pink-400" />
              </a>
            </div>
          </div>
        </div>
      </ScrollArea>

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

  const props = defineProps<{
    open: boolean
  }>()

  defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>
