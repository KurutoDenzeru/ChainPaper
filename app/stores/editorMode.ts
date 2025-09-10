import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorModeStore = defineStore('editorMode', () => {
  // 'source' (default) or 'reader'
  const mode = ref<'source' | 'reader'>('source')
  return { mode }
})