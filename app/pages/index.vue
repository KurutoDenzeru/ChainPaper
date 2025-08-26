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

    <!-- Document area removed — placeholder retained for layout -->
    <main class="flex-1 p-6 pb-24 flex items-center justify-center">
      <div class="w-full max-w-3xl text-center text-gray-500">
        <p class="text-lg">Document area removed.</p>
        <p class="text-sm mt-2">The editable page canvases and auto-pagination have been disabled.</p>
      </div>
    </main>

    <StickyFooter :wordCount="wordCount" :pageCount="pageCount" :zoom="zoomPercent" :view="viewMode"
      @set-zoom="onSetZoom" @set-view="onSetView" />

  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, computed, type ComponentPublicInstance } from 'vue'
  import MenuBar from '@/components/layout/MenuBar.vue'
  import EditorToolbar from '@/components/editor/EditorToolbar.vue'
  import StickyFooter from '@/components/layout/StickyFooter.vue'

  // Page state
  const documentTitle = ref('Untitled Document')
  const isDirty = ref(false)
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
    console.log('insert-link')
  }

  function onInsertImage() {
    console.log('insert-image')
  }

  function onInsertTable() {
    console.log('insert-table')
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