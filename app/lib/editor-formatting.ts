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
