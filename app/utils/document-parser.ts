// Import file-saver only on client side to avoid SSR issues
let saveAs: any = null

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import * as mammoth from 'mammoth'
import type { 
  DocumentContent, 
  DocumentMetadata, 
  DocumentType,
  DocumentNode,
  DocumentStatistics,
  DocumentIndex,
  TOCEntry,
  FigureEntry,
  TableEntry
} from '~/types/document'

export class DocumentParser {
  /**
   * Initialize file-saver for client-side only
   */
  private static async ensureFileSaver() {
    if (!process.client) {
      throw new Error('Export is only available on the client side')
    }
    
    if (!saveAs) {
      const { saveAs: fileSaver } = await import('file-saver')
      saveAs = fileSaver
    }
  }

  /**
   * Get comprehensive document statistics
   */
  static getStatistics(doc: DocumentContent): DocumentStatistics {
    const stats = {
      wordCount: 0,
      characterCount: 0,
      characterCountNoSpaces: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      pageCount: 1,
      sectionCount: 0,
      headingCount: {} as { [level: number]: number },
      listCount: 0,
      tableCount: 0,
      imageCount: 0,
      linkCount: 0,
      readingTime: 0,
      writingTime: 0,
      lastEditTime: new Date(),
      editSessions: []
    }

    const processNode = (node: DocumentNode) => {
      if (node.type === 'text') {
        const text = node.text || ''
        stats.characterCount += text.length
        stats.characterCountNoSpaces += text.replace(/\s/g, '').length
        
        // Word count (split by whitespace and filter empty strings)
        const words = text.split(/\s+/).filter(word => word.length > 0)
        stats.wordCount += words.length
        
        // Sentence count (rough estimation based on sentence-ending punctuation)
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
        stats.sentenceCount += sentences.length
      }
      
      if (node.type === 'paragraph') {
        stats.paragraphCount++
      }
      
      if (node.type === 'heading') {
        stats.headerCount++
      }
      
      if (node.type === 'image') {
        stats.imageCount++
      }
      
      if (node.type === 'table') {
        stats.tableCount++
      }
      
      if (node.type === 'link') {
        stats.linkCount++
      }
      
      if (node.type === 'footnote') {
        stats.footnoteCount++
      }
      
      // Process child nodes
      if (node.content) {
        node.content.forEach(processNode)
      }
    }

    if (doc.content) {
      doc.content.forEach(processNode)
    }

    // Calculate reading time (average 200 words per minute)
    stats.readingTime = Math.ceil(stats.wordCount / 200)
    
    // Estimate page count (roughly 500 words per page)
    stats.pageCount = Math.max(1, Math.ceil(stats.wordCount / 500))

    return stats
  }

  /**
   * Generate document index with table of contents and other references
   */
  static generateIndex(doc: DocumentContent): DocumentIndex {
    const tableOfContents: TOCEntry[] = []
    const figures: FigureEntry[] = []
    const tables: TableEntry[] = []
    
    let figureCounter = 1
    let tableCounter = 1

    const processNode = (node: DocumentNode, position: number = 0) => {
      if (node.type === 'heading') {
        const level = node.attrs?.level || 1
        const title = this.extractTextFromNode(node)
        
        tableOfContents.push({
          id: `heading-${tableOfContents.length + 1}`,
          title,
          level,
          position,
          page: Math.ceil(position / 500) + 1
        })
      }
      
      if (node.type === 'image') {
        const caption = node.attrs?.alt || node.attrs?.title || `Figure ${figureCounter}`
        figures.push({
          id: `figure-${figureCounter}`,
          caption,
          position,
          page: Math.ceil(position / 500) + 1,
          src: node.attrs?.src || ''
        })
        figureCounter++
      }
      
      if (node.type === 'table') {
        const caption = node.attrs?.caption || `Table ${tableCounter}`
        tables.push({
          id: `table-${tableCounter}`,
          caption,
          position,
          page: Math.ceil(position / 500) + 1,
          rows: node.content?.length || 0,
          columns: node.content?.[0]?.content?.length || 0
        })
        tableCounter++
      }
      
      // Process child nodes
      if (node.content) {
        node.content.forEach((child, index) => {
          processNode(child, position + index)
        })
      }
    }

    if (doc.content) {
      doc.content.forEach((node, index) => {
        processNode(node, index)
      })
    }

    return {
      tableOfContents,
      figures,
      tables,
      lastUpdated: new Date()
    }
  }

  /**
   * Extract plain text from a document node
   */
  private static extractTextFromNode(node: DocumentNode): string {
    if (node.type === 'text') {
      return node.text || ''
    }
    
    if (node.content) {
      return node.content.map(child => this.extractTextFromNode(child)).join('')
    }
    
    return ''
  }

  /**
   * Calculate reading statistics
   */
  static calculateStatistics(content: DocumentContent): DocumentStatistics {
    return this.getStatistics(content)
  }

  /**
   * Export document to JSON format
   */
  static async exportToJSON(document: DocumentType, fileName: string = 'document.json'): Promise<void> {
    try {
      await this.ensureFileSaver()

      const exportData = {
        metadata: document.metadata,
        content: document.content,
        authorship: document.authorship,
        settings: document.settings,
        comments: document.comments,
        statistics: this.calculateStatistics(document.content),
        version: '1.0.0',
        exportDate: new Date().toISOString()
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error exporting to JSON:', error)
      throw error
    }
  }

  /**
   * Import document from JSON format
   */
  static async importFromJSON(file: File): Promise<DocumentType> {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate the imported data structure
      if (!data.metadata || !data.content) {
        throw new Error('Invalid document format: missing required fields')
      }
      
      return {
        id: data.metadata.id || crypto.randomUUID(),
        title: data.metadata.title || 'Untitled Document',
        metadata: data.metadata,
        content: data.content,
        authorship: data.authorship || {
          author: 'Unknown',
          created: new Date(),
          modified: new Date(),
          version: '1.0.0',
          hash: '',
          signature: '',
          isVerified: false
        },
        settings: data.settings || {
          pageSize: 'A4',
          margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineHeight: 1.5,
          language: 'en-US'
        },
        comments: data.comments || [],
        lastModified: new Date(),
        isDirty: false
      }
    } catch (error) {
      console.error('Error importing from JSON:', error)
      throw error
    }
  }

  /**
   * Export document to HTML format
   */
  static async exportToHTML(document: DocumentType, fileName: string = 'document.html'): Promise<void> {
    try {
      await this.ensureFileSaver()

      const html = this.convertToHTML(document)
      const blob = new Blob([html], { type: 'text/html' })
      
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error exporting to HTML:', error)
      throw error
    }
  }

  /**
   * Convert document to HTML
   */
  private static convertToHTML(document: DocumentType): string {
    const metadata = document.metadata
    const content = this.contentToHTML(document.content)
    
    return `<!DOCTYPE html>
<html lang="${document.settings.language || 'en-US'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <meta name="author" content="${metadata.author}">
    <meta name="description" content="${metadata.description || ''}">
    <meta name="keywords" content="${metadata.tags?.join(', ') || ''}">
    <style>
        body {
            font-family: ${document.settings.fontFamily || 'Times New Roman'}, serif;
            font-size: ${document.settings.fontSize || 12}pt;
            line-height: ${document.settings.lineHeight || 1.5};
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: white;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        p {
            margin-bottom: 1em;
            text-align: justify;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1em;
            margin: 1em 0;
            font-style: italic;
            background: #f8f9fa;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 0.5em;
            text-align: left;
        }
        th {
            background: #f8f9fa;
            font-weight: bold;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
        }
        code {
            background: #f8f9fa;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f8f9fa;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
        }
        .page-break {
            page-break-before: always;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>${metadata.title}</h1>
        <p><strong>Author:</strong> ${metadata.author}</p>
        <p><strong>Created:</strong> ${metadata.created?.toLocaleDateString()}</p>
        ${metadata.description ? `<p><strong>Description:</strong> ${metadata.description}</p>` : ''}
    </header>
    
    <main>
        ${content}
    </main>
    
    <footer>
        <hr>
        <p><small>Generated by ChainPaper on ${new Date().toLocaleDateString()}</small></p>
    </footer>
</body>
</html>`
  }

  /**
   * Convert document content to HTML
   */
  private static contentToHTML(content: DocumentContent): string {
    if (!content?.content) return ''
    
    return content.content.map(node => this.nodeToHTML(node)).join('')
  }

  /**
   * Convert a single node to HTML
   */
  private static nodeToHTML(node: DocumentNode): string {
    switch (node.type) {
      case 'paragraph':
        const pContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<p>${pContent}</p>`
      
      case 'heading':
        const level = Math.min(6, Math.max(1, node.attrs?.level || 1))
        const hContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<h${level}>${hContent}</h${level}>`
      
      case 'text':
        let text = node.text || ''
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`
                break
              case 'italic':
                text = `<em>${text}</em>`
                break
              case 'underline':
                text = `<u>${text}</u>`
                break
              case 'code':
                text = `<code>${text}</code>`
                break
              case 'link':
                text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`
                break
            }
          }
        }
        return text
      
      case 'hard_break':
        return '<br>'
      
      case 'image':
        const src = node.attrs?.src || ''
        const alt = node.attrs?.alt || ''
        const title = node.attrs?.title || ''
        return `<img src="${src}" alt="${alt}" title="${title}">`
      
      case 'blockquote':
        const bqContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<blockquote>${bqContent}</blockquote>`
      
      case 'bullet_list':
        const ulContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<ul>${ulContent}</ul>`
      
      case 'ordered_list':
        const olContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<ol>${olContent}</ol>`
      
      case 'list_item':
        const liContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<li>${liContent}</li>`
      
      case 'table':
        const tableContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<table>${tableContent}</table>`
      
      case 'table_row':
        const trContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<tr>${trContent}</tr>`
      
      case 'table_cell':
        const tdContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<td>${tdContent}</td>`
      
      case 'table_header':
        const thContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<th>${thContent}</th>`
      
      case 'code_block':
        const codeContent = node.content ? node.content.map(child => this.nodeToHTML(child)).join('') : ''
        return `<pre><code>${codeContent}</code></pre>`
      
      default:
        // For unknown node types, try to render content if available
        if (node.content) {
          return node.content.map(child => this.nodeToHTML(child)).join('')
        }
        return ''
    }
  }

  /**
   * Export document to PDF format
   */
  static async exportToPDF(document: DocumentType, fileName: string = 'document.pdf'): Promise<void> {
    try {
      await this.ensureFileSaver()

      // Create HTML content
      const html = this.convertToHTML(document)
      
      // Create a temporary container
      const container = globalThis.document.createElement('div')
      container.innerHTML = html
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.width = '8.5in'
      globalThis.document.body.appendChild(container)
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        useCORS: true,
        scale: 2,
        logging: false
      })
      
      // Remove temporary container
      globalThis.document.body.removeChild(container)
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const pdfBlob = pdf.output('blob')
      saveAs(pdfBlob, fileName)
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      throw error
    }
  }

  /**
   * Export document to DOCX format
   */
  static async exportToDOCX(document: DocumentType, fileName: string = 'document.docx'): Promise<void> {
    try {
      await this.ensureFileSaver()

      const docxDoc = new Document({
        creator: document.metadata.author,
        title: document.metadata.title,
        description: document.metadata.description,
        sections: [{
          properties: {},
          children: this.contentToDOCX(document.content)
        }]
      })
      
      const buffer = await Packer.toBuffer(docxDoc)
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error exporting to DOCX:', error)
      throw error
    }
  }

  /**
   * Convert document content to DOCX paragraphs
   */
  private static contentToDOCX(content: DocumentContent): Paragraph[] {
    if (!content?.content) return []
    
    const paragraphs: Paragraph[] = []
    
    for (const node of content.content) {
      const para = this.nodeToDOCX(node)
      if (para) {
        if (Array.isArray(para)) {
          paragraphs.push(...para)
        } else {
          paragraphs.push(para)
        }
      }
    }
    
    return paragraphs
  }

  /**
   * Convert a single node to DOCX paragraph
   */
  private static nodeToDOCX(node: DocumentNode): Paragraph | Paragraph[] | null {
    switch (node.type) {
      case 'paragraph':
        return new Paragraph({
          children: node.content ? this.nodeContentToTextRuns(node.content) : []
        })
      
      case 'heading':
        const level = Math.min(6, Math.max(1, node.attrs?.level || 1)) as HeadingLevel
        return new Paragraph({
          heading: level,
          children: node.content ? this.nodeContentToTextRuns(node.content) : []
        })
      
      default:
        if (node.content) {
          return this.contentToDOCX(node.content)
        }
        return null
    }
  }

  /**
   * Convert node content to TextRun objects
   */
  private static nodeContentToTextRuns(content: DocumentNode[]): TextRun[] {
    const textRuns: TextRun[] = []
    
    for (const node of content) {
      if (node.type === 'text') {
        const text = node.text || ''
        const formatting: any = {}
        
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                formatting.bold = true
                break
              case 'italic':
                formatting.italics = true
                break
              case 'underline':
                formatting.underline = {}
                break
            }
          }
        }
        
        textRuns.push(new TextRun({
          text,
          ...formatting
        }))
      }
    }
    
    return textRuns
  }

  /**
   * Import document from DOCX format
   */
  static async importFromDOCX(file: File): Promise<DocumentType> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      
      // Parse the HTML and convert to our document format
      const parser = new DOMParser()
      const doc = parser.parseFromString(result.value, 'text/html')
      
      const content = this.htmlToContent(doc.body)
      
      return {
        id: crypto.randomUUID(),
        title: file.name.replace('.docx', ''),
        metadata: {
          id: crypto.randomUUID(),
          title: file.name.replace('.docx', ''),
          author: 'Unknown',
          created: new Date(),
          modified: new Date(),
          description: '',
          tags: [],
          category: '',
          language: 'en-US',
          version: '1.0.0'
        },
        content,
        authorship: {
          author: 'Unknown',
          created: new Date(),
          modified: new Date(),
          version: '1.0.0',
          hash: '',
          signature: '',
          isVerified: false
        },
        settings: {
          pageSize: 'A4',
          margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineHeight: 1.5,
          language: 'en-US'
        },
        comments: [],
        lastModified: new Date(),
        isDirty: false
      }
    } catch (error) {
      console.error('Error importing from DOCX:', error)
      throw error
    }
  }

  /**
   * Convert HTML to our document content format
   */
  private static htmlToContent(element: Element): DocumentContent {
    const content: DocumentNode[] = []
    
    for (const child of Array.from(element.childNodes)) {
      const node = this.htmlNodeToDocumentNode(child)
      if (node) {
        content.push(node)
      }
    }
    
    return { content }
  }

  /**
   * Convert HTML node to document node
   */
  private static htmlNodeToDocumentNode(node: Node): DocumentNode | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        return {
          type: 'text',
          text
        }
      }
      return null
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      
      switch (tagName) {
        case 'p':
          return {
            type: 'paragraph',
            content: this.getChildNodes(element)
          }
        
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          return {
            type: 'heading',
            attrs: { level: parseInt(tagName.charAt(1)) },
            content: this.getChildNodes(element)
          }
        
        case 'strong':
        case 'b':
          const boldContent = this.getChildNodes(element)
          return boldContent.length === 1 && boldContent[0].type === 'text' ? {
            type: 'text',
            text: boldContent[0].text,
            marks: [{ type: 'bold' }]
          } : {
            type: 'paragraph',
            content: boldContent.map(child => ({
              ...child,
              marks: [...(child.marks || []), { type: 'bold' }]
            }))
          }
        
        case 'em':
        case 'i':
          const italicContent = this.getChildNodes(element)
          return italicContent.length === 1 && italicContent[0].type === 'text' ? {
            type: 'text',
            text: italicContent[0].text,
            marks: [{ type: 'italic' }]
          } : {
            type: 'paragraph',
            content: italicContent.map(child => ({
              ...child,
              marks: [...(child.marks || []), { type: 'italic' }]
            }))
          }
        
        case 'br':
          return {
            type: 'hard_break'
          }
        
        default:
          // For other elements, try to extract child content
          const children = this.getChildNodes(element)
          if (children.length > 0) {
            return {
              type: 'paragraph',
              content: children
            }
          }
          return null
      }
    }
    
    return null
  }

  /**
   * Get child nodes from HTML element
   */
  private static getChildNodes(element: Element): DocumentNode[] {
    const nodes: DocumentNode[] = []
    
    for (const child of Array.from(element.childNodes)) {
      const node = this.htmlNodeToDocumentNode(child)
      if (node) {
        nodes.push(node)
      }
    }
    
    return nodes
  }

  /**
   * Import document from various formats
   */
  static async importDocument(file: File): Promise<DocumentType> {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'json':
        return this.importFromJSON(file)
      case 'docx':
        return this.importFromDOCX(file)
      case 'html':
      case 'htm':
        return this.importFromHTML(file)
      default:
        throw new Error(`Unsupported file format: ${extension}`)
    }
  }

  /**
   * Import document from HTML format
   */
  static async importFromHTML(file: File): Promise<DocumentType> {
    try {
      const text = await file.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')
      
      const title = doc.querySelector('title')?.textContent || file.name.replace('.html', '')
      const content = this.htmlToContent(doc.body || doc.documentElement)
      
      return {
        id: crypto.randomUUID(),
        title,
        metadata: {
          id: crypto.randomUUID(),
          title,
          author: 'Unknown',
          created: new Date(),
          modified: new Date(),
          description: '',
          tags: [],
          category: '',
          language: 'en-US',
          version: '1.0.0'
        },
        content,
        authorship: {
          author: 'Unknown',
          created: new Date(),
          modified: new Date(),
          version: '1.0.0',
          hash: '',
          signature: '',
          isVerified: false
        },
        settings: {
          pageSize: 'A4',
          margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineHeight: 1.5,
          language: 'en-US'
        },
        comments: [],
        lastModified: new Date(),
        isDirty: false
      }
    } catch (error) {
      console.error('Error importing from HTML:', error)
      throw error
    }
  }
}
