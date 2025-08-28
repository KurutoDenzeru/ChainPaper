/**
 * Markdown editor menu data composable
 */

import { ref } from 'vue'

export interface MarkdownMenuItem {
  type: 'item' | 'separator' | 'checkbox' | 'sub'
  label?: string
  emit?: string
  payload?: any
  icon?: string
  shortcut?: {
    mac?: string[]
    pc?: string
    key?: string
  }
  bind?: string
  items?: MarkdownMenuItem[]
  disabledProp?: string
}

export interface MarkdownMenu {
  label: string
  items: MarkdownMenuItem[]
}

export default function useMarkdownMenuData() {
  const menus = ref<MarkdownMenu[]>([
    {
      label: 'File',
      items: [
        { 
          type: 'item', 
          label: 'New Markdown', 
          emit: 'new-document', 
          icon: 'FileText', 
          shortcut: { mac: ['Command'], key: 'N', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Open', 
          emit: 'open-document', 
          icon: 'FolderOpen', 
          shortcut: { mac: ['Command'], key: 'O', pc: 'Ctrl' } 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Save', 
          emit: 'save-document', 
          icon: 'Save', 
          shortcut: { mac: ['Command'], key: 'S', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Save As...', 
          emit: 'save-as-document', 
          icon: 'SaveAs',
          shortcut: { mac: ['Command', 'Shift'], key: 'S', pc: 'Ctrl' } 
        },
        { type: 'separator' },
        { 
          type: 'sub', 
          label: 'Export', 
          icon: 'Download', 
          items: [
            { type: 'item', label: 'Export as Markdown', emit: 'export-markdown', icon: 'FileText' },
            { type: 'item', label: 'Export as HTML', emit: 'export-html', icon: 'Globe' },
            { type: 'item', label: 'Export as PDF', emit: 'export-pdf', icon: 'FileDown' }
          ]
        },
        { type: 'separator' },
        { 
          type: 'sub', 
          label: 'Import', 
          icon: 'Upload', 
          items: [
            { type: 'item', label: 'Import Markdown', emit: 'import-markdown', icon: 'FileText' },
            { type: 'item', label: 'Import Text', emit: 'import-text', icon: 'FileType' }
          ]
        }
      ]
    },
    {
      label: 'Edit',
      items: [
        { 
          type: 'item', 
          label: 'Undo', 
          emit: 'undo', 
          icon: 'Undo2', 
          shortcut: { mac: ['Command'], key: 'Z', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Redo', 
          emit: 'redo', 
          icon: 'Redo2', 
          shortcut: { mac: ['Command', 'Shift'], key: 'Z', pc: 'Ctrl' } 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Cut', 
          emit: 'cut', 
          icon: 'Scissors', 
          shortcut: { mac: ['Command'], key: 'X', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Copy', 
          emit: 'copy', 
          icon: 'Copy', 
          shortcut: { mac: ['Command'], key: 'C', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Paste', 
          emit: 'paste', 
          icon: 'Clipboard', 
          shortcut: { mac: ['Command'], key: 'V', pc: 'Ctrl' } 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Select All', 
          emit: 'select-all', 
          shortcut: { mac: ['Command'], key: 'A', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Find', 
          emit: 'toggle-find', 
          icon: 'Search', 
          shortcut: { mac: ['Command'], key: 'F', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Find & Replace', 
          emit: 'toggle-replace', 
          icon: 'Replace', 
          shortcut: { mac: ['Command'], key: 'H', pc: 'Ctrl' } 
        }
      ]
    },
    {
      label: 'Format',
      items: [
        { 
          type: 'item', 
          label: 'Bold', 
          emit: 'format-bold', 
          icon: 'Bold', 
          shortcut: { mac: ['Command'], key: 'B', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Italic', 
          emit: 'format-italic', 
          icon: 'Italic', 
          shortcut: { mac: ['Command'], key: 'I', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Underline', 
          emit: 'format-underline', 
          icon: 'Underline', 
          shortcut: { mac: ['Command'], key: 'U', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Strikethrough', 
          emit: 'format-strikethrough', 
          icon: 'Strikethrough', 
          shortcut: { mac: ['Command', 'Shift'], key: 'X', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Inline Code', 
          emit: 'format-code', 
          icon: 'Code', 
          shortcut: { mac: ['Command'], key: '`', pc: 'Ctrl' } 
        },
        { type: 'separator' },
        { 
          type: 'sub', 
          label: 'Heading', 
          icon: 'Heading', 
          items: [
            { type: 'item', label: 'Paragraph', emit: 'set-heading', payload: 0 },
            { type: 'separator' },
            { type: 'item', label: 'Heading 1', emit: 'set-heading', payload: 1, shortcut: { mac: ['Command'], key: '1', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 2', emit: 'set-heading', payload: 2, shortcut: { mac: ['Command'], key: '2', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 3', emit: 'set-heading', payload: 3, shortcut: { mac: ['Command'], key: '3', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 4', emit: 'set-heading', payload: 4, shortcut: { mac: ['Command'], key: '4', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 5', emit: 'set-heading', payload: 5, shortcut: { mac: ['Command'], key: '5', pc: 'Ctrl' } },
            { type: 'item', label: 'Heading 6', emit: 'set-heading', payload: 6, shortcut: { mac: ['Command'], key: '6', pc: 'Ctrl' } }
          ]
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Bullet List', 
          emit: 'toggle-bullet-list', 
          icon: 'List',
          shortcut: { mac: ['Command', 'Shift'], key: '8', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Numbered List', 
          emit: 'toggle-ordered-list', 
          icon: 'ListOrdered',
          shortcut: { mac: ['Command', 'Shift'], key: '7', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Blockquote', 
          emit: 'toggle-blockquote', 
          icon: 'Quote',
          shortcut: { mac: ['Command'], key: '>', pc: 'Ctrl' }
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Clear Formatting', 
          emit: 'clear-formatting', 
          icon: 'RemoveFormatting',
          shortcut: { mac: ['Command'], key: '\\', pc: 'Ctrl' }
        }
      ]
    },
    {
      label: 'Insert',
      items: [
        { 
          type: 'item', 
          label: 'Link', 
          emit: 'insert-link', 
          icon: 'Link', 
          shortcut: { mac: ['Command'], key: 'K', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Image', 
          emit: 'insert-image', 
          icon: 'Image',
          shortcut: { mac: ['Command', 'Shift'], key: 'I', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Table', 
          emit: 'insert-table', 
          icon: 'Table',
          shortcut: { mac: ['Command', 'Shift'], key: 'T', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Code Block', 
          emit: 'insert-code-block', 
          icon: 'Code2',
          shortcut: { mac: ['Command', 'Shift'], key: 'C', pc: 'Ctrl' }
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Horizontal Rule', 
          emit: 'insert-horizontal-rule', 
          icon: 'Minus' 
        },
        { 
          type: 'item', 
          label: 'Line Break', 
          emit: 'insert-line-break', 
          icon: 'CornerDownLeft',
          shortcut: { mac: ['Shift'], key: 'Enter', pc: 'Shift' }
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Math Expression', 
          emit: 'insert-math', 
          icon: 'Calculator' 
        },
        { 
          type: 'item', 
          label: 'Date', 
          emit: 'insert-date', 
          icon: 'Calendar' 
        },
        { 
          type: 'item', 
          label: 'Time', 
          emit: 'insert-time', 
          icon: 'Clock' 
        }
      ]
    },
    {
      label: 'View',
      items: [
        { 
          type: 'checkbox', 
          label: 'Show Toolbar', 
          bind: 'showToolbar', 
          icon: 'Wrench' 
        },
        { 
          type: 'checkbox', 
          label: 'Show Status Bar', 
          bind: 'showStatusBar', 
          icon: 'BarChart3' 
        },
        { 
          type: 'checkbox', 
          label: 'Show Line Numbers', 
          bind: 'showLineNumbers', 
          icon: 'Hash' 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Toggle Source/Preview', 
          emit: 'toggle-preview', 
          icon: 'Eye',
          shortcut: { mac: ['Command'], key: 'P', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Split View', 
          emit: 'toggle-split-view', 
          icon: 'Columns',
          shortcut: { mac: ['Command', 'Shift'], key: 'P', pc: 'Ctrl' }
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Toggle Sidebar', 
          emit: 'toggle-sidebar', 
          icon: 'Sidebar', 
          shortcut: { mac: ['Command'], key: '\\', pc: 'Ctrl' } 
        },
        { 
          type: 'item', 
          label: 'Focus Mode', 
          emit: 'toggle-focus-mode', 
          icon: 'Focus',
          shortcut: { mac: ['Command', 'Shift'], key: 'F', pc: 'Ctrl' }
        },
        { type: 'separator' },
        { 
          type: 'sub', 
          label: 'Zoom', 
          icon: 'ZoomIn', 
          items: [
            { type: 'item', label: 'Zoom In', emit: 'zoom-in', shortcut: { mac: ['Command'], key: '+', pc: 'Ctrl' } },
            { type: 'item', label: 'Zoom Out', emit: 'zoom-out', shortcut: { mac: ['Command'], key: '-', pc: 'Ctrl' } },
            { type: 'item', label: 'Reset Zoom', emit: 'zoom-reset', shortcut: { mac: ['Command'], key: '0', pc: 'Ctrl' } },
            { type: 'separator' },
            { type: 'item', label: 'Fit Page', emit: 'set-zoom', payload: 'fit' },
            { type: 'separator' },
            { type: 'item', label: '50%', emit: 'set-zoom', payload: 50 },
            { type: 'item', label: '75%', emit: 'set-zoom', payload: 75 },
            { type: 'item', label: '100%', emit: 'set-zoom', payload: 100 },
            { type: 'item', label: '125%', emit: 'set-zoom', payload: 125 },
            { type: 'item', label: '150%', emit: 'set-zoom', payload: 150 },
            { type: 'item', label: '200%', emit: 'set-zoom', payload: 200 }
          ]
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        { 
          type: 'item', 
          label: 'Spell Check', 
          emit: 'spell-check', 
          icon: 'SpellCheck',
          shortcut: { mac: ['Command'], key: ';', pc: 'F7' }
        },
        { 
          type: 'item', 
          label: 'Word Count', 
          emit: 'word-count', 
          icon: 'Hash',
          shortcut: { mac: ['Command', 'Shift'], key: 'W', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Document Statistics', 
          emit: 'document-stats', 
          icon: 'BarChart3' 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Markdown Preview', 
          emit: 'preview-markdown', 
          icon: 'Eye',
          shortcut: { mac: ['Command', 'Shift'], key: 'M', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Validate Markdown', 
          emit: 'validate-markdown', 
          icon: 'CheckCircle' 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'Verify Authorship', 
          emit: 'verify-authorship', 
          icon: 'Shield' 
        },
        { 
          type: 'item', 
          label: 'Generate Hash', 
          emit: 'generate-hash', 
          icon: 'Hash' 
        }
      ]
    },
    {
      label: 'Help',
      items: [
        { 
          type: 'item', 
          label: 'Keyboard Shortcuts', 
          emit: 'show-shortcuts', 
          icon: 'Keyboard',
          shortcut: { mac: ['Command'], key: '/', pc: 'Ctrl' }
        },
        { 
          type: 'item', 
          label: 'Markdown Guide', 
          emit: 'show-markdown-guide', 
          icon: 'BookOpen' 
        },
        { 
          type: 'item', 
          label: 'Markdown Cheatsheet', 
          emit: 'show-cheatsheet', 
          icon: 'FileText' 
        },
        { type: 'separator' },
        { 
          type: 'item', 
          label: 'About ChainPaper', 
          emit: 'show-about', 
          icon: 'Info' 
        }
      ]
    }
  ])

  return {
    menus
  }
}
