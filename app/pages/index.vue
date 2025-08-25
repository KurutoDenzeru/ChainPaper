<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Fixed top area: Menubar + EditorToolbar (both floating) -->
    <div class="fixed inset-x-4 top-2 z-50 pointer-events-none">
      <div ref="menuWrapper" v-show="menuVisible" class="pointer-events-auto">
        <MenuBar
          :documentTitle="documentTitle"
          :isDirty="isDirty"
          :user="user"
          @select-all="onSelectAll"
          @update-title="onUpdateTitle"
          @save-document="onSaveDocument"
          @new-document="onNewDocument"
          @open-document="onOpenDocument"
          @export-document="onExport"
          @import-document="onImport"
          @settings="onSettings"
          @about="onAbout"
        />
      </div>

  <div ref="toolbarWrapper" :class="[menuVisible ? 'mt-2' : 'mt-0', 'pointer-events-auto']">
        <EditorToolbar
          :isMenuVisible="menuVisible"
          @toggle-menubar="toggleMenu"
          @toggle-sidebar="toggleSidebar"
          @toggle-find="toggleFind"
          @insert-link="onInsertLink"
          @insert-image="onInsertImage"
          @insert-table="onInsertTable"
        />
      </div>
    </div>

  <!-- spacer to keep main content below fixed top controls -->
  <div aria-hidden="true" :style="{ height: topPadding + 'px' }"></div>

  <!-- Document pages area: multiple Letter-sized canvases (scrollable) -->
  <main class="flex-1 overflow-auto p-6 pb-24">
      <!-- container switches layout based on viewMode -->
      <div :class="['w-full', viewMode === 'grid' ? 'pages-grid' : 'flex flex-col items-center gap-6']">
        <div v-for="(content, idx) in pageContents" :key="idx" :class="['page-wrapper', viewMode === 'grid' ? 'grid-item' : '']">
          <div
            :ref="el => setPageEl(el, idx)"
            class="page bg-white border border-gray-200 shadow-sm"
            :contenteditable="true"
            @input="onPageInput(idx, $event)"
            role="textbox"
            aria-label="Document page"
            :style="pageStyle"
          ></div>
        </div>
      </div>
    </main>

  <StickyFooter
    :wordCount="wordCount"
    :pageCount="pageCount"
    :zoom="zoomPercent"
    :view="viewMode"
    @set-zoom="onSetZoom"
    @set-view="onSetView"
  />

  </div >
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

// computed inline style for pages to apply zoom scaling
const PAGE_WIDTH = 816
const PAGE_HEIGHT = 1056
const pageStyle = computed(() => {
  const scale = zoomPercent.value / 100
  // in grid mode, also set explicit width/height so wrapping accounts for scaled size
  if (viewMode.value === 'grid') {
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${Math.round(PAGE_WIDTH * scale)}px`,
      height: `${Math.round(PAGE_HEIGHT * scale)}px`
    }
  }
  // list mode: center and preserve natural width but visually scale
  return { transform: `scale(${scale})`, transformOrigin: 'top center' }
})

function setPageEl(el: Element | ComponentPublicInstance | null, idx: number) {
  // normalize possible component instance to its root element
  let htmlEl: HTMLElement | null = null
  if (!el) {
    htmlEl = null
  } else if ((el as ComponentPublicInstance & { $el?: Element }).$el) {
    htmlEl = ((el as ComponentPublicInstance & { $el?: Element }).$el as HTMLElement) || null
  } else {
    htmlEl = el as HTMLElement
  }

  pageEls.value[idx] = htmlEl

  // ensure the element shows initial content without re-rendering while typing
  if (htmlEl && pageContents.value[idx] !== undefined) {
    // only set innerText initially if empty
    if (!htmlEl.innerText || htmlEl.innerText.trim() === '') {
      htmlEl.innerText = pageContents.value[idx]
    }
  }
  // attach keydown for selection behaviors and focus tracking
  if (htmlEl) {
    htmlEl.addEventListener('focus', () => {
      lastFocusedPage.value = idx
    })
    // use Event in the signature and narrow to KeyboardEvent inside to satisfy DOM types
    htmlEl.addEventListener('keydown', (ev: Event) => {
      const kev = ev as KeyboardEvent
      // intercept Cmd/Ctrl+A to select only this page
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const modifier = isMac ? kev.metaKey : kev.ctrlKey
      if (modifier && kev.key.toLowerCase() === 'a') {
        kev.preventDefault()
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(htmlEl as HTMLElement)
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    })
  }
}
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

function updateCounts() {
  computeCountsFromAllPages()
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

function onPageInput(idx: number, event: Event) {
  const el = event.target as HTMLElement
  const text = el.innerText || ''
  // update specific page content
  pageContents.value[idx] = text

  const all = pageContents.value.join('\n')
  const words = all.trim().split(/\s+/).filter(Boolean)

  // detect overflow of this element
  const isOverflowing = el.scrollHeight > el.clientHeight + 2

  if (isOverflowing || words.length > WORDS_PER_PAGE * pageContents.value.length) {
    // redistribute words across pages
    distributeTextToPages(all)
    // after DOM updates, ensure each page element has the correct initial innerText
    nextTick(() => {
      pageContents.value.forEach((p, i) => {
        const node = pageEls.value[i]
        if (node) node.innerText = p
      })
      // focus the next page after the one that overflowed
      const nextIdx = Math.min(pageContents.value.length - 1, idx + 1)
      const nextEl = pageEls.value[nextIdx]
      if (nextEl) {
        nextEl.focus()
        try {
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(nextEl)
          range.collapse(true)
          sel?.removeAllRanges()
          sel?.addRange(range)
        } catch (e) {}
      }
      computeCountsFromAllPages()
    })
    return
  }

  computeCountsFromAllPages()
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

<style scoped>
/* Letter size: 8.5in x 11in at 96dpi -> convert to px approximately 816px x 1056px */
.page-wrapper { width: 100%; display:flex; justify-content:center; }
.page { width: 816px; height: 1056px; padding: 32px; box-sizing: border-box; overflow: hidden; border-radius: 4px; }
@media (max-width: 900px) {
  /* scale down on small screens */
  .page { width: calc(100% - 32px); height: auto; min-height: 600px; overflow: visible; }
}

/* placeholder when page is empty */
.page:empty::before {
  content: 'Start writing here...';
  color: rgba(107, 114, 128, 0.7); /* gray-500 */
  pointer-events: none;
}

/* Grid mode: show pages in a responsive wrapping grid. Items will wrap as zoom changes. */
.pages-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 12px;
}
.pages-grid .grid-item { display: block; }
.pages-grid .grid-item .page {
  /* remove fixed width/height so computed inline styles control dimensions when scaled */
  width: auto;
  height: auto;
  box-sizing: content-box;
}
</style>