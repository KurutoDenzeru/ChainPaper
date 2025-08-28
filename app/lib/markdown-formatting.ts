/**
 * Markdown formatting utilities for text manipulation
 */

export interface TextSelection {
  start: number
  end: number
  text: string
}

export interface MarkdownFormatOptions {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  link?: { url: string; text?: string }
  heading?: { level: number }
  list?: { type: 'bullet' | 'ordered' }
}

/**
 * Gets current selection from a textarea element
 */
export function getTextSelection(element: HTMLTextAreaElement): TextSelection {
  return {
    start: element.selectionStart,
    end: element.selectionEnd,
    text: element.value.slice(element.selectionStart, element.selectionEnd)
  }
}

/**
 * Sets selection in a textarea element
 */
export function setTextSelection(element: HTMLTextAreaElement, start: number, end: number) {
  element.focus()
  element.setSelectionRange(start, end)
}

/**
 * Replaces text in a textarea and updates selection
 */
export function replaceText(element: HTMLTextAreaElement, start: number, end: number, newText: string, selectNew: boolean = true) {
  const value = element.value
  const before = value.slice(0, start)
  const after = value.slice(end)
  
  element.value = before + newText + after
  
  if (selectNew) {
    setTextSelection(element, start + newText.length, start + newText.length)
  }
  
  // Trigger input event to update any reactive bindings
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

/**
 * Wraps selected text with markdown syntax
 */
export function wrapWithMarkdown(element: HTMLTextAreaElement, prefix: string, suffix: string = prefix) {
  const selection = getTextSelection(element)
  const newText = prefix + selection.text + suffix
  replaceText(element, selection.start, selection.end, newText)
}

/**
 * Applies bold formatting (**text**)
 */
export function applyBold(element: HTMLTextAreaElement) {
  wrapWithMarkdown(element, '**')
}

/**
 * Applies italic formatting (*text*)
 */
export function applyItalic(element: HTMLTextAreaElement) {
  wrapWithMarkdown(element, '*')
}

/**
 * Applies underline formatting (HTML span)
 */
export function applyUnderline(element: HTMLTextAreaElement) {
  const selection = getTextSelection(element)
  const text = selection.text || 'text'
  const newText = `<u>${text}</u>`
  replaceText(element, selection.start, selection.end, newText)
}

/**
 * Applies strikethrough formatting (~~text~~)
 */
export function applyStrikethrough(element: HTMLTextAreaElement) {
  wrapWithMarkdown(element, '~~')
}

/**
 * Applies inline code formatting (`code`)
 */
export function applyInlineCode(element: HTMLTextAreaElement) {
  wrapWithMarkdown(element, '`')
}

/**
 * Inserts or toggles heading at current line
 */
export function applyHeading(element: HTMLTextAreaElement, level: number) {
  const selection = getTextSelection(element)
  const value = element.value
  
  // Find the start and end of the current line
  const lineStart = value.lastIndexOf('\n', selection.start - 1) + 1
  const lineEnd = value.indexOf('\n', selection.end)
  const actualEnd = lineEnd === -1 ? value.length : lineEnd
  
  const line = value.slice(lineStart, actualEnd)
  const prefix = '#'.repeat(Math.max(0, Math.min(6, level))) + (level > 0 ? ' ' : '')
  
  // Remove existing heading markers
  const cleanLine = line.replace(/^#{1,6}\s+/, '')
  const newLine = prefix + cleanLine
  
  replaceText(element, lineStart, actualEnd, newLine, false)
  setTextSelection(element, lineStart + newLine.length, lineStart + newLine.length)
}

/**
 * Toggles bullet list for current lines
 */
export function toggleBulletList(element: HTMLTextAreaElement) {
  toggleList(element, '- ')
}

/**
 * Toggles ordered list for current lines
 */
export function toggleOrderedList(element: HTMLTextAreaElement) {
  toggleList(element, '1. ')
}

/**
 * Generic list toggle function
 */
export function toggleList(element: HTMLTextAreaElement, prefix: string) {
  const selection = getTextSelection(element)
  const value = element.value
  
  // Expand selection to include full lines
  const lineStart = value.lastIndexOf('\n', selection.start - 1) + 1
  const lineEnd = value.indexOf('\n', selection.end)
  const actualEnd = lineEnd === -1 ? value.length : lineEnd
  
  const lines = value.slice(lineStart, actualEnd).split('\n')
  const allHavePrefix = lines.every(line => line.startsWith(prefix))
  
  const newLines = lines.map(line => {
    if (allHavePrefix) {
      return line.replace(new RegExp('^' + escapeRegex(prefix)), '')
    } else {
      return line.startsWith(prefix) ? line : prefix + line
    }
  })
  
  const newText = newLines.join('\n')
  replaceText(element, lineStart, actualEnd, newText, false)
}

/**
 * Inserts a markdown link
 */
export function insertLink(element: HTMLTextAreaElement, url: string = 'https://example.com', linkText?: string) {
  const selection = getTextSelection(element)
  const text = linkText || selection.text || 'link text'
  const newText = `[${text}](${url})`
  replaceText(element, selection.start, selection.end, newText)
}

/**
 * Inserts a markdown image
 */
export function insertImage(element: HTMLTextAreaElement, url: string = 'https://placehold.co/400x200', altText: string = 'alt text') {
  const selection = getTextSelection(element)
  const newText = `![${altText}](${url})`
  replaceText(element, selection.start, selection.end, newText)
}

/**
 * Inserts a code block
 */
export function insertCodeBlock(element: HTMLTextAreaElement, language: string = 'javascript') {
  const selection = getTextSelection(element)
  const newText = `\`\`\`${language}\n// code here\n\`\`\`\n`
  replaceText(element, selection.start, selection.end, newText)
}

/**
 * Inserts a markdown table
 */
export function insertTable(element: HTMLTextAreaElement, rows: number = 2, cols: number = 2, hasHeader: boolean = true) {
  const headerRow = '|' + Array(cols).fill(' Header ').join('|') + '|\n'
  const separatorRow = '|' + Array(cols).fill(' --- ').join('|') + '|\n'
  const bodyRows = Array(rows).fill('|' + Array(cols).fill(' Cell ').join('|') + '|\n').join('')
  
  const table = (hasHeader ? headerRow + separatorRow : '') + bodyRows + '\n'
  
  const selection = getTextSelection(element)
  replaceText(element, selection.start, selection.end, table)
}

/**
 * Inserts blockquote formatting
 */
export function insertBlockquote(element: HTMLTextAreaElement) {
  const selection = getTextSelection(element)
  const value = element.value
  
  // Find the start and end of the current line
  const lineStart = value.lastIndexOf('\n', selection.start - 1) + 1
  const lineEnd = value.indexOf('\n', selection.end)
  const actualEnd = lineEnd === -1 ? value.length : lineEnd
  
  const lines = value.slice(lineStart, actualEnd).split('\n')
  const newLines = lines.map(line => '> ' + line)
  const newText = newLines.join('\n')
  
  replaceText(element, lineStart, actualEnd, newText, false)
}

/**
 * Escapes special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Validates and normalizes a URL for markdown links
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
 * Gets word count statistics from markdown text
 */
export function getMarkdownStats(text: string) {
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Extract image alt text
    .replace(/#{1,6}\s+/g, '') // Remove heading markers
    .replace(/[*_~`]/g, '') // Remove formatting markers
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove ordered list markers
    .replace(/^\s*>\s+/gm, '') // Remove blockquote markers
  
  const words = cleanText.trim().match(/\S+/g) || []
  const chars = cleanText.length
  const charsNoSpaces = cleanText.replace(/\s+/g, '').length
  const sentences = (cleanText.match(/[.!?]+/g) || []).length
  const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim()).length
  
  return {
    words: words.length,
    characters: chars,
    charactersNoSpaces: charsNoSpaces,
    sentences,
    paragraphs,
    readingTime: Math.max(1, Math.round(words.length / 200)), // Average 200 wpm
    lines: text.split('\n').length
  }
}
