<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <div class="flex flex-col items-center gap-3 mb-2">
          <NuxtImg src="/markdown.webp" alt="ChainPaper Welcome" class="w-20 h-20 object-contain mx-auto" />
        </div>
        <DialogTitle class="flex items-center gap-2 justify-center">
          <Info class="w-5 h-5 text-primary dark:text-primary" />
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
          <div class="space-y-4 pt-4 border-t border-border mt-4">
            <div class="flex justify-center items-center gap-4">
              <a href="https://github.com/KurutoDenzeru/ChainPaper" target="_blank"
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub Repository">
                <Github class="w-4 h-4" /> Github
              </a>

              <a href="https://www.linkedin.com/in/KurtCalacday" target="_blank"
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                title="LinkedIn Profile">
                <Linkedin class="w-4 h-4" /> LinkedIn
              </a>

              <a href="https://www.instagram.com/krtclcdy" target="_blank"
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                title="Instagram">
                <Instagram class="w-4 h-4" /> Instagram
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
