<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Menubar (top) -->
    <MenuBar
      :documentTitle="documentTitle"
      :isDirty="isDirty"
      :user="user"
      @update-title="onUpdateTitle"
      @save-document="onSaveDocument"
      @new-document="onNewDocument"
      @open-document="onOpenDocument"
      @export-document="onExport"
      @import-document="onImport"
      @settings="onSettings"
      @about="onAbout"
    />

    <!-- Editor toolbar (below menubar) -->
    <EditorToolbar
      @toggle-sidebar="toggleSidebar"
      @toggle-find="toggleFind"
      @insert-link="onInsertLink"
      @insert-image="onInsertImage"
      @insert-table="onInsertTable"
    />

    <!-- Simple editor area for demonstration -->
    <main class="p-6">
      <div class="max-w-4xl mx-auto">
        <div
          ref="editorRef"
          contenteditable="true"
          class="min-h-[320px] bg-white border border-gray-200 rounded p-6 shadow-sm prose">
          Start writing here...
        </div>
      </div>
    </main>

  </div >
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuBar from '@/components/layout/MenuBar.vue'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'

// Page state
const documentTitle = ref('Untitled Document')
const isDirty = ref(false)
const user = ref({ name: 'Demo User', email: undefined, avatar: undefined })
const editorRef = ref<HTMLElement | null>(null)

// Handlers for menubar events
function onUpdateTitle(title: string) {
  documentTitle.value = title
  isDirty.value = true
}

function onSaveDocument() {
  // simple save simulation
  console.log('save-document fired — implement persistence')
  isDirty.value = false
}

function onNewDocument() {
  documentTitle.value = 'Untitled Document'
  if (editorRef.value) editorRef.value.innerHTML = ''
  isDirty.value = false
}

function onOpenDocument() {
  console.log('open-document fired')
}

function onExport(format: string) {
  console.log('export-document', format)
}

function onImport() {
  console.log('import-document')
}

function onSettings() {
  console.log('open settings')
}

function onAbout() {
  console.log('open about')
}

// Handlers for toolbar events
const sidebarVisible = ref(false)
const findVisible = ref(false)

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
  console.log('toggle-sidebar ->', sidebarVisible.value)
}

function toggleFind() {
  findVisible.value = !findVisible.value
  console.log('toggle-find ->', findVisible.value)
}

function onInsertLink() {
  console.log('insert-link')
}

function onInsertImage() {
  console.log('insert-image')
}

function onInsertTable() {
  console.log('insert-table')
}
</script>