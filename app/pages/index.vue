<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="fixed inset-x-1 top-1 z-50 pointer-events-none">
      <div class="pointer-events-auto">
        <MarkdownMenuBar @word-count="showWordDialog = true" @insert-link="insertLink" @insert-image="insertImage"
          @insert-table="insertTable" @set-heading="handleSetHeading" @insert-code-block="insertCodeBlockBlock"
          @insert-math="insertMath" @insert-mathblock="insertMathblock" @insert-horizontal-line="insertHorizontalLine"
          @insert-footnote="insertFootnote" @insert-emoji="insertEmoji" @set-alignment="setAlignmentComment"
          @format-bold="applyBold" @format-italic="applyItalic" @format-underline="applyUnderline"
          @format-strikethrough="applyStrike" @format-superscript="applySuperscript" @format-subscript="applySubscript"
          @toggle-bullet-list="applyBulletList" @toggle-ordered-list="applyOrderedList"
          @toggle-blockquote="applyBlockquote" @indent="applyIndent" @unindent="applyUnindent" @undo="onUndo"
          @redo="onRedo" @set-text-color="applyColor" @set-highlight="applyHighlight" />
      </div>
      <div class="mt-2 pointer-events-auto">
        <MarkdownToolbar :zoom="zoom" :canUndo="canUndo" :canRedo="canRedo" :mode="mode" @undo="onUndo" @redo="onRedo"
          @format-bold="applyBold" @format-italic="applyItalic" @format-underline="applyUnderline"
          @format-strikethrough="applyStrike" @format-superscript="applySuperscript" @format-subscript="applySubscript"
          @toggle-bullet-list="applyBulletList" @toggle-ordered-list="applyOrderedList"
          @toggle-blockquote="applyBlockquote" @indent="applyIndent" @unindent="applyUnindent" @insert-link="insertLink"
          @insert-image="insertImage" @insert-code-block="insertCodeBlockBlock" @insert-math="insertMath"
          @insert-mathblock="insertMathblock" @insert-horizontal-line="insertHorizontalLine"
          @insert-footnote="insertFootnote" @insert-emoji="insertEmoji" @insert-table="insertTable"
          @set-heading="handleSetHeading" @set-alignment="setAlignmentComment" @set-zoom="setZoom"
          @set-text-color="applyColor" @set-highlight="applyHighlight" @update:mode="v => mode = v" />
      </div>
    </div>
    <div :style="{ height: topPad + 'px' }" aria-hidden="true" />
    <main class="flex-1 p-6 pb-24 flex items-center justify-center">
      <div class="w-full flex justify-center items-center">
        <!-- viewport with scroll/pinch handling -->
        <div ref="pageViewport" class="overflow-auto w-full flex justify-center items-center min-h-[60vh]">
          <!-- inner page that is scaled via transform; size = Letter 8.5in x 11in -->
          <div ref="pageInner" :style="pageInnerStyle" class="bg-white border border-gray-200 rounded-lg shadow-sm m-6">
            <div class="w-full h-full">
              <textarea v-if="mode === 'source'" ref="textareaEl" v-model="content"
                class="w-full h-full outline-none resize-none font-mono text-sm p-6" placeholder="Write Markdown..."
                @input="recount" @keydown="handleKeydown" />
              <div v-else
                class="prose prose-gray max-w-none overflow-auto h-full p-6 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base"
                v-html="renderedHtml" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <MarkdownFooter :wordCount="wordCount" :characterCount="stats.charsWithSpaces" :mode="mode" :zoom="zoom"
      @set-zoom="setZoom" @word-count="showWordDialog = true" @toggle-mode="toggleMode" />
    <MarkdownWordCountDialog :open="showWordDialog" :stats="stats" @update:open="v => showWordDialog = v" />
    <LinkInsertDialog :open="linkDialogOpen" :selectedText="linkDialogSelectedText"
      @update:open="v => linkDialogOpen = v" @insert="handleLinkInsert" />
    <ImageInsertDialog :open="imageDialogOpen" @update:open="v => imageDialogOpen = v" @insert="handleImageInsert" />
    <Toaster />
  </div>
</template>
<script setup lang="ts">
  // Initialize SEO and OpenGraph meta tags
  useSeo()

  import ImageInsertDialog from '@/components/editor/ImageInsertDialog.vue'
  const imageDialogOpen = ref(false)

  function handleImageInsert(src: string, name: string, previewDataUri?: string) {
    // Insert markdown image at cursor or selection
    if (mode.value === 'source') {
      const ta = getActiveTextarea(); if (!ta) return
      const { start, end, value } = getSelection(ta)
      // store attachment and insert short reference
      const dataUrl = previewDataUri || src
      const attachName = addAttachment(dataUrl, name)
      const md = `![[${attachName}]]`
      replaceRange(ta, start, end, md)
      return
    }
    // Reader mode: insert image at selection
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const img = document.createElement('img')
    // Use actual preview data if available for immediate rendering in reader mode
    img.src = previewDataUri && previewDataUri.startsWith('data:image/') ? previewDataUri : src
    img.alt = name.replace(/\.[^/.]+$/, '')
    img.className = 'max-w-full rounded shadow'
    range.deleteContents()
    range.insertNode(img)
    range.setStartAfter(img)
    range.collapse(true)
    sel.removeAllRanges(); sel.addRange(range)
    // Also persist the image into the markdown content so it remains after re-render
    try {
      const alt = name.replace(/\.[^/.]+$/, '')
      const dataUrl = previewDataUri || src
      const md = `![$\{alt\}](${dataUrl})`
      // Append with spacing to keep it on its own line
      const next = content.value + '\n\n' + md + '\n'
      store.setContent(next)
      // update reader selection focus (optional)
    } catch (e) {
      console.warn('Failed to persist inserted image to content', e)
    }
  }
  // Handles heading and paragraph formatting from menu/toolbar
  function handleSetHeading(level: number) {
    if (mode.value === 'source') {
      const ta = getActiveTextarea(); if (!ta) return
      const { start, end, value } = getSelection(ta)
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd = value.indexOf('\n', end)
      const actualEnd = lineEnd === -1 ? value.length : lineEnd
      let line = value.slice(lineStart, actualEnd).replace(/^#{1,6}\s+/, '')
      let prefix = level > 0 ? '#'.repeat(level) + ' ' : ''
      // Paragraph: remove heading prefix
      if (level === 0) prefix = ''
      replaceRange(ta, lineStart, actualEnd, prefix + line)
      return
    }
    // Reader mode: wrap selection in heading or paragraph
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const selectedText = sel.toString()
    if (!selectedText) return
    let el
    if (level === 0) {
      el = document.createElement('p')
    } else {
      el = document.createElement('h' + level)
    }
    el.textContent = selectedText
    range.deleteContents()
    range.insertNode(el)
    // Move cursor after inserted element
    range.setStartAfter(el)
    range.collapse(true)
    sel.removeAllRanges(); sel.addRange(range)
  }
  import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import MarkdownMenuBar from '@/components/markdown/layout/MarkdownMenuBar.vue'
  import MarkdownToolbar from '~/components/markdown/layout/MarkdownEditorToolbar.vue'
  import MarkdownFooter from '@/components/markdown/layout/MarkdownStickyFooter.vue'
  import MarkdownWordCountDialog from '@/components/markdown/dialogs/MarkdownWordCountDialog.vue'
  import LinkInsertDialog from '@/components/editor/LinkInsertDialog.vue'
  import { insertLink as domInsertLink } from '@/lib/editor-formatting'
  import { Toaster } from '@/components/ui/sonner'
  import { toast } from 'vue-sonner'
  import 'vue-sonner/style.css'
  // Lazy load markdown-it plugins only when needed
  let MarkdownIt: any
  let katexPlugin: any
  let emojiPlugin: any
  let footnotePlugin: any
  let pluginsLoaded = ref(false)
  let pluginsLoading = ref(false)

  // Global cache to prevent re-loading plugins multiple times
  const pluginCache = {
    MarkdownIt: null as any,
    katexPlugin: null as any,
    emojiPlugin: null as any,
    footnotePlugin: null as any,
    loaded: false
  }

  // Lazy load plugins only when switching to reader mode
  async function loadMarkdownPlugins() {
    if (pluginCache.loaded) {
      // Use cached plugins
      MarkdownIt = pluginCache.MarkdownIt
      katexPlugin = pluginCache.katexPlugin
      emojiPlugin = pluginCache.emojiPlugin
      footnotePlugin = pluginCache.footnotePlugin
      pluginsLoaded.value = true
      return
    }

    if (pluginsLoading.value) return // Already loading

    pluginsLoading.value = true

    try {
      // Load plugins in parallel but only when needed
      const [markdownModule, katexModule, emojiModule, footnoteModule] = await Promise.allSettled([
        // @ts-ignore - module types handled below
        import('markdown-it').catch((e: any) => ({ error: e })),
        // @ts-ignore - plugin types not available
        import('markdown-it-katex').catch((e: any) => ({ error: e })),
        // @ts-ignore - plugin types not available
        import('markdown-it-emoji').catch((e: any) => ({ error: e })),
        // @ts-ignore - plugin types not available
        import('markdown-it-footnote').catch((e: any) => ({ error: e }))
      ])

      // Process results with proper type checking
      if (markdownModule.status === 'fulfilled' && !(markdownModule.value as any).error) {
        MarkdownIt = pluginCache.MarkdownIt = (markdownModule.value as any).default || markdownModule.value
      }

      if (katexModule.status === 'fulfilled' && !(katexModule.value as any).error) {
        katexPlugin = pluginCache.katexPlugin = (katexModule.value as any).default || katexModule.value
      }

      if (emojiModule.status === 'fulfilled' && !(emojiModule.value as any).error) {
        emojiPlugin = pluginCache.emojiPlugin = (emojiModule.value as any).default || emojiModule.value
      }

      if (footnoteModule.status === 'fulfilled' && !(footnoteModule.value as any).error) {
        footnotePlugin = pluginCache.footnotePlugin = (footnoteModule.value as any).default || footnoteModule.value
      }

      pluginCache.loaded = true
      pluginsLoaded.value = true

    } catch (e) {
      console.warn('Failed to load some markdown plugins:', e)
      pluginsLoaded.value = true // Allow rendering with available plugins
    } finally {
      pluginsLoading.value = false
    }
  }
  import { useMarkdownDocStore } from '@/stores/markdownDoc'

  const store = useMarkdownDocStore()
  const { content, canUndo, canRedo } = storeToRefs(store)
  const addAttachment = store.addAttachment
  const getAttachment = store.getAttachment

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
    transformOrigin: 'center center',
    transform: `scale(${zoom.value / 100})`,
  }))

  // wheel + ctrl/command zoom
  function onWheel(e: WheelEvent) {
    if (!(e.ctrlKey || e.metaKey)) return
    e.preventDefault()
    const delta = e.deltaY < 0 ? 10 : -10
    const next = Math.min(200, Math.max(50, zoom.value + delta))
    zoom.value = next
  }

  onMounted(() => {
    // attach listener to viewport
    if (pageViewport.value) pageViewport.value.addEventListener('wheel', onWheel, { passive: false })
    // ensure textareaEl ref is available
    nextTick(() => {
      textareaEl.value = document.querySelector('textarea')
    })

    // Restore saved document if available
    try {
      const savedDoc = localStorage.getItem('chainpaper_current_doc')
      if (savedDoc) {
        const data = JSON.parse(savedDoc)
        // Only restore if the store is in its default state
        if (store.title === 'Untitled Markdown' && !store.content.trim()) {
          store.setTitle(data.title || 'Untitled Markdown')
          store.setContent(data.content || '', false) // Don't push to history
          store.markSaved() // Mark as saved since we just loaded it

          // Show toast notification after a short delay to ensure UI is ready
          setTimeout(() => {
            toast.info('Document restored', {
              description: `Restored "${data.title || 'Untitled'}" from previous session`,
              duration: 3000
            })
          }, 1000)
        }
      }
    } catch (error) {
      console.warn('Could not restore saved document:', error)
    }

    // Preload markdown plugins during idle time for better UX
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Use requestIdleCallback for optimal performance
      window.requestIdleCallback(() => {
        loadMarkdownPlugins()
      }, { timeout: 5000 }) // 5 second timeout fallback
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadMarkdownPlugins()
      }, 2000) // Load after 2 seconds of page load
    }
  })

  onUnmounted(() => {
    if (pageViewport.value) pageViewport.value.removeEventListener('wheel', onWheel)
  })

  function recount() {
    const words = content.value.trim().match(/\S+/g)
    wordCount.value = words ? words.length : 0
  }

  watch(content, recount, { immediate: true })

  function setZoom(z: number | 'fit') {
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
  function getActiveTextarea(): HTMLTextAreaElement | null {
    // Get the current textarea element
    return textareaEl.value || document.querySelector('textarea') as HTMLTextAreaElement | null
  }

  function getSelection(el: HTMLTextAreaElement) { return { start: el.selectionStart, end: el.selectionEnd, value: el.value } }
  function replaceRange(el: HTMLTextAreaElement, start: number, end: number, insert: string) {
    const before = el.value.slice(0, start)
    const after = el.value.slice(end)
    const next = before + insert + after
    store.setContent(next)
    nextTick(() => { el.focus(); el.selectionStart = el.selectionEnd = start + insert.length })
    recount()
  }

  function applyAround(token: string) {
    return () => {
      if (mode.value !== 'source') return // only work in source mode
      const ta = getActiveTextarea()
      if (!ta) return
      const { start, end, value } = getSelection(ta)
      const selected = value.slice(start, end)
      replaceRange(ta, start, end, token + selected + token)
    }
  }

  // Individual formatting functions
  function applyBold() { applyAround('**')() }
  function applyItalic() { applyAround('*')() }
  function applyUnderline() {
    // Use HTML tags for underline since markdown doesn't support it natively
    surroundWithHtml('<u>', '</u>')
  }
  function applyStrike() { applyAround('~~')() }
  function applySuperscript() {
    // Use HTML tags for superscript
    surroundWithHtml('<sup>', '</sup>')
  }
  function applySubscript() {
    // Use HTML tags for subscript
    surroundWithHtml('<sub>', '</sub>')
  }
  function applyBulletList() { toggleList('bullet')() }
  function applyOrderedList() { toggleList('ordered')() }

  function applyBlockquote() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea()
    if (!ta) return
    const { start, end, value } = getSelection(ta)
    // expand to full lines
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd
    const segment = value.slice(lineStart, actualEnd)
    const lines = segment.split(/\n/)

    const prefix = '> '
    const allHave = lines.every(l => l.trim() === '' || l.startsWith(prefix))
    const updated = lines.map(l => {
      if (l.trim() === '') return l
      if (allHave) {
        // Remove blockquote formatting
        return l.replace(/^> /, '')
      } else {
        // Add blockquote formatting
        return l.startsWith(prefix) ? l : prefix + l
      }
    }).join('\n')
    replaceRange(ta, lineStart, actualEnd, updated)
  }

  function applyIndent() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea()
    if (!ta) return
    const { start, end, value } = getSelection(ta)
    // expand to full lines
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd
    const segment = value.slice(lineStart, actualEnd)
    const lines = segment.split(/\n/)

    const updated = lines.map(l => {
      if (l.trim() === '') return l
      return '  ' + l // Add 2 spaces for indentation
    }).join('\n')
    replaceRange(ta, lineStart, actualEnd, updated)
  }

  function applyUnindent() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea()
    if (!ta) return
    const { start, end, value } = getSelection(ta)
    // expand to full lines
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd
    const segment = value.slice(lineStart, actualEnd)
    const lines = segment.split(/\n/)

    const updated = lines.map(l => {
      if (l.trim() === '') return l
      // Remove up to 2 spaces from the beginning
      return l.replace(/^  /, '') || l.replace(/^ /, '')
    }).join('\n')
    replaceRange(ta, lineStart, actualEnd, updated)
  }

  function toggleList(type: 'bullet' | 'ordered') {
    return () => {
      if (mode.value !== 'source') return // only work in source mode
      const ta = getActiveTextarea()
      if (!ta) return
      const { start, end, value } = getSelection(ta)
      // expand to full lines
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd = value.indexOf('\n', end)
      const actualEnd = lineEnd === -1 ? value.length : lineEnd
      const segment = value.slice(lineStart, actualEnd)
      const lines = segment.split(/\n/)

      if (type === 'bullet') {
        const prefix = '- '
        const allHave = lines.every(l => l.trim() === '' || l.startsWith(prefix))
        const updated = lines.map(l => {
          if (l.trim() === '') return l
          if (allHave) {
            // Remove bullet formatting
            return l.replace(/^- /, '')
          } else {
            // Add bullet formatting
            return l.startsWith(prefix) ? l : prefix + l
          }
        }).join('\n')
        replaceRange(ta, lineStart, actualEnd, updated)
      } else if (type === 'ordered') {
        const numberRegex = /^\d+\.\s/
        const allHave = lines.every(l => l.trim() === '' || numberRegex.test(l))
        const updated = lines.map((l, index) => {
          if (l.trim() === '') return l
          if (allHave) {
            // Remove numbered formatting
            return l.replace(numberRegex, '')
          } else {
            // Add numbered formatting with correct sequential numbers
            const content = l.replace(numberRegex, '')
            return `${index + 1}. ${content}`
          }
        }).join('\n')
        replaceRange(ta, lineStart, actualEnd, updated)
      }
    }
  }

  function setHeading(level: number) {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd
    const line = value.slice(lineStart, actualEnd).replace(/^#{1,6}\s+/, '')
    const prefix = level > 0 ? '#'.repeat(level) + ' ' : ''
    replaceRange(ta, lineStart, actualEnd, prefix + line)
  }

  function setAlignmentComment(alignment: string) {
    // Insert alignment comment that will properly wrap the selected content
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end)

    if (selected.trim()) {
      // If there's selected text, wrap it with alignment comments
      const wrapped = `<!-- align:${alignment} -->\n${selected}\n<!-- /align -->`
      replaceRange(ta, start, end, wrapped)
    } else {
      // If no selection, just insert the start comment
      const marker = `<!-- align:${alignment} -->\n`
      replaceRange(ta, start, end, marker)
    }
  }

  // selection used for pre-filling link text in dialog
  const linkDialogSelectedText = ref('')

  function insertLink() {
    // Capture selected text from textarea (source) or window selection (reader)
    let selected = ''
    if (mode.value === 'source') {
      const ta = getActiveTextarea()
      if (ta) {
        const { start, end, value } = getSelection(ta)
        selected = value.slice(start, end)
      }
    } else {
      const s = window.getSelection()
      selected = s ? s.toString() : ''
    }
    linkDialogSelectedText.value = selected || ''
    // open dialog
    linkDialogOpen.value = true
  }
  function insertImage() {
    imageDialogOpen.value = true
  }
  function insertCodeBlockBlock() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end)

    let snippet
    if (selected.trim()) {
      // If there's selected text, wrap it in single backticks
      snippet = `\`${selected}\``
    } else {
      // If no selection, insert default template
      snippet = "`code`"
    }

    replaceRange(ta, start, end, snippet)
  }

  function insertMath() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end)

    let snippet
    if (selected.trim()) {
      // If there's selected text, wrap it in math
      snippet = `$${selected}$`
    } else {
      // If no selection, insert default template
      snippet = "$x^2 + y^2 = z^2$"
    }

    replaceRange(ta, start, end, snippet)
  }

  function insertMathblock() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end)

    let snippet
    if (selected.trim()) {
      // If there's selected text, wrap it in a math block
      snippet = `$$\n${selected}\n$$\n`
    } else {
      // If no selection, insert default template
      snippet = "$$\n\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n\n$$\n"
    }

    replaceRange(ta, start, end, snippet)
  }

  function insertHorizontalLine() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end } = getSelection(ta)

    // Insert horizontal line with proper spacing
    const snippet = "\n---\n"
    replaceRange(ta, start, end, snippet)
  }

  function insertFootnote() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end)

    // Generate a unique footnote ID
    const footnoteId = Date.now()

    let snippet
    if (selected.trim()) {
      // If there's selected text, make it the footnote reference
      snippet = `${selected}[^${footnoteId}]\n\n[^${footnoteId}]: Add footnote text here`
    } else {
      // If no selection, insert template
      snippet = `text[^${footnoteId}]\n\n[^${footnoteId}]: Add footnote text here`
    }

    replaceRange(ta, start, end, snippet)
  }

  function insertEmoji(emojiChar?: string) {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end } = getSelection(ta)

    // If emoji character is provided, use it directly
    if (emojiChar) {
      replaceRange(ta, start, end, emojiChar)
      return
    }

    // Otherwise, try to open the OS emoji picker
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMac = /mac|iphone|ipad|ipod/.test(userAgent)
      const isWindows = /win/.test(userAgent)
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)

      if (isMobile) {
        // On mobile, focus the textarea to potentially open emoji keyboard
        if (ta) {
          ta.focus()
          // Some mobile browsers support this
          if ('showPicker' in HTMLInputElement.prototype) {
            try {
              ; (ta as any).showPicker?.()
            } catch (e) {
              // Fallback to inserting emoji syntax
              insertEmojiSyntax()
            }
          } else {
            insertEmojiSyntax()
          }
        }
      } else if (isMac) {
        // On Mac, show instruction and insert common emoji
        alert('Press Cmd + Ctrl + Space to open emoji picker')
        insertEmojiSyntax()
      } else if (isWindows) {
        // On Windows, show instruction and insert common emoji
        alert('Press Win + . (period) to open emoji picker')
        insertEmojiSyntax()
      } else {
        // Fallback for other systems
        insertEmojiSyntax()
      }
    }
  }

  function insertEmojiSyntax() {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea()
    if (!ta) return

    const { start, end } = getSelection(ta)

    // Insert a common emoji syntax
    const snippet = ":smile:"
    replaceRange(ta, start, end, snippet)
  }

  function insertTable(rows: number = 2, cols: number = 2, options: any = { header: true, borders: true, striped: false }) {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return

    // Handle both old and new call signatures
    let header = true
    let borders = true
    let striped = false

    if (typeof options === 'boolean') {
      // Old signature: insertTable(rows, cols, header)
      header = options
    } else if (options && typeof options === 'object') {
      // New signature: insertTable(rows, cols, { header, borders, striped })
      header = options.header !== undefined ? options.header : true
      borders = options.borders !== undefined ? options.borders : true
      striped = options.striped !== undefined ? options.striped : false
    }

    // Always generate Markdown table syntax
    const headerRow = '|' + Array(cols).fill(' Header ').join('|') + '|\n'
    const sepRow = '|' + Array(cols).fill(' --- ').join('|') + '|\n'
    const body = Array(rows).fill('|' + Array(cols).fill(' Cell ').join('|') + '|\n').join('')

    let table = (header ? headerRow + sepRow : '') + body

    // Add CSS wrapper only if styling is needed
    if (borders || striped) {
      const classes = []
      if (borders) classes.push('table-bordered')
      if (striped) classes.push('table-striped')
      table = `<div class="${classes.join(' ')}">\n\n${table}\n</div>\n`
    } else {
      table += '\n'
    }

    const { start, end } = getSelection(ta)
    replaceRange(ta, start, end, table)
  }

  // Inline color via HTML span (markdown fallback) & highlight background
  function surroundWithHtml(tagOpen: string, tagClose: string) {
    if (mode.value !== 'source') return // only work in source mode
    const ta = getActiveTextarea(); if (!ta) return
    const { start, end, value } = getSelection(ta)
    const selected = value.slice(start, end) || 'text'
    replaceRange(ta, start, end, tagOpen + selected + tagClose)
  }
  function applyColor(color: string) { surroundWithHtml(`<span style=\"color:${color}\">`, '</span>') }
  function applyHighlight(color: string) { surroundWithHtml(`<span style=\"background:${color}\">`, '</span>') }

  function onUndo() { store.undo(); recount() }
  function onRedo() { store.redo(); recount() }

  const textareaEl = ref<HTMLTextAreaElement | null>(null)

  const stats = computed(() => ({
    charsWithSpaces: content.value.length,
    charsNoSpaces: content.value.replace(/\s+/g, '').length,
    words: wordCount.value,
    sentences: (content.value.match(/[.!?]+/g) || []).length,
    paragraphs: content.value.split(/\n{2,}|\n/).filter(Boolean).length,
    readingMinutes: Math.max(1, Math.round(wordCount.value / 200)),
    pages: 1,
    lines: content.value.split(/\n/).length,
    avgWordsPerParagraph: (() => { const p = content.value.split(/\n{2,}|\n/).filter(Boolean); return p.length ? Math.round(wordCount.value / p.length) : wordCount.value })()
  }))

  // markdown renderer
  const renderedHtml = computed(() => {
    if (mode.value !== 'reader') return ''

    // Show loading state while plugins are loading
    if (pluginsLoading.value) {
      return '<div class="flex items-center justify-center p-8"><div class="text-gray-400 text-sm">Loading markdown renderer...</div></div>'
    }

    if (!MarkdownIt || !pluginsLoaded.value) {
      // Trigger loading if not started yet
      if (typeof window !== 'undefined' && !pluginCache.loaded && !pluginsLoading.value) {
        loadMarkdownPlugins()
      }
      return '<div class="flex items-center justify-center p-8"><div class="text-gray-400 text-sm">Initializing renderer...</div></div>'
    }

    // Configure markdown-it with proper options
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      breaks: false, // Changed to false for proper list rendering
      typographer: true
    })

    // Add KaTeX support for math rendering if available
    if (katexPlugin && typeof katexPlugin === 'function') {
      try {
        md.use(katexPlugin)
      } catch (e) {
        console.warn('Failed to load KaTeX plugin:', e)
      }
    }

    // Add emoji support if available
    if (emojiPlugin && typeof emojiPlugin === 'function') {
      try {
        md.use(emojiPlugin)
      } catch (e) {
        console.warn('Failed to load emoji plugin:', e)
      }
    }

    // Add footnote support if available
    if (footnotePlugin && typeof footnotePlugin === 'function') {
      try {
        md.use(footnotePlugin)
      } catch (e) {
        console.warn('Failed to load footnote plugin:', e)
      }
    }

    // Render convention: treat strong markup created with double-underscore (__text__) as underline
    // Leave double-asterisk (**) as bold. We override the strong_open/strong_close renderer
    // to emit <u>...</u> when the token.markup is '__'.
    const defaultStrongOpen = md.renderer.rules.strong_open || function (tokens: any, idx: any, options: any, env: any, self: any) { return self.renderToken(tokens, idx, options) }
    const defaultStrongClose = md.renderer.rules.strong_close || function (tokens: any, idx: any, options: any, env: any, self: any) { return self.renderToken(tokens, idx, options) }

    md.renderer.rules.strong_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
      const tok = tokens[idx]
      if (tok && tok.markup === '__') return '<u>'
      return defaultStrongOpen(tokens, idx, options, env, self)
    }
    md.renderer.rules.strong_close = function (tokens: any, idx: any, options: any, env: any, self: any) {
      const tok = tokens[idx]
      if (tok && tok.markup === '__') return '</u>'
      return defaultStrongClose(tokens, idx, options, env, self)
    }

    try {
      // Expand attachment shorthand ![[name]] into markdown image syntax with the stored data URI.
      let processedContent = (content.value || '').replace(/!\[\[([^\]]+)\]\]/g, (m: string, name: string) => {
        try {
          const data = getAttachment(name)
          return data ? `![](${data})` : m
        } catch (e) {
          return m
        }
      })

      // Add basic emoticon to emoji replacement
      const emoticonMap: Record<string, string> = {
        ':)': '😊',
        ':-)': '😊',
        ';)': '😉',
        ';-)': '😉',
        ':D': '😃',
        ':-D': '😃',
        ':P': '😛',
        ':-P': '😛',
        ':p': '😛',
        ':-p': '😛',
        ':(': '😢',
        ':-(': '😢',
        ':o': '😮',
        ':-o': '😮',
        ':O': '😮',
        ':-O': '😮',
        '8-)': '😎',
        ':|': '😐',
        ':-|': '😐',
        ':*': '😘',
        ':-*': '😘',
        '<3': '❤️',
        '</3': '💔',
        ':heart:': '❤️',
        ':thumbsup:': '👍',
        ':thumbsdown:': '👎',
        ':smile:': '😊',
        ':wink:': '😉',
        ':laughing:': '😂',
        ':cry:': '😢',
        ':angry:': '😠',
        ':fire:': '🔥',
        ':star:': '⭐',
        ':check:': '✅',
        ':x:': '❌'
      }

      // Replace emoticons with emojis (but preserve markdown emoji syntax like :smile:)
      Object.entries(emoticonMap).forEach(([emoticon, emoji]) => {
        const escapedEmoticon = emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`(^|\\s)${escapedEmoticon}(?=\\s|$)`, 'g')
        processedContent = processedContent.replace(regex, `$1${emoji}`)
      })

      // Process alignment comments to wrap content in divs with proper alignment classes
      processedContent = processedContent.replace(/<!-- align:(left|center|right|justify) -->\s*\n?([\s\S]*?)(?:\n?\s*<!-- \/align -->|$)/g, (match, alignment, content) => {
        const alignClass = alignment === 'center' ? 'text-center' :
          alignment === 'right' ? 'text-right' :
            alignment === 'justify' ? 'text-justify' : 'text-left'
        return `<div class="${alignClass}">\n\n${content.trim()}\n\n</div>`
      })

      return md.render(processedContent)
    } catch {
      return '<pre class="text-red-600">Render error</pre>'
    }
  })

  function toggleMode() {
    const newMode = mode.value === 'source' ? 'reader' : 'source'
    mode.value = newMode

    // Lazy load plugins only when switching to reader mode
    if (newMode === 'reader' && typeof window !== 'undefined') {
      loadMarkdownPlugins()
    }
  }

  // Handle auto-continuation of lists when Enter is pressed
  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || mode.value !== 'source') return

    const ta = event.target as HTMLTextAreaElement
    if (!ta) return

    const { start, value } = getSelection(ta)
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const currentLine = value.slice(lineStart, start)

    // Check if current line is a bullet list item
    const bulletMatch = currentLine.match(/^(\s*)-\s(.*)$/)
    if (bulletMatch && bulletMatch.length >= 4) {
      const indent = bulletMatch[1] || ''
      const content = bulletMatch[2] || ''

      if (content.trim() === '') {
        // Empty list item - exit list mode
        event.preventDefault()
        const newContent = value.slice(0, lineStart) + indent + value.slice(start)
        store.setContent(newContent)
        nextTick(() => {
          ta.focus()
          ta.selectionStart = ta.selectionEnd = lineStart + indent.length
        })
        return
      }

      // Continue bullet list
      event.preventDefault()
      const newListItem = `\n${indent}- `
      replaceRange(ta, start, start, newListItem)
      return
    }

    // Check if current line is a numbered list item
    const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/)
    if (numberedMatch && numberedMatch.length >= 4) {
      const indent = numberedMatch[1] || ''
      const currentNum = numberedMatch[2] || '1'
      const content = numberedMatch[3] || ''

      if (content.trim() === '') {
        // Empty list item - exit list mode
        event.preventDefault()
        const newContent = value.slice(0, lineStart) + indent + value.slice(start)
        store.setContent(newContent)
        nextTick(() => {
          ta.focus()
          ta.selectionStart = ta.selectionEnd = lineStart + indent.length
        })
        return
      }

      // Continue numbered list with next number
      event.preventDefault()
      const nextNum = parseInt(currentNum) + 1
      const newListItem = `\n${indent}${nextNum}. `
      replaceRange(ta, start, start, newListItem)
      return
    }
  }

  onMounted(() => { textareaEl.value = document.querySelector('textarea') })

  // Link dialog state
  const linkDialogOpen = ref(false)

  // Handler when dialog emits insert: options is LinkInsertOptions from dialog
  function handleLinkInsert(_: any, __: any, options: any) {
    if (!options || !options.url) return
    // If in source mode, wrap selection in markdown link
    if (mode.value === 'source') {
      const ta = getActiveTextarea(); if (!ta) return
      const { start, end, value } = getSelection(ta)
      const selected = value.slice(start, end) || options.text || options.url
      const md = `[${selected}](${options.url})`
      replaceRange(ta, start, end, md)
      return
    }
    // In reader mode, insert actual anchor into content DOM using helper
    try {
      domInsertLink({ url: options.url, text: options.text || undefined, target: options.target || '_blank', rel: options.rel || 'noopener noreferrer' })
    } catch (e) {
      console.warn('dom insert link failed', e)
    }
  }

</script>

<style scoped>

  /* Custom styles for markdown rendering */
  :deep(.prose) {

    /* Ensure headings have proper sizing */
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.875rem;
    }

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }

    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 0.875rem;
      margin-bottom: 0.625rem;
    }

    h5 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }

    h6 {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 0.625rem;
      margin-bottom: 0.5rem;
    }

    /* Ensure underline works properly */
    u {
      text-decoration: underline;
    }

    /* Ensure bold and italic work properly */
    strong {
      font-weight: 700;
    }

    em {
      font-style: italic;
    }

    /* Other markdown elements */
    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    a {
      color: #2563EB;
      text-decoration: underline;
    }

    ul,
    ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    /* Ensure list items display properly */
    ul li {
      list-style-type: disc;
      margin-bottom: 0.25rem;
    }

    ol li {
      list-style-type: decimal;
      margin-bottom: 0.25rem;
    }

    /* Nested lists */
    ul ul li {
      list-style-type: circle;
    }

    ul ul ul li {
      list-style-type: square;
    }

    blockquote {
      border-left: 4px solid #d1d5db;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }

    code {
      background-color: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }

    pre {
      background-color: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
    }

    hr {
      border: none;
      border-top: 1px solid #d1d5db;
      margin: 2rem 0;
    }

    /* Alignment classes */
    .text-left {
      text-align: left;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .text-justify {
      text-align: justify;
    }
  }
</style>
