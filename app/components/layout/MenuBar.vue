<template>
  <Menubar class="px-2 sm:px-4 py-9 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600">
    <div class="flex flex-row items-start w-full">
      <!-- Left Side: Brand Icon (spans two rows) -->
      <div class="flex flex-col items-center justify-start mr-3">
        <NuxtImg src="/Palimphest.png" alt="ChainPaper Logo" loading="eager"
          class="w-18 h-18 flex items-center justify-center" />
      </div>
      <!-- Right Side: Two rows -->
      <div class="flex flex-col self-center flex-1">
        <!-- First Row: Document Title Input -->
        <div class="flex items-center gap-2 mb-1">
          <div v-if="!isEditingTitle" @click="startEditingTitle"
            class="flex items-center gap-2 px-3 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <span class="text-lg text-gray-900 font-medium -ml-2">{{ documentTitle || 'Untitled Document' }}</span>
            <Edit3 class="w-4 h-4 text-gray-600" />
            <span v-if="isDirty" class="text-orange-500">•</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <Input ref="titleInput" v-model="editingTitle" @blur="saveTitle" @keyup.enter="saveTitle"
              @keyup.escape="cancelEdit" class="text-lg bg-transparent border-2 rounded-md outline-none px-1 min-w-48"
              :placeholder="'Untitled Document'" />
            <!-- <Edit3 class="w-4 h-4 text-blue-500" /> -->
          </div>
        </div>
        <!-- Second Row: Menu Items (rendered from composable) -->
        <div class="flex items-center gap-1">
          <template v-for="(menu, mi) in menus" :key="menu.label + mi">
            <MenubarMenu>
              <MenubarTrigger>{{ menu.label }}</MenubarTrigger>
              <MenubarContent>
                <template v-for="(item, idx) in menu.items" :key="menu.label + '-' + idx">
                  <MenubarSeparator v-if="item.type === 'separator'" />

                  <MenubarCheckboxItem v-else-if="item.type === 'checkbox'" v-model:checked="getBinding(item).value"
                    class="flex items-center gap-2">
                    <component :is="getIcon(item)" class="w-4 h-4 text-gray-600" v-if="getIcon(item)" />
                    {{ item.label }}
                  </MenubarCheckboxItem>

                  <MenubarSub v-else-if="item.type === 'sub'">
                    <MenubarSubTrigger class="flex items-center gap-2">
                      <component :is="item.icon" class="w-4 h-4 text-gray-600" v-if="item.icon" />
                      {{ item.label }}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem v-for="(sub, sidx) in item.items" :key="menu.label + '-sub-' + sidx"
                        @click="handleMenuEmit(sub)" class="flex items-center gap-2">
                        <component :is="getIcon(sub)" class="w-4 h-4 text-gray-600" v-if="getIcon(sub)" />
                        {{ sub.label }}
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem v-else class="flex items-center justify-between min-w-[250px]"
                    :disabled="isDisabled(item)" @click="handleMenuEmit(item)">
                    <div class="flex items-center gap-2">
                      <component :is="getIcon(item)" class="w-4 h-4 text-gray-600" v-if="getIcon(item)" />
                      {{ item.label }}
                    </div>

                    <MenubarShortcut v-if="getShortcut(item)">
                      <div class="flex items-center">
                        <template v-if="isMac && getShortcut(item)?.mac">
                          <div class="flex items-center mr-1">
                            <template v-for="(mod, i) in getShortcut(item).mac" :key="i">
                              <span v-if="mod === 'Command'"
                                class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs mr-1">
                                <Command class="w-3 h-3 text-gray-600" />
                              </span>
                              <span v-else
                                class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs mr-1">{{
                                mod }}</span>
                            </template>
                          </div>
                          <span v-if="getShortcut(item)?.key" class="text-xs mr-1">+</span>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">{{
                            getShortcut(item)?.key }}</span>
                        </template>
                        <template v-else>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-100 text-xs font-medium mr-1">{{
                              getShortcut(item)?.pc || getShortcut(item)?.key || 'Ctrl' }}</span>
                          <span v-if="getShortcut(item)?.key" class="text-xs mr-1">+</span>
                          <span
                            class="inline-flex items-center justify-center aspect-square w-6 rounded bg-gray-200 text-xs font-semibold">{{
                            getShortcut(item)?.key }}</span>
                        </template>
                      </div>
                    </MenubarShortcut>
                  </MenubarItem>
                </template>
              </MenubarContent>
            </MenubarMenu>
          </template>
        </div>
      </div>
    </div>
  </Menubar>
</template>

<script setup lang="ts">
  import { ref, defineEmits, defineProps, nextTick, onMounted } from 'vue'
  import { Edit3, Command } from 'lucide-vue-next'
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from '@/components/ui/menubar'
  import useMenuData from '@/composables/useMenuData'

  const props = defineProps<{
    documentTitle: string
    isDirty: boolean
    user: {
      name: string
      email?: string
      avatar?: string
    }
  }>()

  // typed emits (call-signature overloads) for SFC: list events emitted by this component
  const emit = defineEmits<
    {
      (e: 'update-title', title: string): void
      (e: 'new-document'): void
      (e: 'open-document'): void
      (e: 'save-document'): void
      (e: 'import-document'): void
      (e: 'undo'): void
      (e: 'redo'): void
      (e: 'cut'): void
      (e: 'copy'): void
      (e: 'paste'): void
      (e: 'select-all'): void
      (e: 'toggle-find'): void
      (e: 'toggle-sidebar'): void
      (e: 'set-zoom', level: number | 'fit'): void
      (e: 'insert-table'): void
      (e: 'insert-image'): void
      (e: 'insert-link'): void
      (e: 'insert-code-block'): void
      (e: 'insert-math'): void
      (e: 'insert-date'): void
      (e: 'insert-page-break'): void
      (e: 'format-bold'): void
      (e: 'format-italic'): void
      (e: 'format-underline'): void
      (e: 'set-heading', level: number): void
      (e: 'set-paragraph'): void
      (e: 'set-blockquote'): void
      (e: 'toggle-bullet-list'): void
      (e: 'toggle-ordered-list'): void
      (e: 'spell-check'): void
      (e: 'word-count'): void
      (e: 'verify-authorship'): void
      (e: 'generate-proof'): void
      (e: 'show-shortcuts'): void
    }
  >()

  // View state
  const showToolbar = ref(true)
  const showStatusBar = ref(true)
  // removed typewriterMode and focusMode per request

  // import menu definitions (data-driven)
  const { menus } = useMenuData()

  // bindings for checkbox menu items (referenced by name in menu data)
  const bindings: Record<string, { value: any }> = {
    showToolbar: { value: showToolbar },
    showStatusBar: { value: showStatusBar },
    // typewriterMode and focusMode removed
  }

  // Generic emitter for menu items defined in the composable
  function handleMenuEmit(item: any) {
    if (!item) return
    if (!item.emit) return
    // preserve original behavior for documentation which opened a new window
    if (item.emit === 'show-documentation') {
      showDocumentation()
      return
    }
    // Special handling for zoom menu: convert percent to decimal
    if (item.emit === 'set-zoom' && item.payload !== undefined) {
      if (item.payload === 'fit') {
        emit('set-zoom', 'fit')
      } else if (typeof item.payload === 'number') {
        emit('set-zoom', item.payload)
      } else {
        emit('set-zoom', item.payload)
      }
      return
    }
    if (item.payload !== undefined) emit(item.emit as any, item.payload)
    else emit(item.emit as any)
  }

  function isDisabled(item: any) {
    if (!item || !item.disabledProp) return false
    if (item.disabledProp === 'isDirty') return !props.isDirty
    return false
  }

  function getBinding(item: any) {
    if (!item || !item.bind) return { value: false }
    return bindings[item.bind] ?? { value: false }
  }

  // safe accessor for menu item shortcuts to satisfy TS template type-checking
  function getShortcut(item: any) {
    return (item as any).shortcut
  }

  function getIcon(item: any) {
    return item && (item as any).icon ? (item as any).icon : null
  }

  // Title editing state
  const isEditingTitle = ref(false)
  const editingTitle = ref('')
  const titleInput = ref<HTMLInputElement | null>(null)

  // detect platform on client to show correct modifier icon in shortcuts
  const isMac = ref(false)
  onMounted(() => {
    try {
      isMac.value = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
    } catch (e) {
      isMac.value = false
    }
  })

  // Title editing functions
  async function startEditingTitle() {
    isEditingTitle.value = true
    editingTitle.value = props.documentTitle || 'Untitled Document'
    await nextTick()
    titleInput.value?.focus()
    titleInput.value?.select()
  }

  function saveTitle() {
    if (editingTitle.value.trim()) {
      emit('update-title', editingTitle.value.trim())
    } else {
      emit('update-title', 'Untitled Document')
    }
    isEditingTitle.value = false
  }

  function cancelEdit() {
    isEditingTitle.value = false
    editingTitle.value = props.documentTitle || 'Untitled Document'
  }

  // Editor actions emit events for parent to handle (use typed `emit` above)

  function handleUndo() {
    emit('undo')
  }

  function handleRedo() {
    emit('redo')
  }

  function handleCut() {
    emit('cut')
  }

  function handleCopy() {
    emit('copy')
  }

  function handlePaste() {
    emit('paste')
  }

  function handleSelectAll() {
    emit('select-all')
  }

  function handleFind() {
    emit('toggle-find')
  }

  function toggleSidebar() {
    emit('toggle-sidebar')
  }

  function setZoom(level: number) {
    emit('set-zoom', level)
  }

  // Insert actions

  function insertTable() {
    emit('insert-table')
  }

  function insertImage() {
    emit('insert-image')
  }

  function insertLink() {
    emit('insert-link')
  }

  function insertCodeBlock() {
    emit('insert-code-block')
  }

  function insertMath() {
    emit('insert-math')
  }

  function insertDate() {
    emit('insert-date')
  }

  function insertPageBreak() {
    emit('insert-page-break')
  }

  // Format actions
  function toggleBold() {
    emit('format-bold')
  }

  function toggleItalic() {
    emit('format-italic')
  }

  function toggleUnderline() {
    emit('format-underline')
  }

  function setHeading(level: number) {
    emit('set-heading', level)
  }

  function setParagraph() {
    emit('set-paragraph')
  }

  function setBlockquote() {
    emit('set-blockquote')
  }

  function toggleBulletList() {
    emit('toggle-bullet-list')
  }

  function toggleOrderedList() {
    emit('toggle-ordered-list')
  }

  // Tool actions
  function spellCheck() {
    emit('spell-check')
  }

  function wordCount() {
    emit('word-count')
  }

  function verifyAuthorship() {
    emit('verify-authorship')
  }

  function generateProof() {
    emit('generate-proof')
  }

  function showKeyboardShortcuts() {
    emit('show-shortcuts')
  }

  function showDocumentation() {
    // keep original behavior to open docs
    window.open('https://github.com/KurutoDenzeru/ChainPaper/blob/master/README.md', '_blank')
  }
</script>
