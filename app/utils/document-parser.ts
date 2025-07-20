// Dynamic imports for browser-only libraries
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
// import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
// import * as mammoth from 'mammoth'
import type { 
  DocumentContent, 
  DocumentMetadata, 
  ExportOptions, 
  DocumentNode,
  DocumentStatistics,
  DocumentIndex,
  TOCEntry,
  FigureEntry,
  TableEntry
} from '~/types/document'

// Client-side only file download function
function downloadFile(blob: Blob, fileName: string) {
  if (typeof window === 'undefined') {
    console.warn('downloadFile called on server side')
    return
  }
  
  // Simple fallback without file-saver
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export class DocumentParser {
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
      switch (node.type) {
        case 'paragraph':
          stats.paragraphCount++
          break
        case 'heading':
          const level = node.attrs?.level || 1
          stats.headingCount[level] = (stats.headingCount[level] || 0) + 1
          stats.sectionCount++
          break
        case 'bullet_list':
        case 'ordered_list':
          stats.listCount++
          break
        case 'table':
          stats.tableCount++
          break
        case 'image':
          stats.imageCount++
          break
        case 'text':
          const text = node.text || ''
          stats.characterCount += text.length
          stats.characterCountNoSpaces += text.replace(/\s/g, '').length
          stats.wordCount += text.split(/\s+/).filter(word => word.length > 0).length
          stats.sentenceCount += text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length
          
          // Count links in marks
          if (node.marks) {
            stats.linkCount += node.marks.filter(mark => mark.type === 'link').length
          }
          break
      }

      if (node.content) {
        node.content.forEach(processNode)
      }
    }

    doc.content.forEach(processNode)

    // Estimate page count (assuming ~250 words per page)
    stats.pageCount = Math.max(1, Math.ceil(stats.wordCount / 250))
    
    // Estimate reading time (assuming 200 words per minute)
    stats.readingTime = Math.ceil(stats.wordCount / 200)

    return stats
  }

  /**
   * Extract plain text from document
   */
  static extractPlainText(doc: DocumentContent): string {
    const extractText = (node: DocumentNode): string => {
      if (node.text) {
        return node.text
      }
      
      if (node.content) {
        return node.content.map(extractText).join('')
      }
      
      return ''
    }
    
    return extractText(doc)
  }

  /**
   * Generate document index (TOC, figures, tables, etc.)
   */
  static generateIndex(doc: DocumentContent): DocumentIndex {
    const index: DocumentIndex = {
      tableOfContents: [],
      figures: [],
      tables: [],
      references: [],
      glossary: []
    }

    let position = 0
    let pageNumber = 1
    let wordCount = 0

    const processNode = (node: DocumentNode) => {
      const nodeStart = position

      switch (node.type) {
        case 'heading':
          const level = node.attrs?.level || 1
          const title = node.content ? this.extractPlainText({ type: 'doc', content: node.content }) : ''
          
          index.tableOfContents.push({
            id: `heading-${index.tableOfContents.length}`,
            level,
            title,
            pageNumber,
            position
          })
          break
          
        case 'image':
          const caption = node.attrs?.alt || `Figure ${index.figures.length + 1}`
          index.figures.push({
            id: `figure-${index.figures.length}`,
            caption,
            type: 'image',
            pageNumber,
            position
          })
          break
          
        case 'table':
          let rows = 0
          let columns = 0
          if (node.content) {
            rows = node.content.length
            if (node.content[0] && node.content[0].content) {
              columns = node.content[0].content.length
            }
          }
          
          index.tables.push({
            id: `table-${index.tables.length}`,
            caption: `Table ${index.tables.length + 1}`,
            pageNumber,
            position,
            rows,
            columns
          })
          break
          
        case 'text':
          const text = node.text || ''
          position += text.length
          wordCount += text.split(/\s+/).filter(word => word.length > 0).length
          
          // Update page number based on word count (rough estimation)
          pageNumber = Math.max(1, Math.ceil(wordCount / 250))
          break
      }

      if (node.content) {
        node.content.forEach(processNode)
      }
    }

    doc.content.forEach(processNode)
    return index
  }

  /**
   * Convert ProseMirror document to plain text
   */
  static toPlainText(doc: DocumentContent): string {
    return this.extractPlainText(doc)
  }

  /**
   * Convert ProseMirror document to HTML
   */
  static toHTML(doc: DocumentContent): string {
    const nodeToHTML = (node: DocumentNode): string => {
      switch (node.type) {
        case 'paragraph':
          const content = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<p>${content}</p>`
          
        case 'heading':
          const level = node.attrs?.level || 1
          const headingContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<h${level}>${headingContent}</h${level}>`
          
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
                case 'link':
                  text = `<a href="${mark.attrs?.href || ''}">${text}</a>`
                  break
              }
            }
          }
          return text
          
        case 'hard_break':
          return '<br>'
          
        case 'bullet_list':
          const bulletItems = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<ul>${bulletItems}</ul>`
          
        case 'ordered_list':
          const orderedItems = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<ol>${orderedItems}</ol>`
          
        case 'list_item':
          const itemContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<li>${itemContent}</li>`
          
        case 'blockquote':
          const quoteContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<blockquote>${quoteContent}</blockquote>`
          
        case 'code_block':
          const codeContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<pre><code>${codeContent}</code></pre>`
          
        case 'table':
          const tableContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<table>${tableContent}</table>`
          
        case 'table_row':
          const rowContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          return `<tr>${rowContent}</tr>`
          
        case 'table_cell':
        case 'table_header':
          const cellContent = node.content ? node.content.map(nodeToHTML).join('') : ''
          const tag = node.type === 'table_header' ? 'th' : 'td'
          return `<${tag}>${cellContent}</${tag}>`
          
        case 'image':
          return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" />`
          
        default:
          if (node.content) {
            return node.content.map(nodeToHTML).join('')
          }
          return ''
      }
    }
    
    const html = doc.content.map(nodeToHTML).join('')
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ChainPaper Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { color: #333; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
${html}
</body>
</html>`
  }

  /**
   * Convert ProseMirror document to Markdown
   */
  static toMarkdown(doc: DocumentContent): string {
    const nodeToMarkdown = (node: DocumentNode): string => {
      switch (node.type) {
        case 'paragraph':
          const content = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return content + '\n\n'
          
        case 'heading':
          const level = node.attrs?.level || 1
          const headingContent = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return '#'.repeat(level) + ' ' + headingContent + '\n\n'
          
        case 'text':
          let text = node.text || ''
          if (node.marks) {
            for (const mark of node.marks) {
              switch (mark.type) {
                case 'bold':
                  text = `**${text}**`
                  break
                case 'italic':
                  text = `*${text}*`
                  break
                case 'code':
                  text = `\`${text}\``
                  break
                case 'link':
                  text = `[${text}](${mark.attrs?.href || ''})`
                  break
              }
            }
          }
          return text
          
        case 'hard_break':
          return '\n'
          
        case 'bullet_list':
          const bulletItems = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return bulletItems + '\n'
          
        case 'ordered_list':
          const orderedItems = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return orderedItems + '\n'
          
        case 'list_item':
          const itemContent = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return `- ${itemContent}\n`
          
        case 'blockquote':
          const quoteContent = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          return `> ${quoteContent}\n\n`
          
        case 'code_block':
          const codeContent = node.content ? node.content.map(nodeToMarkdown).join('') : ''
          const language = node.attrs?.language || ''
          return `\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`
          
        case 'horizontal_rule':
          return '---\n\n'
          
        case 'image':
          return `![${node.attrs?.alt || ''}](${node.attrs?.src || ''})\n\n`
          
        default:
          if (node.content) {
            return node.content.map(nodeToMarkdown).join('')
          }
          return ''
      }
    }
    
    return doc.content.map(nodeToMarkdown).join('').trim()
  }
}

export class DocumentExporter {
  /**
   * Export document as JSON
   */
  static async exportAsJSON(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    const exportData = {
      chainPaper: true,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      ...data,
      options
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const fileName = filename || `${data.metadata?.title || 'document'}.chainpaper.json`
    downloadFile(blob, fileName)
  }

  /**
   * Export document as PDF
   */
  static async exportAsPDF(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      console.warn('PDF export not available in SSR')
      return
    }
    
    // Create HTML content for PDF generation
    const htmlContent = DocumentParser.toHTML(data.content)
    
    // Create temporary element for rendering
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.width = '210mm' // A4 width
    tempDiv.style.fontFamily = 'Times New Roman, serif'
    tempDiv.style.fontSize = '12pt'
    tempDiv.style.lineHeight = '1.5'
    tempDiv.style.padding = '25mm'
    tempDiv.style.background = 'white'
    
    document.body.appendChild(tempDiv)
    
    try {
      // Dynamic imports for browser-only libraries
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: options.pageSize?.toLowerCase() || 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0
      
      // Add metadata header if requested
      if (options.includeMetadata && data.metadata) {
        pdf.setFontSize(8)
        pdf.setTextColor(128, 128, 128)
        pdf.text(`${data.metadata.title} - ${data.metadata.author}`, 10, 5)
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pdfWidth - 40, 5)
      }
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      const fileName = filename || `${data.metadata?.title || 'document'}.pdf`
      pdf.save(fileName)
      
    } finally {
      document.body.removeChild(tempDiv)
    }
  }

  /**
   * Export document as DOCX
   */
  static async exportAsDOCX(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      console.warn('DOCX export not available in SSR')
      return
    }
    
    // Dynamic import for docx library
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')
    
    const docElements: any[] = []
    
    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.metadata.title,
              bold: true,
              size: 32
            })
          ],
          heading: HeadingLevel.TITLE
        }),
        new Paragraph({
          children: [
            new TextRun(`Author: ${data.metadata.author}`),
            new TextRun({ text: "\n", break: 1 }),
            new TextRun(`Created: ${new Date(data.metadata.createdAt).toLocaleDateString()}`),
            new TextRun({ text: "\n", break: 1 }),
            new TextRun(`Version: ${data.metadata.version}`)
          ]
        }),
        new Paragraph({ text: "" }) // Empty paragraph for spacing
      )
    }
    
    // Convert content to DOCX paragraphs
    const convertNode = (node: DocumentNode): any[] => {
      const elements: any[] = []
      
      switch (node.type) {
        case 'paragraph':
          const children: any[] = []
          if (node.content) {
            node.content.forEach(child => {
              if (child.type === 'text') {
                children.push(new TextRun({
                  text: child.text || '',
                  bold: child.marks?.some(m => m.type === 'bold'),
                  italics: child.marks?.some(m => m.type === 'italic'),
                  underline: child.marks?.some(m => m.type === 'underline') ? {} : undefined
                }))
              }
            })
          }
          elements.push(new Paragraph({ children }))
          break
          
        case 'heading':
          const level = node.attrs?.level || 1
          const headingChildren: any[] = []
          if (node.content) {
            node.content.forEach(child => {
              if (child.type === 'text') {
                headingChildren.push(new TextRun({
                  text: child.text || '',
                  bold: true,
                  size: 32 - (level * 2)
                }))
              }
            })
          }
          elements.push(new Paragraph({
            children: headingChildren,
            heading: level === 1 ? HeadingLevel.HEADING_1 : 
                     level === 2 ? HeadingLevel.HEADING_2 :
                     level === 3 ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_4
          }))
          break
          
        default:
          if (node.content) {
            node.content.forEach(child => {
              elements.push(...convertNode(child))
            })
          }
      }
      
      return elements
    }
    
    if (data.content && data.content.content) {
      data.content.content.forEach((node: DocumentNode) => {
        docElements.push(...convertNode(node))
      })
    }
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: docElements
      }]
    })
    
    const buffer = await Packer.toBuffer(doc)
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    
    const fileName = filename || `${data.metadata?.title || 'document'}.docx`
    downloadFile(blob, fileName)
  }

  /**
   * Export document as HTML
   */
  static async exportAsHTML(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    let htmlContent = DocumentParser.toHTML(data.content)
    
    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      const metadataHtml = `
        <div class="document-metadata">
          <h1>${data.metadata.title}</h1>
          <p><strong>Author:</strong> ${data.metadata.author}</p>
          <p><strong>Created:</strong> ${new Date(data.metadata.createdAt).toLocaleDateString()}</p>
          <p><strong>Version:</strong> ${data.metadata.version}</p>
          <p><strong>Word Count:</strong> ${data.metadata.wordCount}</p>
        </div>
        <hr>
      `
      htmlContent = htmlContent.replace('<body>', `<body>${metadataHtml}`)
    }
    
    // Add comments if requested
    if (options.includeComments && data.comments && data.comments.length > 0) {
      const commentsHtml = `
        <div class="document-comments">
          <h2>Comments</h2>
          ${data.comments.map((comment: any) => `
            <div class="comment">
              <strong>${comment.author}</strong> - ${new Date(comment.timestamp).toLocaleString()}
              <p>${comment.content}</p>
            </div>
          `).join('')}
        </div>
      `
      htmlContent = htmlContent.replace('</body>', `${commentsHtml}</body>`)
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const fileName = filename || `${data.metadata?.title || 'document'}.html`
    downloadFile(blob, fileName)
  }

  /**
   * Export document as Markdown
   */
  static async exportAsMarkdown(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    let markdownContent = DocumentParser.toMarkdown(data.content)
    
    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      const metadataMarkdown = `---
title: ${data.metadata.title}
author: ${data.metadata.author}
created: ${new Date(data.metadata.createdAt).toISOString()}
version: ${data.metadata.version}
wordCount: ${data.metadata.wordCount}
---

`
      markdownContent = metadataMarkdown + markdownContent
    }
    
    // Add comments if requested
    if (options.includeComments && data.comments && data.comments.length > 0) {
      const commentsMarkdown = `

## Comments

${data.comments.map((comment: any) => `
**${comment.author}** - ${new Date(comment.timestamp).toLocaleString()}
> ${comment.content}
`).join('')}
`
      markdownContent += commentsMarkdown
    }
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const fileName = filename || `${data.metadata?.title || 'document'}.md`
    downloadFile(blob, fileName)
  }

  /**
   * Export document as plain text
   */
  static async exportAsText(
    data: any,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    let textContent = DocumentParser.toPlainText(data.content)
    
    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      const metadataText = `${data.metadata.title}
Author: ${data.metadata.author}
Created: ${new Date(data.metadata.createdAt).toLocaleDateString()}
Version: ${data.metadata.version}
Word Count: ${data.metadata.wordCount}

---

`
      textContent = metadataText + textContent
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' })
    const fileName = filename || `${data.metadata?.title || 'document'}.txt`
    downloadFile(blob, fileName)
  }
}

export class DocumentImporter {
  /**
   * Import document from JSON
   */
  static async importFromJSON(file: File): Promise<any> {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (data.chainPaper) {
      return data
    } else {
      // Handle generic JSON import
      return {
        chainPaper: true,
        metadata: {
          id: crypto.randomUUID(),
          title: file.name.replace('.json', ''),
          author: 'Imported',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          hash: '',
          authorshipProof: '',
          wordCount: 0,
          characterCount: 0,
          pageCount: 1,
          language: 'en'
        },
        content: data,
        settings: {},
        comments: [],
        authorshipBlocks: []
      }
    }
  }

  /**
   * Import document from DOCX
   */
  static async importFromDOCX(file: File): Promise<any> {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      throw new Error('DOCX import not available in SSR')
    }
    
    // Dynamic import for mammoth library
    const mammoth = await import('mammoth')
    
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    
    // Convert HTML to ProseMirror format (simplified)
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: result.value
            }
          ]
        }
      ]
    }
    
    return {
      chainPaper: true,
      metadata: {
        id: crypto.randomUUID(),
        title: file.name.replace('.docx', ''),
        author: 'Imported',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      content,
      settings: {},
      comments: [],
      authorshipBlocks: []
    }
  }

  /**
   * Import document from HTML
   */
  static async importFromHTML(file: File): Promise<any> {
    const htmlContent = await file.text()
    
    // Basic HTML to ProseMirror conversion (simplified)
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags
            }
          ]
        }
      ]
    }
    
    return {
      chainPaper: true,
      metadata: {
        id: crypto.randomUUID(),
        title: file.name.replace('.html', ''),
        author: 'Imported',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      content,
      settings: {},
      comments: [],
      authorshipBlocks: []
    }
  }

  /**
   * Import document from plain text
   */
  static async importFromText(file: File): Promise<any> {
    const textContent = await file.text()
    const paragraphs = textContent.split('\n\n').filter(p => p.trim())
    
    const content = {
      type: 'doc',
      content: paragraphs.map(paragraph => ({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: paragraph.trim()
          }
        ]
      }))
    }
    
    return {
      chainPaper: true,
      metadata: {
        id: crypto.randomUUID(),
        title: file.name.replace('.txt', ''),
        author: 'Imported',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        hash: '',
        authorshipProof: '',
        wordCount: 0,
        characterCount: 0,
        pageCount: 1,
        language: 'en'
      },
      content,
      settings: {},
      comments: [],
      authorshipBlocks: []
    }
  }
}
