<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md w-full p-6 flex flex-col items-center justify-center gap-4">
      <DialogHeader class="w-full flex flex-col items-start">
        <DialogTitle class="flex items-center gap-2 text-lg font-semibold text-left">
          <ImageIcon class="w-5 h-5 text-blue-500" />
          Insert Image
        </DialogTitle>
        <DialogDescription class="text-left mt-1">
          Drag and drop an image here, or click to select a file.
        </DialogDescription>
      </DialogHeader>
      <div
        class="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition relative"
        :class="[isDragging ? 'border-blue-400 bg-blue-50' : (isHover ? 'border-gray-400 bg-gray-100' : 'border-gray-300 bg-gray-50')]"
        @click="triggerFileInput" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
        @drop.prevent="handleDrop" @mouseenter="isHover = true" @mouseleave="isHover = false">
        <div v-if="!preview" class="flex flex-col items-center justify-center gap-2 text-gray-400">
          <ImageIcon class="w-10 h-10" />
          <span class="text-base">Drop image or click to upload</span>
          <span v-if="isDragging" class="flex items-center gap-1 text-blue-500 font-medium">
            <MoveHorizontal class="w-4 h-4" /> Drop to insert
          </span>
        </div>
        <div v-else class="flex flex-col items-center gap-2">
          <img :src="preview" class="max-h-32 rounded shadow" />
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <ImageIcon class="w-4 h-4" />{{ fileName }}
          </span>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
      </div>
      <DialogFooter class="w-full flex gap-2 mt-4">
        <Button variant="outline" class="w-1/2" @click="$emit('update:open', false)">Cancel</Button>
        <Button :disabled="!preview" class="w-1/2" @click="insertImage">Insert</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Image as ImageIcon, UploadCloud, MoveHorizontal } from 'lucide-vue-next'

  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits(['update:open', 'insert'])

  const fileInput = ref<HTMLInputElement | null>(null)
  const preview = ref<string | null>(null)
  const fileName = ref<string>('')
  const fileBlob = ref<Blob | null>(null)
  const uploading = ref(false)
  const isDragging = ref(false)
  const isHover = ref(false)

  function triggerFileInput() {
    fileInput.value?.click()
  }

  function handleFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files || !files[0]) return
    const file = files[0]
    fileName.value = file.name
    fileBlob.value = file
    const reader = new FileReader()
    reader.onload = () => {
      preview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: DragEvent) {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (!files || !files[0]) return
    const file = files[0]
    fileName.value = file.name
    fileBlob.value = file
    const reader = new FileReader()
    reader.onload = () => {
      preview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  function onDragOver() {
    isDragging.value = true
  }
  function onDragLeave() {
    isDragging.value = false
  }

  function insertImage() {
    if (!preview.value) return
    // Emit only the preview data URI; parent will decide how to persist.
    emit('insert', preview.value, fileName.value, preview.value)
    emit('update:open', false)
    preview.value = null
    fileName.value = ''
    fileBlob.value = null
  }
</script>
