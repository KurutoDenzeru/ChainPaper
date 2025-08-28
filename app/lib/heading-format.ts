// Utility functions for applying heading/paragraph/subtitle formatting in the editor
// Centralizes block-level transformations and caret preservation.

export type HeadingKind = 'paragraph' | 'subtitle' | 1 | 2 | 3 | 4 | 5 | 6

// Map numeric level to tag
const levelTag: Record<Exclude<HeadingKind, 'paragraph' | 'subtitle'>, string> = {
  1: 'H1',
  2: 'H2',
  3: 'H3',
  4: 'H4',
  5: 'H5',
  6: 'H6'
}

/**
 * Apply heading / paragraph / subtitle formatting to the current block.
 * Uses document.execCommand for native block wrapping (legacy but still works widely)
 * and augments with a subtitle class when requested.
 * Focus & selection are preserved.
 */
export function applyHeading(kind: HeadingKind, root?: HTMLElement | null) {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  const range = sel.getRangeAt(0)
  if (root && !root.contains(range.startContainer)) return

  const block = getActiveBlockWithin(sel)
  const desiredTag = kind === 'paragraph' ? 'P' : kind === 'subtitle' ? 'H2' : typeof kind === 'number' ? levelTag[kind] : 'P'
  if (!block) {
    manualWrap(range, desiredTag, kind === 'subtitle')
    return
  }

  const currentTag = block.tagName
  const isSubtitle = block.classList.contains('subtitle')

  // If same tag & toggling subtitle state
  if (currentTag === desiredTag) {
    if (kind === 'subtitle') {
      // Ensure subtitle class present
      block.classList.add('subtitle');
    } else {
      // Remove subtitle class if switching away
      if (isSubtitle) block.classList.remove('subtitle')
    }
  } else {
    // Replace tag manually (execCommand inconsistent across browsers)
    manualReplace(block, desiredTag, kind === 'subtitle')
  }

  // Cleanup when leaving subtitle
  if (kind !== 'subtitle' && isSubtitle) {
    block.classList.remove('subtitle')
  }
}

function manualWrap(range: Range, tag: string, subtitle: boolean) {
  const el = document.createElement(tag)
  el.appendChild(range.extractContents())
  if (!el.textContent) el.innerHTML = '<br>'
  if (subtitle) el.classList.add('subtitle')
  range.insertNode(el)
  placeCaretAtEnd(el)
}

function manualReplace(oldEl: HTMLElement, tag: string, subtitle: boolean) {
  const newEl = document.createElement(tag)
  // Move children
  while (oldEl.firstChild) newEl.appendChild(oldEl.firstChild)
  if (!newEl.textContent) newEl.innerHTML = '<br>'
  if (subtitle) newEl.classList.add('subtitle')
  oldEl.replaceWith(newEl)
  placeCaretAtEnd(newEl)
}

function placeCaretAtEnd(el: HTMLElement) {
  try {
    const sel = window.getSelection(); if (!sel) return
    const range = document.createRange(); range.selectNodeContents(el); range.collapse(false)
    sel.removeAllRanges(); sel.addRange(range)
  } catch { /* ignore */ }
}

function getActiveBlockWithin(sel: Selection): HTMLElement | null {
  const container = sel.anchorNode as Node | null
  if (!container) return null
  if (container.nodeType === Node.ELEMENT_NODE) {
    return (container as HTMLElement).closest('h1,h2,h3,h4,h5,h6,p,div') as HTMLElement | null
  }
  if (container.parentElement) {
    return container.parentElement.closest('h1,h2,h3,h4,h5,h6,p,div') as HTMLElement | null
  }
  return null
}
