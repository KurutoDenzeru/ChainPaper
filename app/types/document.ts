export interface DocumentMetadata {
  id: string
  title: string
  author: string
  createdAt: Date
  updatedAt: Date
  version: number
  hash: string
  authorshipProof: string
  wordCount: number
  characterCount: number
  pageCount: number
  language: string
}

export interface DocumentContent {
  type: 'doc'
  content: DocumentNode[]
}

export interface DocumentNode {
  type: string
  attrs?: Record<string, any>
  content?: DocumentNode[]
  text?: string
  marks?: DocumentMark[]
}

export interface DocumentMark {
  type: string
  attrs?: Record<string, any>
}

export interface AuthorshipBlock {
  id: string
  author: string
  timestamp: Date
  hash: string
  signature: string
  content: string
  position: {
    from: number
    to: number
  }
}

export interface DocumentVersion {
  id: string
  timestamp: Date
  author: string
  changes: Change[]
  metadata: DocumentMetadata
  content: DocumentContent
}

export interface Change {
  type: 'insert' | 'delete' | 'replace'
  from: number
  to?: number
  content?: DocumentNode[]
  oldContent?: DocumentNode[]
  author: string
  timestamp: Date
}

export interface ExportOptions {
  format?: 'json' | 'pdf' | 'docx' | 'html' | 'markdown'
  includeMetadata?: boolean
  includeAuthorship?: boolean
  includeComments?: boolean
  pageSize?: 'A4' | 'Letter' | 'Legal'
  margins?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  position: {
    from: number
    to: number
  }
  resolved: boolean
  replies: CommentReply[]
}

export interface CommentReply {
  id: string
  author: string
  content: string
  timestamp: Date
}

export interface DocumentSettings {
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom'
  customSize?: { width: number; height: number }
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  lineSpacing: number
  fontSize: number
  fontFamily: string
  theme: 'light' | 'dark' | 'sepia'
  spellCheck: boolean
  grammarCheck: boolean
  autoSave: boolean
  autoSaveInterval: number
  showComments: boolean
  showAuthorship: boolean
  showLineNumbers: boolean
  showWordCount: boolean
  enableCollaboration: boolean
  readingMode: boolean
  focusMode: boolean
  typewriterMode: boolean
  headerText?: string
  footerText?: string
  watermark?: string
  language: string
  rtlSupport: boolean
}

export interface DocumentStatistics {
  wordCount: number
  characterCount: number
  characterCountNoSpaces: number
  paragraphCount: number
  sentenceCount: number
  pageCount: number
  sectionCount: number
  headingCount: { [level: number]: number }
  listCount: number
  tableCount: number
  imageCount: number
  linkCount: number
  readingTime: number
  writingTime: number
  lastEditTime: Date
  editSessions: EditSession[]
}

export interface EditSession {
  id: string
  startTime: Date
  endTime: Date
  wordsAdded: number
  wordsRemoved: number
  timeSpent: number
  author: string
}

export interface DocumentSecurity {
  encrypted: boolean
  encryptionAlgorithm?: string
  accessLevel: 'public' | 'private' | 'restricted'
  allowedUsers?: string[]
  permissions: {
    read: boolean
    write: boolean
    comment: boolean
    export: boolean
    share: boolean
  }
  digitalSignature?: string
  certificates?: Certificate[]
}

export interface Certificate {
  id: string
  issuer: string
  subject: string
  validFrom: Date
  validTo: Date
  fingerprint: string
  algorithm: string
}

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  content: DocumentContent
  metadata: DocumentMetadata
  settings: DocumentSettings
  variables: TemplateVariable[]
}

export interface TemplateVariable {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'choice'
  defaultValue?: any
  choices?: string[]
  required: boolean
}

export interface DocumentIndex {
  tableOfContents: TOCEntry[]
  figures: FigureEntry[]
  tables: TableEntry[]
  references: ReferenceEntry[]
  glossary: GlossaryEntry[]
}

export interface TOCEntry {
  id: string
  level: number
  title: string
  pageNumber: number
  position: number
}

export interface FigureEntry {
  id: string
  caption: string
  type: 'image' | 'chart' | 'diagram'
  pageNumber: number
  position: number
}

export interface TableEntry {
  id: string
  caption: string
  pageNumber: number
  position: number
  rows: number
  columns: number
}

export interface ReferenceEntry {
  id: string
  type: 'book' | 'article' | 'website' | 'other'
  title: string
  author: string
  year: number
  url?: string
  pageNumber: number
}

export interface GlossaryEntry {
  term: string
  definition: string
  references: number[]
}

export interface DocumentBookmark {
  id: string
  name: string
  position: number
  timestamp: Date
  color?: string
  note?: string
}

export interface DocumentAnnotation {
  id: string
  type: 'highlight' | 'strikethrough' | 'underline' | 'note'
  range: { from: number; to: number }
  color: string
  note?: string
  author: string
  timestamp: Date
}

export interface FootnoteEndnote {
  id: string
  type: 'footnote' | 'endnote'
  number: number
  content: string
  position: number
  pageNumber: number
}

export interface Document {
  id: string
  title: string
  metadata: DocumentMetadata
  content: DocumentContent
  settings: DocumentSettings
  comments: Comment[]
  authorship: DocumentSecurity
  statistics: DocumentStatistics
  lastModified: Date
  isDirty: boolean
}

// Alias for consistency with existing code
export type DocumentType = Document
