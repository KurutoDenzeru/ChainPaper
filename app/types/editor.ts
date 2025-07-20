export interface EditorState {
  doc: any
  selection: any
  tr: any
}

export interface EditorView {
  state: EditorState
  dispatch: (tr: any) => void
  dom: HTMLElement
  focus: () => void
  destroy: () => void
}

export interface FormatOption {
  type: string
  label: string
  icon: string
  shortcut?: string
  isActive: boolean
  command: () => void
}

export interface ToolbarGroup {
  name: string
  items: FormatOption[]
}

export interface TableOptions {
  rows: number
  cols: number
  withHeaderRow: boolean
  cellPadding: number
  borderWidth: number
}

export interface ImageOptions {
  src: string
  alt: string
  width?: number
  height?: number
  alignment: 'left' | 'center' | 'right'
  caption?: string
}

export interface LinkOptions {
  href: string
  title?: string
  target?: '_blank' | '_self'
}

export interface StyleOptions {
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
}

export interface CommentOptions {
  id: string
  content: string
  author: string
  timestamp: number
  range: { from: number; to: number }
  resolved: boolean
  replies: CommentReply[]
}

export interface CommentReply {
  id: string
  content: string
  author: string
  timestamp: number
}

export interface MathOptions {
  latex: string
  display: boolean // true for block, false for inline
}

export interface TableCell {
  content: any
  colspan: number
  rowspan: number
  background?: string
  alignment: 'left' | 'center' | 'right'
}

export interface TableRow {
  cells: TableCell[]
  height?: number
}

export interface Table {
  rows: TableRow[]
  width: number
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted'
  borderColor: string
}

export interface PageSettings {
  width: number
  height: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  header?: string
  footer?: string
  pageNumbers: boolean
  orientation: 'portrait' | 'landscape'
}

export interface FindReplaceOptions {
  query: string
  replaceWith: string
  caseSensitive: boolean
  wholeWord: boolean
  useRegex: boolean
  highlightAll: boolean
}

export interface SpellCheckError {
  from: number
  to: number
  word: string
  suggestions: string[]
  type: 'spelling' | 'grammar'
}

export interface DocumentStats {
  wordCount: number
  characterCount: number
  characterCountNoSpaces: number
  paragraphCount: number
  sentenceCount: number
  pageCount: number
  readingTime: number // in minutes
}

export interface AutosaveOptions {
  enabled: boolean
  interval: number // in milliseconds
  maxVersions: number
}

export interface ExportFormat {
  type: 'json' | 'pdf' | 'docx' | 'html' | 'txt' | 'rtf'
  options: ExportOptions
}

export interface ExportOptions {
  includeComments: boolean
  includeAuthorship: boolean
  includeMetadata: boolean
  embedImages: boolean
  quality?: 'low' | 'medium' | 'high'
  pageRange?: { start: number; end: number }
}

export interface VersionInfo {
  id: string
  timestamp: number
  author: string
  description: string
  changes: DocumentChange[]
  hash: string
}

export interface DocumentChange {
  type: 'insert' | 'delete' | 'format' | 'move'
  from: number
  to: number
  content?: any
  attributes?: Record<string, any>
  author: string
  timestamp: number
}

export interface CollaborationCursor {
  user: string
  color: string
  position: number
  selection: { from: number; to: number } | null
}

export interface MermaidDiagram {
  code: string
  type: 'flowchart' | 'sequence' | 'gantt' | 'pie' | 'journey' | 'gitgraph'
}

export interface CodeBlock {
  language: string
  code: string
  showLineNumbers: boolean
  highlightLines?: number[]
}
