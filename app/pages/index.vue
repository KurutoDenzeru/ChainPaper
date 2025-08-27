<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Fixed top area: Menubar + EditorToolbar (both floating) -->
    <div class="fixed inset-x-1 top-1 z-50 pointer-events-none">
      <div ref="menuWrapper" v-show="menuVisible" class="pointer-events-auto">
      <MenuBar :documentTitle="documentTitle" :isDirty="isDirty" :user="user" @select-all="onSelectAll"
          @update-title="onUpdateTitle" @save-document="onSaveDocument" @new-document="onNewDocument"
          @open-document="onOpenDocument" @export-document="onExport" @import-document="onImport" @settings="onSettings"
          @about="onAbout" @undo="doUndo" @redo="doRedo" @format-bold="toggleBold" @format-italic="toggleItalic"
          @format-underline="toggleUnderline" @toggle-bullet-list="toggleBulletList"
          @toggle-ordered-list="toggleOrderedList" @insert-link="onInsertLink" @insert-image="onInsertImage"
          @insert-table="onInsertTable" @set-zoom="onSetZoom"
          @verify-authorship="onVerifyAuthorship" />
        <!-- listen for proof-related menu actions -->
        <!-- these are emitted from MenuBar and handled here -->
        <template v-if="false" />
      </div>

      <div ref="toolbarWrapper" :class="[menuVisible ? 'mt-2' : 'mt-0', 'pointer-events-auto']">
        <EditorToolbar :isMenuVisible="menuVisible" :zoom="zoomPercent" :fitMode="lastZoomWasFit"
          @toggle-menubar="toggleMenu" @toggle-sidebar="toggleSidebar" @toggle-find="toggleFind"
          @insert-link="onInsertLink" @insert-image="onInsertImage" @insert-table="onInsertTable" @undo="doUndo"
          @redo="doRedo" @format-bold="toggleBold" @format-italic="toggleItalic" @format-underline="toggleUnderline"
          @format-strikethrough="toggleStrikethrough" @set-font-family="setFontFamily" @set-font-size="setFontSize"
          @set-alignment="setAlignment" @set-text-color="setTextColor" @set-highlight-color="setHighlightColor"
          @indent="indent" @outdent="outdent" @toggle-bullet-list="toggleBulletList"
          @toggle-ordered-list="toggleOrderedList" @set-zoom="onSetZoom" />
      </div>
    </div>

    <!-- spacer to keep main content below fixed top controls -->
    <div aria-hidden="true" :style="{ height: topPadding + 'px' }"></div>

    <!-- Document editor canvas: contenteditable center pane -->
    <main class="flex-1 p-6 pb-24 flex items-start justify-center">
      <div class="w-full max-w-4xl">
        <div ref="viewportEl" class="editor-viewport overflow-auto">
          <div ref="pageEl" class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 min-h-[60vh] document-page"
            :style="editorStyle">
            <div class="prose max-w-none">
              <div ref="editor" class="editor-content outline-none min-h-[40vh] text-gray-800" :contenteditable="true"
                role="textbox" aria-multiline="true" @input="onEditorInput" @keydown="onEditorKeydown"></div>
              <!-- content is managed directly to avoid Vue re-rendering and resetting caret -->
            </div>
            <!-- hidden file input for image uploads -->
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageSelected" />
          </div>
        </div>
      </div>
    </main>

    <StickyFooter :wordCount="wordCount" :pageCount="pageCount" :zoom="zoomPercent" :view="viewMode"
      :fitMode="lastZoomWasFit" @set-zoom="onSetZoom" @set-view="onSetView" />

  </div>
  <div v-if="showProofModal" class="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <AuthProofDialog @close="showProofModal = false" />
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
  // toolbar state mirrors to keep buttons highlighted
  const toolbarState = ref({ isBold: false, isItalic: false, isUnderline: false, isStrikethrough: false, isBulletList: false, isOrderedList: false })
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
  // refs to measure fit behavior
  const viewportEl = ref<HTMLElement | null>(null)
  const pageEl = ref<HTMLElement | null>(null)
  const lastZoomWasFit = ref<boolean>(false)

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

  function setEditorHtml(html = '') {
    if (editor.value) {
      editor.value.innerHTML = html || '<p><br></p>'
    }
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
    // If a selection exists, prompt for URL and wrap selection in anchor; otherwise insert placeholder link
    const sel = window.getSelection()
    const selectedText = sel?.toString()
    const url = prompt('Enter URL')
    if (!url) return
    if (selectedText && selectedText.length > 0) {
      // wrap the selected text
      document.execCommand('createLink', false, url)
    } else {
      // insert an <a> element with the URL as text
      const html = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      document.execCommand('insertHTML', false, html)
    }
    onEditorInput(new Event('input'))
  }

  function onInsertImage() {
    // trigger hidden file input to allow file upload
    imageInput.value?.click()
  }

  async function onImageSelected(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    const file = input.files[0]
    if (!file) return
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('file read error'))
      reader.readAsDataURL(file as Blob)
    })
    document.execCommand('insertImage', false, dataUrl)
    input.value = ''
    onEditorInput(new Event('input'))
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
  
  function toggleBulletList() {
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    
    if (!range) {
      // No selection, create a new bullet list with an empty list item
      const bulletHtml = '<ul style="margin-left: 20px; padding-left: 20px;"><li><br></li></ul>'
      document.execCommand('insertHTML', false, bulletHtml)
    } else {
      // Check if we're already in a list
      const container = range.commonAncestorContainer
      const listElement = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('ul, ol') 
        : (container as Element)?.closest('ul, ol')
      
      if (listElement) {
        // We're in a list, toggle it off
        document.execCommand('insertUnorderedList')
      } else {
        // Convert selection to bullet list
        const selectedText = selection?.toString() || ''
        if (selectedText.trim()) {
          // Split by lines and create list items
          const lines = selectedText.split('\n').filter(line => line.trim())
          const listItems = lines.map(line => `<li style="margin-bottom: 5px;">${line.trim()}</li>`).join('')
          const bulletHtml = `<ul style="margin-left: 20px; padding-left: 20px;">${listItems}</ul>`
          document.execCommand('insertHTML', false, bulletHtml)
        } else {
          // Create new bullet point (empty li for cursor)
          const bulletHtml = '<ul style="margin-left: 20px; padding-left: 20px;"><li><br></li></ul>'
          document.execCommand('insertHTML', false, bulletHtml)
        }
      }
    }
    onEditorInput(new Event('input'))
  }
  
  function toggleOrderedList() {
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    
    if (!range) {
      // No selection, create a new numbered list with an empty list item
      const numberedHtml = '<ol style="margin-left: 20px; padding-left: 20px;"><li><br></li></ol>'
      document.execCommand('insertHTML', false, numberedHtml)
    } else {
      // Check if we're already in a list
      const container = range.commonAncestorContainer
      const listElement = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('ul, ol') 
        : (container as Element)?.closest('ul, ol')
      
      if (listElement) {
        // We're in a list, toggle it off
        document.execCommand('insertOrderedList')
      } else {
        // Convert selection to numbered list
        const selectedText = selection?.toString() || ''
        if (selectedText.trim()) {
          // Split by lines and create numbered list items (browser will handle numbering)
          const lines = selectedText.split('\n').filter(line => line.trim())
          const listItems = lines.map(line => `<li style="margin-bottom: 5px;">${line.trim()}</li>`).join('')
          const numberedHtml = `<ol style="margin-left: 20px; padding-left: 20px;">${listItems}</ol>`
          document.execCommand('insertHTML', false, numberedHtml)
        } else {
          // Create new numbered point (empty li for cursor)
          const numberedHtml = '<ol style="margin-left: 20px; padding-left: 20px;"><li><br></li></ol>'
          document.execCommand('insertHTML', false, numberedHtml)
        }
      }
    }
    onEditorInput(new Event('input'))
  }

  function setFontFamily(f: string) {
    document.execCommand('fontName', false, f)
    onEditorInput(new Event('input'))
  }

  function setFontSize(size: number | string) {
    // execCommand fontSize expects 1-7 for legacy; instead wrap selected text in span
    const sz = typeof size === 'string' ? size : String(size)
    document.execCommand('insertHTML', false, `<span style="font-size:${sz}px">${window.getSelection()?.toString() || ''}</span>`)
    onEditorInput(new Event('input'))
  }

  function setTextColor(color: string) {
    document.execCommand('foreColor', false, color)
    onEditorInput(new Event('input'))
  }

  function setHighlightColor(color: string) {
    document.execCommand('backColor', false, color)
    onEditorInput(new Event('input'))
  }

  function setAlignment(align: 'left' | 'center' | 'right' | 'justify') {
    const cmd = align === 'left' ? 'justifyLeft' : align === 'center' ? 'justifyCenter' : align === 'right' ? 'justifyRight' : 'justifyFull'
    document.execCommand(cmd)
    onEditorInput(new Event('input'))
  }

  function indent() { 
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (range) {
      const container = range.startContainer
      const listItem = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('li') 
        : (container as Element)?.closest('li')
      
      if (listItem) {
        // Indent list item by creating nested list
        const currentList = listItem.closest('ul, ol')
        if (currentList) {
          const isOrderedList = currentList.tagName === 'OL'
          const nestedList = document.createElement(isOrderedList ? 'ol' : 'ul')
          nestedList.style.cssText = 'margin-left: 20px; padding-left: 20px;'
          
          const newListItem = document.createElement('li')
          newListItem.style.cssText = 'margin-bottom: 5px;'
          newListItem.innerHTML = '<br>'
          
          nestedList.appendChild(newListItem)
          listItem.appendChild(nestedList)
          
          // Move cursor to nested item
          const newRange = document.createRange()
          newRange.setStart(newListItem, 1)
          newRange.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(newRange)
        }
      } else {
        document.execCommand('indent')
      }
    } else {
      document.execCommand('indent')
    }
    onEditorInput(new Event('input'))
  }
  
  function outdent() { 
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (range) {
      const container = range.startContainer
      const listItem = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement?.closest('li') 
        : (container as Element)?.closest('li')
      
      if (listItem) {
        // Outdent list item
        const parentList = listItem.closest('ul, ol')
        const grandparentListItem = parentList?.closest('li')
        
        if (grandparentListItem) {
          // Move this item to parent level
          const grandparentList = grandparentListItem.closest('ul, ol')
          if (grandparentList) {
            grandparentList.insertBefore(listItem, grandparentListItem.nextSibling)
            
            // If the nested list is now empty, remove it
            if (parentList && parentList.children.length === 0) {
              parentList.remove()
            }
          }
        }
      } else {
        document.execCommand('outdent')
      }
    } else {
      document.execCommand('outdent')
    }
    onEditorInput(new Event('input'))
  }

  // Editor element and basic editing handlers
  const editor = ref<HTMLElement | null>(null)
  const imageInput = ref<HTMLInputElement | null>(null)

  const editorStyle = computed(() => {
    const scale = (zoomPercent.value || 100) / 100
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }
  })

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
    
    // Handle Enter key in lists
    if (ev.key === 'Enter') {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)
      if (range) {
        const container = range.startContainer
        const listItem = container.nodeType === Node.TEXT_NODE 
          ? container.parentElement?.closest('li') 
          : (container as Element)?.closest('li')
        
        if (listItem) {
          const list = listItem.closest('ul, ol')
          if (list) {
            ev.preventDefault()

            // If the list item is empty, exit the list and insert a paragraph
            const listItemText = (listItem.textContent || '').trim()
            if (listItemText === '') {
              const newP = document.createElement('p')
              newP.innerHTML = '<br>'
              list.parentNode?.insertBefore(newP, list.nextSibling)

              // Move cursor to new paragraph
              const newRange = document.createRange()
              newRange.setStart(newP, 0)
              newRange.collapse(true)
              selection?.removeAllRanges()
              selection?.addRange(newRange)

              // Remove empty list item
              if (listItem.parentNode && listItem.parentNode.children.length === 1) {
                list.remove()
              } else {
                listItem.remove()
              }
            } else {
              // Create a new empty list item and place the cursor inside
              const newListItem = document.createElement('li')
              newListItem.innerHTML = '<br>'
              listItem.parentNode?.insertBefore(newListItem, listItem.nextSibling)

              const newRange = document.createRange()
              newRange.setStart(newListItem, 0)
              newRange.collapse(true)
              selection?.removeAllRanges()
              selection?.addRange(newRange)
            }

            onEditorInput(new Event('input'))
            return
          }
        }
      }
    }
    
    // Handle formatting shortcuts
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

  // Undo / Redo
  function doUndo() {
    try {
      editor.value?.focus()
      document.execCommand('undo')
      onEditorInput(new Event('input'))
    } catch (e) {
      console.warn('undo failed', e)
    }
  }

  function doRedo() {
    try {
      editor.value?.focus()
      document.execCommand('redo')
      onEditorInput(new Event('input'))
    } catch (e) {
      try { document.execCommand('forward'); onEditorInput(new Event('input')) } catch (e2) { console.warn('redo failed', e2) }
    }
  }

  // update toolbar active states based on current selection
  function updateToolbarState() {
    toolbarState.value.isBold = document.queryCommandState('bold')
    toolbarState.value.isItalic = document.queryCommandState('italic')
    toolbarState.value.isUnderline = document.queryCommandState('underline')
    toolbarState.value.isStrikethrough = document.queryCommandState('strikeThrough')
    toolbarState.value.isBulletList = document.queryCommandState('insertUnorderedList')
    toolbarState.value.isOrderedList = document.queryCommandState('insertOrderedList')
  }

  // listen to selection changes to update toolbar
  onMounted(() => {
    document.addEventListener('selectionchange', updateToolbarState)
  })

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

  async function onVerifyAuthorship() {
    // open modal to verify proof
    showProofModal.value = true
  }

  function onSetZoom(level: number | 'fit') {
    // level may be decimal (1.0 = 100%) or the special 'fit' string
    if (level === 'fit') {
      // compute a scale such that the page fits inside the viewport (with some padding)
      nextTick(() => {
        const vp = viewportEl.value
        const pg = pageEl.value
        if (!vp || !pg) return
        const vpRect = vp.getBoundingClientRect()
        const pgRect = pg.getBoundingClientRect()
        // available space inside viewport (subtract some padding)
        const availWidth = vpRect.width - 40
        const availHeight = vpRect.height - 40
        const scaleW = availWidth / pgRect.width
        const scaleH = availHeight / pgRect.height
        const fitScale = Math.max(0.5, Math.min(3, Math.min(scaleW, scaleH)))
        zoomPercent.value = Math.round(fitScale * 100)
        lastZoomWasFit.value = true
        console.log('fit -> scale', fitScale, '=>', zoomPercent.value)
      })
      return
    }
    // numeric level (decimal)
    zoomPercent.value = Math.round((level || 1) * 100)
    lastZoomWasFit.value = false
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
    // set editor initial HTML content
    setEditorHtml(pages.value[0] || '')
  })
</script>

<style scoped>

  /* Visual letter-sized page for the document canvas */
  .document-page {
    width: 8.5in;
    /* physical letter width */
    height: 11in;
    /* physical letter height */
    margin: 0 auto;
    /* center within the viewport */
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    /* keep the internal padding/margins untouched */
    background-clip: padding-box;
  }

  /* Keep the viewport centered and allow scrolling when scaled */
  .editor-viewport {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    /* vertical space around the page */
  }

  /* List styling for better formatting */

  :deep(ul), :deep(ol) {
    margin: 10px 0;
    padding-left: 32px; /* leave space for native markers */
    list-style-position: outside;
  }

  /* Use native list markers to avoid adding duplicate bullets when pasted HTML
     already contains inline bullet characters or markers. Keep simple spacing. */
  :deep(ul li), :deep(ol li) {
    margin-bottom: 6px;
    line-height: 1.5;
  }


  /* Nested list styling */
  :deep(ul ul), :deep(ol ol), :deep(ul ol), :deep(ol ul) {
    margin: 5px 0;
    padding-left: 20px;
  }

</style>
