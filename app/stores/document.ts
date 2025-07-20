import { defineStore } from 'pinia'
import type { 
  DocumentMetadata, 
  DocumentContent, 
  DocumentVersion, 
  DocumentSettings,
  Comment,
  DocumentStatistics,
  DocumentSecurity,
  DocumentTemplate,
  DocumentIndex,
  DocumentBookmark,
  DocumentAnnotation,
  FootnoteEndnote,
  EditSession,
  ExportOptions
} from '~/types/document'
import type { AuthorBlock, AuthorshipProof, VerificationResult } from '~/types/authorship'
import { ChainPaperCrypto } from '~/utils/cryptography'
import { DocumentParser } from '~/utils/document-parser'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    // Current document
    currentDocument: null as DocumentContent | null,
    metadata: {
      id: '',
      title: 'Untitled Document',
      author: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      hash: '',
      authorshipProof: '',
      wordCount: 0,
      characterCount: 0,
      pageCount: 1,
      language: 'en'
    } as DocumentMetadata,
    
    // Document history
    versions: [] as DocumentVersion[],
    currentVersionId: null as string | null,
    
    // Comments and annotations
    comments: [] as Comment[],
    annotations: [] as DocumentAnnotation[],
    footnotes: [] as FootnoteEndnote[],
    endnotes: [] as FootnoteEndnote[],
    
    // Authorship tracking
    authorshipBlocks: [] as AuthorBlock[],
    authorshipProof: null as AuthorshipProof | null,
    
    // Document structure
    documentIndex: {
      tableOfContents: [],
      figures: [],
      tables: [],
      references: [],
      glossary: []
    } as DocumentIndex,
    
    bookmarks: [] as DocumentBookmark[],
    
    // Document settings
    settings: {
      pageSize: 'A4',
      customSize: undefined,
      margins: {
        top: 25.4,
        bottom: 25.4,
        left: 25.4,
        right: 25.4
      },
      lineSpacing: 1.5,
      fontSize: 12,
      fontFamily: 'Times New Roman',
      theme: 'light',
      spellCheck: true,
      grammarCheck: true,
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      showComments: true,
      showAuthorship: false,
      showLineNumbers: false,
      showWordCount: true,
      enableCollaboration: false,
      readingMode: false,
      focusMode: false,
      typewriterMode: false,
      headerText: undefined,
      footerText: undefined,
      watermark: undefined,
      language: 'en',
      rtlSupport: false
    } as DocumentSettings,
    
    // Document security
    security: {
      encrypted: false,
      accessLevel: 'private',
      permissions: {
        read: true,
        write: true,
        comment: true,
        export: true,
        share: false
      }
    } as DocumentSecurity,
    
    // Document statistics
    statistics: {
      wordCount: 0,
      characterCount: 0,
      characterCountNoSpaces: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      pageCount: 1,
      sectionCount: 0,
      headingCount: {},
      listCount: 0,
      tableCount: 0,
      imageCount: 0,
      linkCount: 0,
      readingTime: 0,
      writingTime: 0,
      lastEditTime: new Date(),
      editSessions: []
    } as DocumentStatistics,
    
    // Document state
    isLoading: false,
    isDirty: false,
    isAutoSaving: false,
    lastSaved: null as Date | null,
    lastAutoSave: null as Date | null,
    autoSaveTimer: null as NodeJS.Timeout | null,
    
    // Current user and session
    currentUser: {
      name: '',
      wallet: '',
      publicKey: '',
      privateKey: ''
    },
    
    currentEditSession: null as EditSession | null,
    
    // Templates
    availableTemplates: [] as DocumentTemplate[],
    
    // Recent documents
    recentDocuments: [] as { id: string; title: string; lastOpened: Date }[],
    
    // Export/import state
    exportProgress: 0,
    importProgress: 0,
    isExporting: false,
    isImporting: false,
    
    // Collaboration state
    collaborators: [] as any[],
    collaborationEnabled: false,
    
    // Find/replace results
    searchResults: [] as { from: number; to: number; text: string }[],
    currentSearchIndex: 0,
    
    // Spell check
    spellCheckErrors: [] as any[],
    customDictionary: [] as string[],
    
    // Document recovery
    backupVersions: [] as DocumentVersion[]
  }),

  getters: {
    documentStatistics: (state) => {
      if (!state.currentDocument) {
        return {
          wordCount: 0,
          characterCount: 0,
          characterCountNoSpaces: 0,
          paragraphCount: 0,
          sentenceCount: 0,
          pageCount: 1,
          readingTime: 0
        }
      }
      return DocumentParser.getStatistics(state.currentDocument)
    },

    documentHash: (state) => {
      if (!state.currentDocument) return ''
      const content = JSON.stringify(state.currentDocument)
      return ChainPaperCrypto.createHash(content)
    },

    isDocumentValid: (state) => {
      return !!state.currentDocument && state.metadata.title.trim() !== ''
    },

    hasUnsavedChanges: (state) => {
      return state.isDirty
    },

    documentAge: (state) => {
      if (!state.lastSaved) return 0
      return Date.now() - state.lastSaved.getTime()
    }
  },

  actions: {
    // Document lifecycle management
    async createNewDocument(title?: string, author?: string, template?: DocumentTemplate) {
      this.startEditSession()
      
      if (template) {
        this.currentDocument = JSON.parse(JSON.stringify(template.content))
        this.settings = { ...this.settings, ...template.settings }
      } else {
        this.currentDocument = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: []
            }
          ]
        }
      }
      
      this.metadata = {
        id: crypto.randomUUID(),
        title: title || 'Untitled Document',
        author: author || this.currentUser.name || 'Anonymous',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: this.documentHash,
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      }
      
      this.resetDocumentState()
      await this.generateAuthorshipProof()
      this.setupAutoSave()
    },

    async loadDocument(data: any) {
      try {
        this.isLoading = true
        
        if (data.chainPaper && data.content && data.metadata) {
          this.currentDocument = data.content
          this.metadata = {
            ...data.metadata,
            createdAt: new Date(data.metadata.createdAt),
            updatedAt: new Date(data.metadata.updatedAt)
          }
          
          // Load all document components
          this.versions = data.versions || []
          this.comments = data.comments || []
          this.annotations = data.annotations || []
          this.footnotes = data.footnotes || []
          this.endnotes = data.endnotes || []
          this.authorshipBlocks = data.authorshipBlocks || []
          this.bookmarks = data.bookmarks || []
          this.documentIndex = data.documentIndex || this.documentIndex
          this.settings = { ...this.settings, ...data.settings }
          this.security = { ...this.security, ...data.security }
          this.statistics = { ...this.statistics, ...data.statistics }
          
          await this.updateDocumentStatistics()
          this.setupAutoSave()
        } else {
          throw new Error('Invalid document format')
        }
        
        this.isDirty = false
        this.lastSaved = new Date()
        this.addToRecentDocuments()
        
      } catch (error) {
        console.error('Failed to load document:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveDocument() {
      if (!this.currentDocument) return
      
      try {
        this.isLoading = true
        
        // Update metadata and statistics
        this.metadata.updatedAt = new Date()
        this.metadata.hash = this.documentHash
        await this.updateDocumentStatistics()
        
        const stats = this.documentStatistics
        this.metadata.wordCount = stats.wordCount
        this.metadata.characterCount = stats.characterCount
        this.metadata.pageCount = stats.pageCount
        
        // Create version snapshot
        await this.createVersionSnapshot()
        
        // Update authorship
        await this.generateAuthorshipProof()
        
        // End current edit session and start new one
        this.endEditSession()
        this.startEditSession()
        
        this.isDirty = false
        this.lastSaved = new Date()
        
        // Trigger auto-save backup
        await this.createBackupVersion()
        
      } catch (error) {
        console.error('Failed to save document:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async autoSave() {
      if (!this.isDirty || !this.currentDocument || this.isAutoSaving) return
      
      try {
        this.isAutoSaving = true
        await this.updateDocumentStatistics()
        
        // Create lightweight backup
        const backupVersion: DocumentVersion = {
          id: `backup-${Date.now()}`,
          timestamp: new Date(),
          author: this.currentUser.name || 'Anonymous',
          changes: [],
          metadata: { ...this.metadata },
          content: JSON.parse(JSON.stringify(this.currentDocument))
        }
        
        this.backupVersions.push(backupVersion)
        
        // Keep only last 10 backup versions
        if (this.backupVersions.length > 10) {
          this.backupVersions.shift()
        }
        
        this.lastAutoSave = new Date()
        
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        this.isAutoSaving = false
      }
    },

    // Content management
    updateContent(content: DocumentContent) {
      this.currentDocument = content
      this.isDirty = true
      this.metadata.updatedAt = new Date()
      this.updateCurrentEditSession()
      this.updateDocumentIndex()
    },

    updateMetadata(updates: Partial<DocumentMetadata>) {
      this.metadata = { ...this.metadata, ...updates }
      this.isDirty = true
    },

    updateSettings(updates: Partial<DocumentSettings>) {
      this.settings = { ...this.settings, ...updates }
      this.isDirty = true
      
      // Update auto-save if interval changed
      if (updates.autoSaveInterval) {
        this.setupAutoSave()
      }
    },

    // Statistics and analysis
    async updateDocumentStatistics() {
      if (!this.currentDocument) return
      
      const stats = DocumentParser.getStatistics(this.currentDocument)
      this.statistics = {
        ...this.statistics,
        ...stats,
        lastEditTime: new Date()
      }
    },

    // Document structure management
    updateDocumentIndex() {
      if (!this.currentDocument) return
      
      this.documentIndex = DocumentParser.generateIndex(this.currentDocument)
    },

    // Comments and annotations
    addComment(comment: Omit<Comment, 'id' | 'timestamp'>) {
      const newComment: Comment = {
        ...comment,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        resolved: false,
        replies: []
      }
      
      this.comments.push(newComment)
      this.isDirty = true
      
      return newComment.id
    },

    addCommentReply(commentId: string, content: string, author: string) {
      const comment = this.comments.find(c => c.id === commentId)
      if (comment) {
        comment.replies.push({
          id: crypto.randomUUID(),
          author,
          content,
          timestamp: new Date()
        })
        this.isDirty = true
      }
    },

    resolveComment(commentId: string) {
      const comment = this.comments.find(c => c.id === commentId)
      if (comment) {
        comment.resolved = true
        this.isDirty = true
      }
    },

    deleteComment(commentId: string) {
      const index = this.comments.findIndex(c => c.id === commentId)
      if (index !== -1) {
        this.comments.splice(index, 1)
        this.isDirty = true
      }
    },

    // Annotations management
    addAnnotation(annotation: Omit<DocumentAnnotation, 'id' | 'timestamp'>) {
      const newAnnotation: DocumentAnnotation = {
        ...annotation,
        id: crypto.randomUUID(),
        timestamp: new Date()
      }
      
      this.annotations.push(newAnnotation)
      this.isDirty = true
      
      return newAnnotation.id
    },

    updateAnnotation(id: string, updates: Partial<DocumentAnnotation>) {
      const annotation = this.annotations.find(a => a.id === id)
      if (annotation) {
        Object.assign(annotation, updates)
        this.isDirty = true
      }
    },

    deleteAnnotation(id: string) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index !== -1) {
        this.annotations.splice(index, 1)
        this.isDirty = true
      }
    },

    // Bookmarks management
    addBookmark(name: string, position: number, note?: string, color?: string) {
      const bookmark: DocumentBookmark = {
        id: crypto.randomUUID(),
        name,
        position,
        timestamp: new Date(),
        note,
        color
      }
      
      this.bookmarks.push(bookmark)
      this.isDirty = true
      
      return bookmark.id
    },

    deleteBookmark(id: string) {
      const index = this.bookmarks.findIndex(b => b.id === id)
      if (index !== -1) {
        this.bookmarks.splice(index, 1)
        this.isDirty = true
      }
    },

    // Footnotes and endnotes
    addFootnote(content: string, position: number) {
      const footnote: FootnoteEndnote = {
        id: crypto.randomUUID(),
        type: 'footnote',
        number: this.footnotes.length + 1,
        content,
        position,
        pageNumber: Math.ceil(position / 500) // Rough estimation
      }
      
      this.footnotes.push(footnote)
      this.isDirty = true
      
      return footnote.id
    },

    addEndnote(content: string, position: number) {
      const endnote: FootnoteEndnote = {
        id: crypto.randomUUID(),
        type: 'endnote',
        number: this.endnotes.length + 1,
        content,
        position,
        pageNumber: Math.ceil(position / 500)
      }
      
      this.endnotes.push(endnote)
      this.isDirty = true
      
      return endnote.id
    },

    // User and session management
    setCurrentUser(user: { name: string; wallet: string; publicKey: string; privateKey: string }) {
      this.currentUser = user
    },

    startEditSession() {
      this.currentEditSession = {
        id: crypto.randomUUID(),
        startTime: new Date(),
        endTime: new Date(),
        wordsAdded: 0,
        wordsRemoved: 0,
        timeSpent: 0,
        author: this.currentUser.name || 'Anonymous'
      }
    },

    updateCurrentEditSession() {
      if (this.currentEditSession) {
        const stats = this.documentStatistics
        // This is simplified - would need to track actual word changes
        this.currentEditSession.wordsAdded = stats.wordCount
        this.currentEditSession.endTime = new Date()
        this.currentEditSession.timeSpent = 
          this.currentEditSession.endTime.getTime() - this.currentEditSession.startTime.getTime()
      }
    },

    endEditSession() {
      if (this.currentEditSession) {
        this.updateCurrentEditSession()
        this.statistics.editSessions.push(this.currentEditSession)
        this.currentEditSession = null
      }
    },

    // Authorship and verification
    async generateAuthorshipProof() {
      if (!this.currentDocument || !this.currentUser.privateKey) return
      
      const content = JSON.stringify(this.currentDocument)
      
      const block: AuthorBlock = {
        id: crypto.randomUUID(),
        author: this.currentUser.name,
        authorWallet: this.currentUser.wallet,
        content: content,
        hash: ChainPaperCrypto.createHash(content),
        signature: ChainPaperCrypto.signContent(content, this.currentUser.privateKey),
        timestamp: new Date(),
        position: { from: 0, to: content.length }
      }
      
      this.authorshipBlocks.push(block)
      
      // Generate document-level authorship proof
      const proof = ChainPaperCrypto.createAuthorshipProof(
        this.metadata.id,
        content,
        this.currentUser.wallet,
        this.currentUser.privateKey,
        this.authorshipBlocks
      )
      
      this.authorshipProof = proof
      this.metadata.authorshipProof = JSON.stringify(proof)
    },

    async verifyAuthorship(): Promise<VerificationResult> {
      if (!this.currentDocument || !this.metadata.authorshipProof) {
        return { 
          isValid: false, 
          author: '', 
          timestamp: new Date(), 
          confidence: 0,
          details: {
            signatureValid: false,
            hashValid: false,
            timestampValid: false,
            chainValid: false
          }
        }
      }
      
      try {
        const proof = JSON.parse(this.metadata.authorshipProof)
        const content = JSON.stringify(this.currentDocument)
        
        const result = ChainPaperCrypto.verifyAuthorshipProof(
          proof,
          content,
          this.currentUser.publicKey
        )
        
        return result
      } catch (error) {
        return { 
          isValid: false, 
          author: '', 
          timestamp: new Date(), 
          confidence: 0,
          details: {
            signatureValid: false,
            hashValid: false,
            timestampValid: false,
            chainValid: false
          }
        }
      }
    },

    // Version management
    async createVersionSnapshot(description?: string) {
      if (!this.currentDocument) return
      
      const version: DocumentVersion = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        author: this.currentUser.name || 'Anonymous',
        changes: [], // Would be populated by diff algorithm
        metadata: { ...this.metadata },
        content: JSON.parse(JSON.stringify(this.currentDocument))
      }
      
      this.versions.push(version)
      this.currentVersionId = version.id
      
      // Keep only last 50 versions to prevent memory bloat
      if (this.versions.length > 50) {
        this.versions.shift()
      }
    },

    async restoreVersion(versionId: string) {
      const version = this.versions.find(v => v.id === versionId)
      if (version) {
        this.currentDocument = JSON.parse(JSON.stringify(version.content))
        this.metadata = { ...version.metadata }
        this.currentVersionId = versionId
        this.isDirty = true
        await this.updateDocumentStatistics()
      }
    },

    async createBackupVersion() {
      const backup: DocumentVersion = {
        id: `backup-${Date.now()}`,
        timestamp: new Date(),
        author: this.currentUser.name || 'Anonymous',
        changes: [],
        metadata: { ...this.metadata },
        content: JSON.parse(JSON.stringify(this.currentDocument))
      }
      
      this.backupVersions.push(backup)
      
      // Keep only last 10 backups
      if (this.backupVersions.length > 10) {
        this.backupVersions.shift()
      }
    },

    // Auto-save management
    setupAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
      }
      
      if (this.settings.autoSave) {
        this.autoSaveTimer = setInterval(() => {
          if (this.isDirty && this.currentDocument) {
            this.autoSave()
          }
        }, this.settings.autoSaveInterval)
      }
    },

    disableAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
      }
    },

    // Search and replace
    searchInDocument(query: string, options: any = {}) {
      if (!this.currentDocument) return []
      
      const text = DocumentParser.extractPlainText(this.currentDocument)
      const results: { from: number; to: number; text: string }[] = []
      
      let searchText = text
      let searchQuery = query
      
      if (!options.caseSensitive) {
        searchText = text.toLowerCase()
        searchQuery = query.toLowerCase()
      }
      
      let index = 0
      while (index < searchText.length) {
        const found = searchText.indexOf(searchQuery, index)
        if (found === -1) break
        
        results.push({
          from: found,
          to: found + query.length,
          text: text.substring(found, found + query.length)
        })
        
        index = found + 1
      }
      
      this.searchResults = results
      this.currentSearchIndex = 0
      
      return results
    },

    replaceInDocument(query: string, replacement: string, replaceAll: boolean = false) {
      if (!this.currentDocument || this.searchResults.length === 0) return
      
      // This would need to be implemented with proper ProseMirror transactions
      // For now, this is a placeholder implementation
      console.log('Replace functionality would be implemented here')
    },

    // Templates management
    loadTemplate(template: DocumentTemplate) {
      this.currentDocument = JSON.parse(JSON.stringify(template.content))
      this.settings = { ...this.settings, ...template.settings }
      this.metadata.title = template.name
      this.isDirty = true
    },

    saveAsTemplate(name: string, description: string, category: string) {
      if (!this.currentDocument) return
      
      const template: DocumentTemplate = {
        id: crypto.randomUUID(),
        name,
        description,
        category,
        thumbnail: '', // Would be generated
        content: JSON.parse(JSON.stringify(this.currentDocument)),
        metadata: { ...this.metadata },
        settings: { ...this.settings },
        variables: []
      }
      
      this.availableTemplates.push(template)
      return template.id
    },

    // Export functionality
    async exportDocument(format: string, options: any = {}) {
      if (!this.currentDocument) throw new Error('No document to export')
      
      this.isExporting = true
      this.exportProgress = 0
      
      try {
        const { DocumentExporter } = await import('~/utils/document-parser')
        
        const exportData = {
          chainPaper: true,
          version: '1.0',
          metadata: this.metadata,
          content: this.currentDocument,
          settings: this.settings,
          comments: options.includeComments ? this.comments : [],
          annotations: options.includeComments ? this.annotations : [],
          authorshipBlocks: options.includeAuthorship ? this.authorshipBlocks : [],
          authorshipProof: options.includeAuthorship ? this.authorshipProof : null,
          statistics: options.includeMetadata ? this.statistics : null,
          documentIndex: this.documentIndex,
          bookmarks: this.bookmarks,
          footnotes: this.footnotes,
          endnotes: this.endnotes
        }
        
        this.exportProgress = 50
        
        switch (format) {
          case 'json':
            await DocumentExporter.exportAsJSON(exportData, options)
            break
          case 'pdf':
            await DocumentExporter.exportAsPDF(exportData, options)
            break
          case 'docx':
            await DocumentExporter.exportAsDOCX(exportData, options)
            break
          case 'html':
            await DocumentExporter.exportAsHTML(exportData, options)
            break
          case 'markdown':
            await DocumentExporter.exportAsMarkdown(exportData, options)
            break
          case 'txt':
            await DocumentExporter.exportAsText(exportData, options)
            break
          default:
            throw new Error(`Unsupported export format: ${format}`)
        }
        
        this.exportProgress = 100
        
      } catch (error) {
        console.error('Export failed:', error)
        throw error
      } finally {
        this.isExporting = false
        this.exportProgress = 0
      }
    },

    // Import functionality
    async importDocument(file: File, format?: string) {
      this.isImporting = true
      this.importProgress = 0
      
      try {
        const { DocumentImporter } = await import('~/utils/document-parser')
        
        this.importProgress = 25
        
        let data: any
        const detectedFormat = format || file.name.split('.').pop()?.toLowerCase()
        
        switch (detectedFormat) {
          case 'json':
            data = await DocumentImporter.importFromJSON(file)
            break
          case 'docx':
            data = await DocumentImporter.importFromDOCX(file)
            break
          case 'html':
            data = await DocumentImporter.importFromHTML(file)
            break
          case 'txt':
            data = await DocumentImporter.importFromText(file)
            break
          default:
            throw new Error(`Unsupported import format: ${detectedFormat}`)
        }
        
        this.importProgress = 75
        
        await this.loadDocument(data)
        
        this.importProgress = 100
        
      } catch (error) {
        console.error('Import failed:', error)
        throw error
      } finally {
        this.isImporting = false
        this.importProgress = 0
      }
    },

    // Utility methods
    resetDocumentState() {
      this.versions = []
      this.comments = []
      this.annotations = []
      this.footnotes = []
      this.endnotes = []
      this.authorshipBlocks = []
      this.bookmarks = []
      this.searchResults = []
      this.spellCheckErrors = []
      this.isDirty = false
      this.lastSaved = new Date()
    },

    addToRecentDocuments() {
      const recentDoc = {
        id: this.metadata.id,
        title: this.metadata.title,
        lastOpened: new Date()
      }
      
      // Remove if already exists
      const existingIndex = this.recentDocuments.findIndex(doc => doc.id === recentDoc.id)
      if (existingIndex !== -1) {
        this.recentDocuments.splice(existingIndex, 1)
      }
      
      // Add to beginning
      this.recentDocuments.unshift(recentDoc)
      
      // Keep only last 10
      if (this.recentDocuments.length > 10) {
        this.recentDocuments.pop()
      }
    },

    // Cleanup
    cleanup() {
      this.disableAutoSave()
      this.endEditSession()
    }
  }
})
