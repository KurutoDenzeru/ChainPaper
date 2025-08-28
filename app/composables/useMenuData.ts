import {
  FileText, FolderOpen, Save, Upload, Download, FileJson, FileImage, Globe,
  Undo2, Redo2, Scissors, Copy, Clipboard, MousePointer, Search,
  Sidebar, Wrench, BarChart3, ZoomIn,
  Table, ImageIcon, Link, Code2, Calculator, Calendar,
  Bold, Italic, Underline, Heading, List, ListOrdered,
  BookOpen, ShieldCheck, FileSignature, Settings,
  Keyboard, Info, Command
} from 'lucide-vue-next'

/**
 * Data-driven menu definitions used by `MenuBar.vue`.
 * Each item may include: label, icon (component), emit (event name), payload (optional),
 * type: 'item' | 'separator' | 'sub' | 'checkbox'
 * shortcut: { key: string, pc?: string, mac?: string[] }
 */
export const menus = [
  {
    label: 'File',
    items: [
      { label: 'New Document', icon: FileText, emit: 'new-document', shortcut: { key: 'N', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Open', icon: FolderOpen, emit: 'open-document', shortcut: { key: 'O', mac: ['Command'], pc: 'Ctrl' } },
      { type: 'separator' },
      { label: 'Save', icon: Save, emit: 'save-document', disabledProp: 'isDirty', shortcut: { key: 'S', mac: ['Command'], pc: 'Ctrl' } },
      { type: 'separator' },
      {
        type: 'sub',
        label: 'Export As',
        icon: Upload,
        items: [
          { label: 'ChainPaper JSON', icon: FileJson, emit: 'export-document', payload: 'json' },
          { label: 'PDF Document', icon: FileImage, emit: 'export-document', payload: 'pdf' },
          { label: 'Word Document', icon: FileText, emit: 'export-document', payload: 'docx' },
          { label: 'HTML Page', icon: Globe, emit: 'export-document', payload: 'html' },
          { label: 'Markdown', icon: FileText, emit: 'export-document', payload: 'markdown' }
        ]
      },
      { label: 'Import Document', icon: Download, emit: 'import-document' }
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', icon: Undo2, emit: 'undo', shortcut: { key: 'Z', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Redo', icon: Redo2, emit: 'redo', shortcut: { key: 'Z', mac: ['⇧', 'Command'], pc: 'Ctrl+Y' } },
      { type: 'separator' },
      { label: 'Cut', icon: Scissors, emit: 'cut', shortcut: { key: 'X', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Copy', icon: Copy, emit: 'copy', shortcut: { key: 'C', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Paste', icon: Clipboard, emit: 'paste', shortcut: { key: 'V', mac: ['Command'], pc: 'Ctrl' } },
      { type: 'separator' },
      { label: 'Select All', icon: MousePointer, emit: 'select-all', shortcut: { key: 'A', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Find & Replace', icon: Search, emit: 'toggle-find', shortcut: { key: 'F', mac: ['Command'], pc: 'Ctrl' } }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Toggle Sidebar', icon: Sidebar, emit: 'toggle-sidebar' },
      { type: 'separator' },
      { type: 'checkbox', label: 'Show Toolbar', icon: Wrench, bind: 'showToolbar' },
      { type: 'checkbox', label: 'Show Status Bar', icon: BarChart3, bind: 'showStatusBar' },
      { type: 'separator' },
      {
        type: 'sub',
        label: 'Zoom',
        icon: ZoomIn,
        items: [
          { label: 'Fit', emit: 'set-zoom', payload: 'fit' },
          { type: 'separator' },
          { label: '50%', emit: 'set-zoom', payload: 0.5 },
          { label: '75%', emit: 'set-zoom', payload: 0.75 },
          { label: '100%', emit: 'set-zoom', payload: 1 },
          { label: '125%', emit: 'set-zoom', payload: 1.25 },
          { label: '150%', emit: 'set-zoom', payload: 1.5 },
          { label: '200%', emit: 'set-zoom', payload: 2 }
        ]
      }
    ]
  },
  {
    label: 'Insert',
    items: [
      { label: 'Table', icon: Table, emit: 'insert-table' },
      { label: 'Image', icon: ImageIcon, emit: 'insert-image' },
      { label: 'Link', icon: Link, emit: 'insert-link' },
      { type: 'separator' },
      { label: 'Page Break', icon: FileText, emit: 'insert-page-break' }
    ]
  },
  {
    label: 'Format',
    items: [
      { label: 'Bold', icon: Bold, emit: 'format-bold', shortcut: { key: 'B', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Italic', icon: Italic, emit: 'format-italic', shortcut: { key: 'I', mac: ['Command'], pc: 'Ctrl' } },
      { label: 'Underline', icon: Underline, emit: 'format-underline', shortcut: { key: 'U', mac: ['Command'], pc: 'Ctrl' } },
      { type: 'separator' },
      { label: 'Inline Code', icon: Code2, emit: 'insert-code-block', shortcut: { key: 'C', mac: ['Command', 'Shift'], pc: 'Ctrl+Shift' } },
      {
        type: 'sub',
        label: 'Paragraph',
        icon: Heading,
        items: [
          { label: 'Heading 1', emit: 'set-heading', payload: 1 },
          { label: 'Heading 2', emit: 'set-heading', payload: 2 },
          { label: 'Heading 3', emit: 'set-heading', payload: 3 },
          { label: 'Normal Text', emit: 'set-paragraph' },
          { label: 'Quote', emit: 'set-blockquote' }
        ]
      },
      { type: 'separator' },
      { label: 'Bullet List', icon: List, emit: 'toggle-bullet-list' },
      { label: 'Numbered List', icon: ListOrdered, emit: 'toggle-ordered-list' }
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Word Count', icon: FileText, emit: 'word-count' },
      { type: 'separator' },
      { label: 'Verify Authorship', icon: ShieldCheck, emit: 'verify-authorship' },
      { type: 'separator' },
      { label: 'Preferences', icon: Settings, emit: 'settings', shortcut: { key: ',', mac: ['Command'], pc: 'Ctrl' } }
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', icon: BookOpen, emit: 'show-documentation' },
      { type: 'separator' },
      { label: 'About ChainPaper', icon: Info, emit: 'about' }
    ]
  }
]

export type Menus = typeof menus

export default function useMenuData() {
  return { menus }
}
