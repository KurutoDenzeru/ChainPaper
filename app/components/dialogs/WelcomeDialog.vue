<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-3xl">
      <DialogHeader>
        <div class="flex flex-col items-center gap-3 mb-2">
          <NuxtImg src="/markdown.webp" alt="ChainPaper Welcome" class="w-20 h-20 object-contain" />
          <DialogTitle class="text-2xl">Welcome to ChainPaper</DialogTitle>
          <DialogDescription class="text-center max-w-lg mx-auto">
            Trustless Whitepaper Platform — create and verify documents locally with cryptographic proofs.
          </DialogDescription>
        </div>
      </DialogHeader>
      <div class="grid gap-1">
        <div class="mb-2">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-blue-500" /> Getting Started
          </h3>
          <p class="text-xs text-foreground/80 mt-0.5">Choose a template to begin.</p>
        </div>

        <div class="p-1 grid grid-cols-2 gap-3">
          <button ref="blankBtn" @click="selectTemplate('blank')"
            class="w-full text-left group border border-border/60 dark:border-border/60 rounded-md p-3 flex flex-col items-start hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer">
            <FileText class="w-6 h-6 text-blue-500 mb-2" />
            <span class="font-semibold text-sm text-foreground">Blank Document</span>
            <span class="text-xs text-muted-foreground">Start from scratch</span>
          </button>

          <button @click="selectTemplate('welcome')"
            class="w-full text-left group border border-border/60 dark:border-border/60 rounded-md p-3 flex flex-col items-start hover:bg-green-50 dark:hover:bg-gray-800 transition cursor-pointer">
            <BookOpen class="w-6 h-6 text-green-500 mb-2" />
            <span class="font-semibold text-sm text-foreground">Welcome Guide</span>
            <span class="text-xs text-muted-foreground">Learn how to use ChainPaper</span>
          </button>

          <button @click="selectTemplate('whitepaper')"
            class="w-full text-left group border border-border/60 dark:border-border/60 rounded-md p-3 flex flex-col items-start hover:bg-yellow-50 dark:hover:bg-gray-800 transition cursor-pointer">
            <Scroll class="w-6 h-6 text-yellow-500 mb-2" />
            <span class="font-semibold text-sm text-foreground">Whitepaper Template</span>
            <span class="text-xs text-muted-foreground">Start a technical whitepaper</span>
          </button>

          <button @click="selectTemplate('research')"
            class="w-full text-left group border border-border/60 dark:border-border/60 rounded-md p-3 flex flex-col items-start hover:bg-purple-50 dark:hover:bg-gray-800 transition cursor-pointer">
            <FlaskConical class="w-6 h-6 text-purple-500 mb-2" />
            <span class="font-semibold text-sm text-foreground">Research Paper</span>
            <span class="text-xs text-muted-foreground">Academic research starter</span>
          </button>
        </div>

        <div class="w-full mt-2 p-1">
          <Button class="w-full" variant="outline" @click="$emit('update:open', false)">Close</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
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
    } catch (e) { }
    await nextTick()
    setTimeout(() => {
      try { blankBtn.value?.removeAttribute('tabindex') } catch (e) { }
    }, 50)
  })

  function selectTemplate(template: string) {
    emit('select-template', template)
    emit('update:open', false)
  }
</script>
