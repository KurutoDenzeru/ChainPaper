<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <LinkIcon class="w-5 h-5 text-green-600" />
          <span>Insert Link</span>
        </DialogTitle>
        <DialogDescription>
          Add a hyperlink to your document. The link will be clickable and can navigate to external websites or internal
          pages.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- URL Input -->
        <div class="space-y-2">
          <Label for="url" class="flex items-center gap-2">
            <Globe class="w-4 h-4 text-gray-500" />
            <span>URL or Web Address</span>
          </Label>
          <Input id="url" v-model="url" type="url" placeholder="https://example.com or /page"
            @keydown.enter="handleInsert" ref="urlInput" />
          <p class="text-sm text-gray-500">
            Enter a web address, email, or relative path
          </p>
        </div>

        <!-- Link Text Input -->
        <div class="space-y-2">
          <Label for="text" class="flex items-center gap-2">
            <TypeIcon class="w-4 h-4 text-gray-500" />
            <span>Link Text</span>
          </Label>
          <Input id="text" v-model="linkText" placeholder="Enter display text (optional)"
            @keydown.enter="handleInsert" />
          <p class="text-sm text-gray-500">
            {{ hasSelectedText ? 'Selected text will be used if left empty' : 'URL will be used if left empty' }}
          </p>
        </div>

        <!-- Options (no title required) -->

        <!-- Preview -->
        <div v-if="previewHtml" class="p-3 bg-gray-50 rounded-md border">
          <p class="text-sm text-gray-600 mb-1">Preview:</p>
          <div v-html="previewHtml" class="text-sm"></div>
        </div>
      </div>

      <DialogFooter>
        <div class="flex w-full gap-2">
          <Button variant="outline" @click="handleCancel" class="w-1/2">Cancel</Button>
          <Button @click="handleInsert" :disabled="!url.trim()"
            class="w-1/2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed">
            <Link2 class="w-4 h-4" />
            <span>Insert Link</span>
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted } from 'vue'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Link as LinkIcon, Link2, Globe, Type as TypeIcon } from 'lucide-vue-next'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { normalizeUrl, createLinkHtml, insertLink, type LinkInsertOptions } from '@/lib/editor-formatting'

  interface Props {
    open?: boolean
    selectedText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    selectedText: ''
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    'insert': [success: boolean, message?: string, options?: LinkInsertOptions]
  }>()

  // Form state
  const url = ref('')
  const linkText = ref('')
  // no title field anymore

  // Component state
  const isOpen = ref(props.open)
  const urlInput = ref<HTMLInputElement>()

  // Computed properties
  const hasSelectedText = computed(() => props.selectedText.length > 0)

  const previewHtml = computed(() => {
    if (!url.value.trim()) return ''

    const normalizedUrl = normalizeUrl(url.value)
    const displayText = linkText.value || props.selectedText || normalizedUrl

    return createLinkHtml({
      url: normalizedUrl,
      text: displayText,
      target: '_blank',
      rel: 'noopener noreferrer'
    })
  })

  // Watchers
  watch(() => props.open, (newValue) => {
    isOpen.value = newValue
    if (newValue) {
      resetForm()
      // Focus URL input when dialog opens
      nextTick(() => {
        // The Input component is a wrapper; the ref may point to the component instance.
        // Query the native input by id which is forwarded to the underlying <input> element.
        const native = document.getElementById('url') as HTMLInputElement | null
        native?.focus()
      })
    }
  })

  watch(() => props.selectedText, (newText) => {
    if (newText && !linkText.value) {
      linkText.value = newText
    }
  })

  // Methods
  function resetForm() {
    url.value = ''
    linkText.value = props.selectedText || ''
  }

  function handleOpenChange(open: boolean) {
    isOpen.value = open
    emit('update:open', open)
  }

  function handleCancel() {
    handleOpenChange(false)
  }

  function handleInsert() {
    if (!url.value.trim()) return

    const options: LinkInsertOptions = {
      url: url.value.trim(),
      text: linkText.value.trim() || props.selectedText || undefined,
      target: '_blank',
      rel: 'noopener noreferrer'
    }

    // Emit the link data for the parent to handle insertion (success, options)
    emit('insert', true, undefined, options)
    handleOpenChange(false)
  }

  // Initialize form when component mounts
  onMounted(() => {
    if (props.selectedText) {
      linkText.value = props.selectedText
    }
  })
</script>

<style scoped>

  /* Link preview styling */
  :deep(.preview a) {
    color: #2563eb;
    text-decoration: underline;
    pointer-events: none;
  }
</style>
