<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-3xl w-full">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-primary dark:text-primary" />
          Markdown Guide
        </DialogTitle>
        <DialogDescription class="text-gray-700 text-sm sm:text-base">
          Quick reference for markdown syntax and formatting
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh] sm:max-h-[50vh] w-full pr-2">
        <div class="space-y-6 py-2 px-1 sm:px-0">
          <!-- Basic Syntax -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Basic Syntax</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50"># Heading</code>
                  <span class="text-sm text-muted-foreground">→ Heading 1</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">## Subheading</code>
                  <span class="text-sm text-muted-foreground">→ Heading 2</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">**bold**</code>
                  <span class="text-sm text-muted-foreground">→ <strong>bold</strong></span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">*italic*</code>
                  <span class="text-sm text-muted-foreground">→ <em>italic</em></span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">- item</code>
                  <span class="text-sm text-muted-foreground">→ Bullet list</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">1. item</code>
                  <span class="text-sm text-muted-foreground">→ Numbered list</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">[link](url)</code>
                  <span class="text-sm text-muted-foreground">→ Link</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">`code`</code>
                  <span class="text-sm text-muted-foreground">→ Inline code</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Features -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Advanced Features</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">```code```</code>
                  <span class="text-sm text-muted-foreground">→ Code block</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">| A | B |</code>
                  <span class="text-sm text-muted-foreground">→ Table</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">![alt](url)</code>
                  <span class="text-sm text-muted-foreground">→ Image</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">&gt; quote</code>
                  <span class="text-sm text-muted-foreground">→ Blockquote</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">~~strikethrough~~</code>
                  <span class="text-sm text-muted-foreground">→ Strikethrough</span>
                </div>
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">---</code>
                  <span class="text-sm text-muted-foreground">→ Horizontal rule</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Tips</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground/80">
              <div class="flex items-center gap-2"><div class="w-1 h-1 rounded-full bg-primary/50"></div> Use Ctrl+B for bold, Ctrl+I for italic</div>
              <div class="flex items-center gap-2"><div class="w-1 h-1 rounded-full bg-primary/50"></div> Press Enter twice for new paragraph</div>
              <div class="flex items-center gap-2"><div class="w-1 h-1 rounded-full bg-primary/50"></div> Use # ## ### for headings 1-6</div>
              <div class="flex items-center gap-2"><div class="w-1 h-1 rounded-full bg-primary/50"></div> Add spaces after # and list markers</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter>
        <div class="flex w-full items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" @click="$emit('update:open', false)">
            Close
          </Button>
          <Button class="bg-primary hover:bg-primary/90 text-white" @click="openExternalGuide">
            <ExternalLink class="w-4 h-4 mr-2" /> Full Guide
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { BookOpen, ExternalLink } from 'lucide-vue-next'

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
