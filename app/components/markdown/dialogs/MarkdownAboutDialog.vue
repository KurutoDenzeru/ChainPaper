<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="!max-w-3xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Info class="w-5 h-5" />
          About ChainPaper
        </DialogTitle>
        <DialogDescription>
          Modern markdown editor with document authentication and blockchain-inspired security
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2">
        <!-- Project Description -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Project Description</h3>
          <p class="text-gray-600 leading-relaxed">
            ChainPaper combines markdown editing with document authentication, proof-of-authorship verification,
            and multiple export formats. Built with Vue 3 and Nuxt for a modern, secure editing experience.
          </p>
        </div>

        <!-- Links -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-900">Connect</h3>
          <div class="flex items-center gap-2">
            <a href="https://github.com/KurutoDenzeru/ChainPaper" target="_blank"
              class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="GitHub Repository">
              <Github class="w-5 h-5 text-gray-700" />
            </a>

            <a href="https://www.linkedin.com/in/KurtCalacday" target="_blank"
              class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="LinkedIn Profile">
              <Linkedin class="w-5 h-5 text-blue-600" />
            </a>

            <a href="https://www.instagram.com/krtclcdy" target="_blank"
              class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="Instagram">
              <Instagram class="w-5 h-5 text-pink-500" />
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
