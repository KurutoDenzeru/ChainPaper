<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Fixed top area: Menubar + EditorToolbar (both floating) -->
    <div class="fixed inset-x-1 top-1 z-50 pointer-events-none">
      <div ref="menuWrapper" v-show="menuVisible" class="pointer-events-auto">
        <MenuBar :documentTitle="documentTitle" :isDirty="isDirty" :user="user" @select-all="onSelectAll"
          @update-title="onUpdateTitle" @save-document="onSaveDocument" @new-document="onNewDocument"
          @open-document="onOpenDocument" @export-document="onExport" @import-document="onImport" @settings="onSettings"
          @about="onAbout" />
      </div>

      <div ref="toolbarWrapper" :class="[menuVisible ? 'mt-2' : 'mt-0', 'pointer-events-auto']">
        <EditorToolbar :isMenuVisible="menuVisible" @toggle-menubar="toggleMenu" @toggle-sidebar="toggleSidebar"
          @toggle-find="toggleFind" @insert-link="onInsertLink" @insert-image="onInsertImage"
          @insert-table="onInsertTable" />
      </div>
    </div>

    <!-- spacer to keep main content below fixed top controls -->
    <div aria-hidden="true" :style="{ height: topPadding + 'px' }"></div>

    <!-- Document editor canvas: contenteditable center pane -->
    <main class="flex-1 p-6 pb-24 flex items-start justify-center">
      <div class="w-full max-w-4xl">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 min-h-[60vh]">
          <div class="prose max-w-none">
            <div
              ref="editor"
              class="editor-content outline-none min-h-[40vh] text-gray-800"
              :contenteditable="true"
              role="textbox"
              aria-multiline="true"
              @input="onEditorInput"
              @keydown="onEditorKeydown"
              v-html="pages[0] || ''"
            ></div>
          </div>
        </div>
      </div>
    </main>

    <StickyFooter :wordCount="wordCount" :pageCount="pageCount" :zoom="zoomPercent" :view="viewMode"
      @set-zoom="onSetZoom" @set-view="onSetView" />

  </div>
  <div v-if="showProofModal" class="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-md shadow-lg w-11/12 max-w-2xl p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">Document Proofs</h3>
        <button class="text-sm text-gray-500" @click="showProofModal = false">Close</button>
      </div>
      <AuthProofDialog />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, computed, type ComponentPublicInstance } from 'vue'
  import MenuBar from '@/components/layout/MenuBar.vue'
  import EditorToolbar from '@/components/editor/EditorToolbar.vue'
  import AuthProofDialog from '@/components/editor/AuthProofDialog.vue'
  import StickyFooter from '@/components/layout/StickyFooter.vue'
  import useDocument, { exportJSON, createProof, verifyProof } from '@/composables/useDocument'

  // Page state
  const documentTitle = ref('Untitled Document')
  const isDirty = ref(false)
  const { title, pages, isDirty: docDirty } = useDocument()
  const user = ref({ name: 'Demo User', email: undefined, avatar: undefined })
  // pagination and content state
  const pageContents = ref<string[]>([''])
  // refs to the page DOM elements so we can measure overflow and focus next page
  const pageEls = ref<Array<HTMLElement | null>>([])
  // index of the last focused page element
  const lastFocusedPage = ref<number | null>(null)

  // view and zoom state
  const viewMode = ref<'list' | 'grid'>('list')
  const zoomPercent = ref<number>(100) // 100 == 1.0 scale

  const wordCount = ref(0)
  const pageCount = ref(1)

  const WORDS_PER_PAGE = 300

  function computeCountsFromAllPages() {
    const allText = pageContents.value.join('\n')
    const words = allText.trim().match(/\S+/g)
    const wc = words ? words.length : 0
    wordCount.value = wc
    pageCount.value = Math.max(1, Math.ceil(wc / WORDS_PER_PAGE))
  }

  function distributeTextToPages(fullText: string) {
    const words = fullText.trim().split(/\s+/).filter(Boolean)
    const pages: string[] = []
    for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
      pages.push(words.slice(i, i + WORDS_PER_PAGE).join(' '))
    }
    if (pages.length === 0) pages.push('')
    pageContents.value = pages
  }

  function onSelectAll() {
    // select contents of the last focused page, or the first page if none
    const idx = lastFocusedPage.value ?? 0
    const node = pageEls.value[idx]
    if (node) {
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(node)
      sel?.removeAllRanges()
      sel?.addRange(range)
      node.focus()
    }
  }

  function formatPageHtml(content: string) {
    // basic HTML-escapes for safety, preserve simple line breaks
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>')
    return escaped || '<p><br></p>'
  }

  // no single-page navigation — pages are scrollable like a document

  // Handlers for menubar events
  function onUpdateTitle(newTitle: string) {
    documentTitle.value = newTitle
    title.value = newTitle
    isDirty.value = true
    docDirty.value = true
  }

  function onSaveDocument() {
    // simple save simulation
    console.log('save-document fired — implement persistence')
    isDirty.value = false
  }

  function onNewDocument() {
    documentTitle.value = 'Untitled Document'
    // Reset page contents and clear any existing page DOM content (we manage pages via pageContents/pageEls)
    pageContents.value = ['']
    nextTick(() => {
      pageEls.value.forEach((el) => {
        if (el) el.innerText = ''
      })
      computeCountsFromAllPages()
    })
    isDirty.value = false
  }

  function onOpenDocument() {
    console.log('open-document fired')
  }

  function onExport(format: string) {
    // support 'json' export for now
    console.log('export-document', format)
    if (format === 'json') {
      exportJSON().then(({ obj, str }) => {
        const blob = new Blob([str], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = (documentTitle.value || 'document') + '.chainpaper.json'
        a.click()
        URL.revokeObjectURL(url)
      })
    }
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

  // Menubar visible and measuring refs for sticky top area
  const menuVisible = ref(true)
  const menuWrapper = ref<HTMLElement | null>(null)
  const toolbarWrapper = ref<HTMLElement | null>(null)
  const topPadding = ref<number>(0)

  const updateTopPadding = async () => {
    await nextTick()
    const m = menuWrapper.value
    const t = toolbarWrapper.value
    const mh = m && m.offsetHeight ? m.offsetHeight : 0
    const th = t && t.offsetHeight ? t.offsetHeight : 0
    // add a small gap so content isn't flush
    topPadding.value = mh + th + 16
  }

  function toggleMenu() {
    menuVisible.value = !menuVisible.value
    // recompute padding after DOM updates
    updateTopPadding()
  }

  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
    console.log('toggle-sidebar ->', sidebarVisible.value)
  }

  function toggleFind() {
    findVisible.value = !findVisible.value
    console.log('toggle-find ->', findVisible.value)
  }

  function onInsertLink() {
    const url = prompt('Enter URL')
    if (url) {
      document.execCommand('createLink', false, url)
      onEditorInput(new Event('input'))
    }
  }

  function onInsertImage() {
    const url = prompt('Enter image URL')
    if (url) {
      document.execCommand('insertImage', false, url)
      onEditorInput(new Event('input'))
    }
  }

  function onInsertTable() {
    // simple 2x2 table insertion
    const tableHtml = '<table class="min-w-full border-collapse"><tr><td class="border p-2"> </td><td class="border p-2"> </td></tr><tr><td class="border p-2"> </td><td class="border p-2"> </td></tr></table>'
    document.execCommand('insertHTML', false, tableHtml)
    onEditorInput(new Event('input'))
  }

  function toggleBold() { applyFormat('bold') }
  function toggleItalic() { applyFormat('italic') }
  function toggleUnderline() { applyFormat('underline') }
  function toggleStrikethrough() { applyFormat('strikeThrough') }
  function toggleBulletList() { applyFormat('insertUnorderedList') }
  function toggleOrderedList() { applyFormat('insertOrderedList') }

  // Editor element and basic editing handlers
  const editor = ref<HTMLElement | null>(null)

  function onEditorInput(e: Event) {
    const html = editor.value?.innerHTML || ''
    // update the first page content for now
    pages.value[0] = html
    pageContents.value = [html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()]
    computeCountsFromAllPages()
    isDirty.value = true
    docDirty.value = true
  }

  function onEditorKeydown(e: Event) {
    const ev = e as KeyboardEvent
    // simple handling: Ctrl/Cmd+B/I/U map to formatting
    const isMod = ev.metaKey || ev.ctrlKey
    if (!isMod) return
    const k = ev.key?.toLowerCase()
    if (k === 'b') {
      ev.preventDefault()
      document.execCommand('bold')
      return
    }
    if (k === 'i') {
      ev.preventDefault()
      document.execCommand('italic')
      return
    }
    if (k === 'u') {
      ev.preventDefault()
      document.execCommand('underline')
      return
    }
  }

  // Wire format events from toolbar/menubar to execCommand
  function applyFormat(command: string, value?: string) {
    try {
      document.execCommand(command, false, value)
      onEditorInput(new InputEvent('input'))
    } catch (e) {
      console.warn('format not supported', command, e)
    }
  }

  // Listen to toolbar/menu emits
  // format actions
  const stopListen = [] as Array<() => void>
  // use a small tick to attach global listeners via DOM events from SFC emits
  onMounted(() => {
    // listen to window events emitted by MenuBar or EditorToolbar via $emit -> parent handlers
    // the components already emit typed events which our template handlers call; we wire here by patching
    // For demonstration, override global document-level custom events (if used)
  })

  // Proof modal
  const showProofModal = ref(false)

  async function onGenerateProof() {
    // open modal which allows generating/inspecting proof
    showProofModal.value = true
  }

  async function onVerifyAuthorship() {
    // open modal to verify proof
    showProofModal.value = true
  }

  function onSetZoom(level: number) {
    // level is decimal (1.0 = 100%)
    zoomPercent.value = Math.round((level || 1) * 100)
    console.log('set-zoom ->', level, '=>', zoomPercent.value)
  }

  function onSetView(v: 'list' | 'grid') {
    viewMode.value = v
    // when switching to grid and zoom is small, pages will naturally wrap via CSS
    console.log('set-view ->', v)
  }

  // initialise counts on mount
  onMounted(async () => {
    await nextTick()
    // initialize with empty pages; placeholder text shown via CSS when empty
    distributeTextToPages('')
    computeCountsFromAllPages()
    // compute top padding for fixed menubar + toolbar
    updateTopPadding()
    // update on window resize
    window.addEventListener('resize', updateTopPadding)
  })
</script>

