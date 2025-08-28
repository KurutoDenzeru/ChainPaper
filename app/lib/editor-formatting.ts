/**
 * Editor formatting utilities for text manipulation and link insertion
 */

export interface LinkInsertOptions {
  url: string
  text?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  title?: string
}

export interface LinkInsertResult {
  success: boolean
  message?: string
  element?: HTMLAnchorElement
}

/**
 * Validates and normalizes a URL
 */
export function normalizeUrl(url: string): string {
  if (!url) return ''
  
  const trimmed = url.trim()
  
  // If it's a relative path or fragment, keep as-is
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return trimmed
  }
  
  // If it starts with a protocol, keep as-is
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return trimmed
  }
  
  // If it looks like an email, add mailto:
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`
  }
  
  // If it looks like a domain, add https://
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(trimmed)) {
    return `https://${trimmed}`
  }
  
  // Otherwise, assume it needs https://
  return `https://${trimmed}`
}

/**
 * Creates a properly formatted anchor element HTML string
 */
export function createLinkHtml(options: LinkInsertOptions): string {
  const { url, text, target = '_blank', rel = 'noopener noreferrer', title } = options
  
  const normalizedUrl = normalizeUrl(url)
  const linkText = text || normalizedUrl
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
  
  return `<a href="${escapeHtml(normalizedUrl)}" target="${target}" rel="${rel}"${titleAttr}>${escapeHtml(linkText)}</a>`
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Inserts a link at the current cursor position or wraps selected text
 */
export function insertLink(options: LinkInsertOptions): LinkInsertResult {
  const selection = window.getSelection()
  if (!selection) {
    return { success: false, message: 'No selection available' }
  }

  const selectedText = selection.toString().trim()
  const linkText = options.text || selectedText || options.url
  
  // Create the link with the appropriate text
  const linkOptions: LinkInsertOptions = {
    ...options,
    text: linkText
  }
  
  const linkHtml = createLinkHtml(linkOptions)
  
  try {
    if (selectedText) {
      // If there's selected text, replace it with the link
      const range = selection.getRangeAt(0)
      range.deleteContents()
      
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = linkHtml
      const linkElement = tempDiv.firstChild as HTMLAnchorElement
      
      if (linkElement) {
        range.insertNode(linkElement)
        
        // Move cursor after the link
        range.setStartAfter(linkElement)
        range.setEndAfter(linkElement)
        selection.removeAllRanges()
        selection.addRange(range)
        
        return { success: true, element: linkElement }
      }
    } else {
      // No selection, insert the link at cursor position
      document.execCommand('insertHTML', false, linkHtml)
      return { success: true }
    }
  } catch (error) {
    console.error('Error inserting link:', error)
    return { success: false, message: 'Failed to insert link' }
  }
  
  return { success: false, message: 'Unknown error' }
}

/**
 * Prompts user for URL and optional link text, then inserts the link
 */
export async function promptAndInsertLink(): Promise<LinkInsertResult> {
  const selection = window.getSelection()
  const selectedText = selection?.toString().trim() || ''
  
  // Prompt for URL
  const url = prompt('Enter URL or web address:')
  if (!url) {
    return { success: false, message: 'No URL provided' }
  }
  
  // If no text is selected, prompt for link text
  let linkText = selectedText
  if (!selectedText) {
    const userText = prompt('Enter link text (optional):', url)
    linkText = userText !== null ? userText : url
  }
  
  return insertLink({
    url,
    text: linkText,
    target: '_blank',
    rel: 'noopener noreferrer'
  })
}

/**
 * Sets up link click handling for an editor element
 * Allows Ctrl+Click (or Cmd+Click on Mac) to open links
 */
export function setupLinkClickHandling(editorElement: HTMLElement): () => void {
  function handleClick(event: MouseEvent) {
    // Check if Ctrl (or Cmd on Mac) is pressed
    const isModifierPressed = event.ctrlKey || event.metaKey
    
    if (!isModifierPressed) return
    
    const target = event.target as HTMLElement
    
    // Find the link element (could be the target or a parent)
    let linkElement: HTMLAnchorElement | null = null
    
    if (target.tagName === 'A') {
      linkElement = target as HTMLAnchorElement
    } else {
      linkElement = target.closest('a')
    }
    
    if (linkElement && linkElement.href) {
      event.preventDefault()
      event.stopPropagation()
      
      // Open the link in a new tab/window
      window.open(linkElement.href, '_blank', 'noopener,noreferrer')
    }
  }
  
  editorElement.addEventListener('click', handleClick)
  
  // Return cleanup function
  return () => {
    editorElement.removeEventListener('click', handleClick)
  }
}

/**
 * Removes link formatting from selected text while preserving the text content
 */
export function removeLink(): boolean {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return false
  
  try {
    // Use execCommand to unlink
    document.execCommand('unlink', false)
    return true
  } catch (error) {
    console.error('Error removing link:', error)
    return false
  }
}

/**
 * Checks if the current selection or cursor is within a link
 */
export function isInsideLink(): boolean {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return false
  
  const range = selection.getRangeAt(0)
  let node: Node | null = range.commonAncestorContainer
  
  // If it's a text node, check its parent
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode
  }
  
  // Walk up the DOM to find an anchor element
  while (node && node !== document.body) {
    if (node.nodeName === 'A') {
      return true
    }
    node = node.parentNode
  }
  
  return false
}

/**
 * Gets the link element that contains the current selection
 */
export function getCurrentLink(): HTMLAnchorElement | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  
  const range = selection.getRangeAt(0)
  let node: Node | null = range.commonAncestorContainer
  
  // If it's a text node, check its parent
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode
  }
  
  // Walk up the DOM to find an anchor element
  while (node && node !== document.body) {
    if (node.nodeName === 'A') {
      return node as HTMLAnchorElement
    }
    node = node.parentNode
  }
  
  return null
}

/**
 * Creates an inline <code> element styled as requested.
 * Inline so it does NOT stretch full width; easier to exit.
 */
export function createCodeBlockElement(codeText: string = ''): HTMLElement {
  const code = document.createElement('code')
  // Provided classes + keep a hook class for future theming.
  code.className = 'cp-inline-code px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-muted bg-muted text-highlighted'
  code.setAttribute('data-code-inline', 'true')
  // Let the content be directly editable
  code.contentEditable = 'true'
  if (codeText) {
    code.textContent = codeText
  } else {
    code.textContent = 'code'
    // Select all later so user can overwrite immediately
  }
  return code
}

/**
 * Inserts a code block at current selection, wrapping selected text when present.
 * Returns the created <pre> element or null on failure.
 */
export function insertCodeBlock(): HTMLElement | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  const range = sel.getRangeAt(0)
  const selectedText = sel.toString()

  // If already inside an inline code element we don't nest; instead select it.
  const ancestor = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? range.startContainer as HTMLElement
    : (range.startContainer.parentElement as HTMLElement | null)
  const existingCode = ancestor?.closest('code[data-code-inline="true"]') as HTMLElement | null
  if (existingCode) {
    // Determine if selection fully covers code element
    const fullText = existingCode.textContent || ''
    const selText = sel.toString()
    const startInCode = existingCode.contains(range.startContainer)
    const endInCode = existingCode.contains(range.endContainer)

    // Case: selection collapsed inside code -> unwrap whole element (toggle off)
    if (range.collapsed) {
      const txt = document.createTextNode(fullText)
      const parent = existingCode.parentNode
      if (parent) {
        parent.replaceChild(txt, existingCode)
        const r = document.createRange(); r.setStart(txt, fullText.length); r.collapse(true)
        sel.removeAllRanges(); sel.addRange(r)
      }
      return null
    }

    // If selection spans outside the code element (mixed content) we treat action as insertion of new code around selection, not toggle
    if (!startInCode || !endInCode) {
      // fall through to normal insertion pathway below (do not early-return)
    } else {
      // Selection entirely within one code element.
      // If it covers full text => unwrap whole element
      if (selText === fullText) {
        const txt = document.createTextNode(fullText)
        const parent = existingCode.parentNode
        if (parent) {
          parent.replaceChild(txt, existingCode)
          const r = document.createRange(); r.setStart(txt, 0); r.setEnd(txt, txt.length)
          sel.removeAllRanges(); sel.addRange(r)
        }
        return null
      }

      // Partial selection inside code: unwrap only selected part (segregation)
      // Simplify: only handle when selection within a single text node child
      if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = range.startContainer as Text
        const text = textNode.data
        const before = text.slice(0, range.startOffset)
        const middle = text.slice(range.startOffset, range.endOffset)
        const after = text.slice(range.endOffset)
        const frag = document.createDocumentFragment()
        if (before) {
          const beforeCode = createCodeBlockElement(before)
          beforeCode.contentEditable = 'false'
          frag.appendChild(beforeCode)
          frag.appendChild(document.createTextNode(' '))
        }
        // middle becomes plain text (unwrapped)
        const middleTextNode = document.createTextNode(middle)
        frag.appendChild(middleTextNode)
        if (after) {
          frag.appendChild(document.createTextNode(' '))
          const afterCode = createCodeBlockElement(after)
          afterCode.contentEditable = 'false'
          frag.appendChild(afterCode)
        }
        const parent = existingCode.parentNode
        if (parent) {
          parent.replaceChild(frag, existingCode)
          const newRange = document.createRange()
            newRange.setStart(middleTextNode, 0)
            newRange.setEnd(middleTextNode, middleTextNode.length)
          sel.removeAllRanges(); sel.addRange(newRange)
        }
        return null
      }
      // If complex (multiple nodes) fallback to full unwrap to avoid broken markup
      const plain = document.createTextNode(fullText)
      const parent = existingCode.parentNode
      if (parent) {
        parent.replaceChild(plain, existingCode)
        const r = document.createRange(); r.setStart(plain, 0); r.setEnd(plain, plain.length)
        sel.removeAllRanges(); sel.addRange(r)
      }
      return null
    }
  }

  const codeEl = createCodeBlockElement(selectedText.trim())
  try {
    // Replace selection contents with code element (wrap behaviour)
    range.deleteContents()
    range.insertNode(codeEl)

    // After insertion: select contents so typing overwrites placeholder
    const newRange = document.createRange()
    newRange.selectNodeContents(codeEl)
    sel.removeAllRanges()
    sel.addRange(newRange)

    // Key handler to allow exiting the inline code on Enter
    const exitHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault()
        const space = document.createTextNode(' ')
        if (codeEl.parentNode) {
          codeEl.parentNode.insertBefore(space, codeEl.nextSibling)
          const afterRange = document.createRange()
          afterRange.setStartAfter(space)
          afterRange.collapse(true)
          sel.removeAllRanges(); sel.addRange(afterRange)
        }
      } else if (ev.key === 'Enter' && ev.shiftKey) {
        // Allow newline inside code (insert \n visually as <br>)
        ev.preventDefault()
        const br = document.createElement('br')
        const r = window.getSelection()?.getRangeAt(0)
        if (r) {
          r.deleteContents()
          r.insertNode(br)
          // move caret after br
          const after = document.createRange()
          after.setStartAfter(br)
          after.collapse(true)
          const s = window.getSelection(); if (s) { s.removeAllRanges(); s.addRange(after) }
        }
      }
    }
    codeEl.addEventListener('keydown', exitHandler)
    return codeEl
  } catch (e) {
    console.warn('insertCodeBlock failed', e)
    return null
  }
}
