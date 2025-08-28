<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="fixed inset-x-1 top-1 z-50 pointer-events-none">
      <div class="pointer-events-auto">
        <MarkdownMenuBar @word-count="showWordDialog=true" />
      </div>
      <div class="mt-2 pointer-events-auto">
        <MarkdownToolbar
          :zoom="zoom"
          :canUndo="canUndo"
          :canRedo="canRedo"
          :mode="mode"
          @undo="onUndo"
          @redo="onRedo"
          @format-bold="applyAround('**')"
          @format-italic="applyAround('*')"
          @format-underline="applyAround('__')"
          @format-strikethrough="applyAround('~~')"
          @toggle-bullet-list="toggleList('- ')"
          @toggle-ordered-list="toggleList('1. ')"
          @insert-link="insertLink"
          @insert-image="insertImage"
          @insert-code-block="insertCodeBlockBlock"
          @insert-table="insertTable"
          @set-heading="setHeading"
          @set-alignment="setAlignmentComment"
          @set-zoom="setZoom"
          @set-text-color="applyColor"
          @set-highlight="applyHighlight"
          @update:mode="v=>mode=v"
        />
      </div>
    </div>
    <div :style="{ height: topPad + 'px' }" aria-hidden="true" />
    <main class="flex-1 p-6 pb-24 flex items-start justify-center">
      <div class="w-full flex justify-center">
        <!-- viewport with scroll/pinch handling -->
        <div ref="pageViewport" class="overflow-auto w-full flex justify-center" style="max-width: 100%;">
          <!-- inner page that is scaled via transform; size = Letter 8.5in x 11in -->
          <div ref="pageInner" :style="pageInnerStyle" class="bg-white border border-gray-200 rounded-lg shadow-sm m-6">
            <div class="w-full h-full">
              <textarea v-if="mode==='source'" ref="textareaEl" v-model="content" class="w-full h-full outline-none resize-none font-mono text-sm p-6" placeholder="Write Markdown..." @input="recount" />
              <div v-else class="prose max-w-none overflow-auto h-full p-6" v-html="renderedHtml" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <MarkdownFooter :wordCount="wordCount" :zoom="zoom" @set-zoom="setZoom" @word-count="showWordDialog=true" />
  <MarkdownWordCountDialog :open="showWordDialog" :stats="stats" @update:open="v=>showWordDialog=v" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import MarkdownMenuBar from '@/components/markdown/layout/MarkdownMenuBar.vue'
import MarkdownToolbar from '@/components/markdown/editor/MarkdownToolbar.vue'
import MarkdownFooter from '@/components/markdown/layout/MarkdownFooter.vue'
import MarkdownWordCountDialog from '@/components/markdown/dialogs/MarkdownWordCountDialog.vue'
// lazy load markdown-it to avoid SSR type resolution issues
let MarkdownIt: any
if (typeof window !== 'undefined') {
  // @ts-ignore - shim declared, but resolver may still complain during dev
  import('markdown-it').then(m => { MarkdownIt = (m as any).default || m })
}
import { useMarkdownDocStore } from '@/stores/markdownDoc'
import WordCountDialog from '@/components/editor/WordCountDialog.vue'

const store = useMarkdownDocStore()
const { content, canUndo, canRedo } = storeToRefs(store)

const wordCount = ref(0)
const zoom = ref(100)
const topPad = ref(140)
const showWordDialog = ref(false)
const mode = ref<'source' | 'reader'>('source')

// page dimensions (Letter) at 96 DPI: 8.5in * 96 = 816px, 11in * 96 = 1056px
const DPI = 96
const PAGE_WIDTH_PX = Math.round(8.5 * DPI)
const PAGE_HEIGHT_PX = Math.round(11 * DPI)

const pageViewport = ref<HTMLElement | null>(null)
const pageInner = ref<HTMLElement | null>(null)

const pageInnerStyle = computed(() => ({
  width: PAGE_WIDTH_PX + 'px',
  height: PAGE_HEIGHT_PX + 'px',
  transformOrigin: 'top left',
  transform: `scale(${zoom.value/100})`,
}))

// wheel + ctrl/command zoom
function onWheel(e: WheelEvent){
  if (!(e.ctrlKey || e.metaKey)) return
  e.preventDefault()
  const delta = e.deltaY < 0 ? 10 : -10
  const next = Math.min(200, Math.max(50, zoom.value + delta))
  zoom.value = next
}

onMounted(()=>{
  // attach listener to viewport
  if (pageViewport.value) pageViewport.value.addEventListener('wheel', onWheel, { passive: false })
})

onUnmounted(()=>{
  if (pageViewport.value) pageViewport.value.removeEventListener('wheel', onWheel)
})

function recount(){
  const words = content.value.trim().match(/\S+/g)
  wordCount.value = words? words.length: 0
}

watch(content, recount, { immediate: true })

function setZoom(z: number | 'fit'){
  if (z === 'fit') {
    // optional: compute fit based on container width later; for now treat as 100%
    zoom.value = 100
    return
  }
  // Toolbar/footer now emit percent integers (e.g. 125)
  if (typeof z === 'number') {
    zoom.value = Math.min(200, Math.max(50, Math.round(z)))
  }
}

// --- Formatting helpers ---
function getSelection(el: HTMLTextAreaElement){ return { start: el.selectionStart, end: el.selectionEnd, value: el.value } }
function replaceRange(el: HTMLTextAreaElement, start: number, end: number, insert: string){
  const before = el.value.slice(0,start)
  const after = el.value.slice(end)
  const next = before + insert + after
  store.setContent(next)
  nextTick(()=>{ el.focus(); el.selectionStart = el.selectionEnd = start + insert.length })
  recount()
}

function applyAround(token: string){
  return () => {
    const ta = textareaEl.value
    if(!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start,end)
    replaceRange(ta, start, end, token + selected + token)
  }
}

function toggleList(prefix: string){
  return () => {
    const ta = textareaEl.value
    if(!ta) return
    const { start, end, value } = getSelection(ta)
    // expand to full lines
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd
    const segment = value.slice(lineStart, actualEnd)
    const lines = segment.split(/\n/)
    const allHave = lines.every(l=> l.startsWith(prefix))
    const updated = lines.map(l=> allHave ? l.replace(/^\Q"+prefix+"\E/,'').replace(new RegExp('^'+prefix.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),'') : (l.startsWith(prefix)? l : prefix + l)).join('\n')
    replaceRange(ta, lineStart, actualEnd, updated)
  }
}

function setHeading(level:number){
  const ta = textareaEl.value; if(!ta) return
  const { start, end, value } = getSelection(ta)
  const lineStart = value.lastIndexOf('\n', start -1) + 1
  const lineEnd = value.indexOf('\n', end)
  const actualEnd = lineEnd === -1 ? value.length : lineEnd
  const line = value.slice(lineStart, actualEnd).replace(/^#{1,6}\s+/,'')
  const prefix = level>0 ? '#'.repeat(level)+' ' : ''
  replaceRange(ta, lineStart, actualEnd, prefix + line)
}

function setAlignmentComment(alignment: string){
  // No native markdown alignment; insert an HTML comment marker
  const ta = textareaEl.value; if(!ta) return
  const marker = `<!-- align:${alignment} -->\n`
  const { start, end } = getSelection(ta)
  replaceRange(ta, start, end, marker)
}

function insertLink(){
  const ta = textareaEl.value; if(!ta) return
  const { start, end, value } = getSelection(ta)
  const selected = value.slice(start,end) || 'text'
  replaceRange(ta, start, end, `[${selected}](https://example.com)`)
}
function insertImage(){
  const ta = textareaEl.value; if(!ta) return
  const { start, end } = getSelection(ta)
  replaceRange(ta, start, end, `![alt text](https://placehold.co/400x200)`)
}
function insertCodeBlockBlock(){
  const ta = textareaEl.value; if(!ta) return
  const { start, end } = getSelection(ta)
  const snippet = "```ts\n// code\n```\n"
  replaceRange(ta, start, end, snippet)
}
function insertTable(rows:number=2, cols:number=2, header:boolean=true){
  const ta = textareaEl.value; if(!ta) return
  const headerRow = '|' + Array(cols).fill(' Header ').join('|') + '|\n'
  const sepRow = '|' + Array(cols).fill(' --- ').join('|') + '|\n'
  const body = Array(rows).fill('|' + Array(cols).fill(' Cell ').join('|') + '|\n').join('')
  const table = (header? headerRow + sepRow : '') + body + '\n'
  const { start, end } = getSelection(ta)
  replaceRange(ta, start, end, table)
}

// Inline color via HTML span (markdown fallback) & highlight background
function surroundWithHtml(tagOpen: string, tagClose: string){
  const ta = textareaEl.value; if(!ta) return
  const { start, end, value } = getSelection(ta)
  const selected = value.slice(start,end) || 'text'
  replaceRange(ta, start, end, tagOpen + selected + tagClose)
}
function applyColor(color: string){ surroundWithHtml(`<span style=\"color:${color}\">`, '</span>') }
function applyHighlight(color: string){ surroundWithHtml(`<span style=\"background:${color}\">`, '</span>') }

function onUndo(){ store.undo(); recount() }
function onRedo(){ store.redo(); recount() }

const textareaEl = ref<HTMLTextAreaElement | null>(null)

const stats = computed(()=>({
  charsWithSpaces: content.value.length,
  charsNoSpaces: content.value.replace(/\s+/g,'').length,
  words: wordCount.value,
  sentences: (content.value.match(/[.!?]+/g)||[]).length,
  paragraphs: content.value.split(/\n{2,}|\n/).filter(Boolean).length,
  readingMinutes: Math.max(1, Math.round(wordCount.value/200)),
  pages: 1,
  lines: content.value.split(/\n/).length,
  avgWordsPerParagraph: (()=>{ const p = content.value.split(/\n{2,}|\n/).filter(Boolean); return p.length? Math.round(wordCount.value/p.length): wordCount.value })()
}))

// markdown renderer
const renderedHtml = computed(()=> {
  if (mode.value !== 'reader') return ''
  if (!MarkdownIt) return '<p class="text-gray-400 text-sm">Loading renderer...</p>'
  const md = new MarkdownIt({ html: true, linkify: true, breaks: true })
  try { return md.render(content.value) } catch { return '<pre class="text-red-600">Render error</pre>' }
})

onMounted(()=>{ textareaEl.value = document.querySelector('textarea') })

</script>
