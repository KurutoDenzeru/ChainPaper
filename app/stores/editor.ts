import { defineStore } from 'pinia'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
import type { FormatOption, ToolbarGroup, TableOptions, ImageOptions, LinkOptions } from '~/types/editor'
import type { DocumentContent, DocumentNode } from '~/types/document'

// Extend basic schema with lists and other nodes
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

export const useEditorStore = defineStore('editor', {
  state: () => ({
    // Editor instances
    editorView: null as EditorView | null,
    editorState: null as EditorState | null,
    
    // Editor settings
    isReadOnly: false,
    isFocused: false,
    
    // Selection and cursor
    selection: {
      from: 0,
      to: 0,
      empty: true
    },
    
    // Current formatting
    activeFormats: new Set<string>(),
    
    // Find and replace
    findQuery: '',
    replaceQuery: '',
    findResults: [] as { from: number; to: number }[],
    currentFindIndex: 0,
    currentFindResult: null as { from: number; to: number } | null,
    
    // Spell check
    spellCheckEnabled: true,
    spellCheckErrors: [] as { from: number; to: number; suggestions: string[] }[],
    
    // Comments mode
    commentMode: false,
    selectedCommentRange: null as { from: number; to: number } | null
  }),

  getters: {
    canUndo: (state) => {
      if (!state.editorState) return false
      return state.editorState.doc.content.size > 0
    },

    canRedo: (state) => {
      if (!state.editorState) return false
      return true // Would need to track redo history
    },

    currentNode: (state) => {
      if (!state.editorState) return null
      const { $from } = state.editorState.selection
      return $from.node()
    },

    currentNodeType: (state) => {
      if (!state.editorState) return null
      const { $from } = state.editorState.selection
      return $from.parent.type.name
    },



    toolbarGroups(state: any): ToolbarGroup[] {
      return [
        {
          name: 'text',
          items: [
            {
              type: 'bold',
              label: 'Bold',
              icon: 'bold',
              shortcut: 'Ctrl+B',
              isActive: state.activeFormats.has('bold'),
              command: () => {}
            },
            {
              type: 'italic',
              label: 'Italic',
              icon: 'italic',
              shortcut: 'Ctrl+I',
              isActive: state.activeFormats.has('italic'),
              command: () => {}
            },
            {
              type: 'underline',
              label: 'Underline',
              icon: 'underline',
              shortcut: 'Ctrl+U',
              isActive: state.activeFormats.has('underline'),
              command: () => {}
            },
            {
              type: 'strikethrough',
              label: 'Strikethrough',
              icon: 'strikethrough',
              isActive: state.activeFormats.has('strikethrough'),
              command: () => {}
            }
          ]
        },
        {
          name: 'structure',
          items: [
            {
              type: 'heading1',
              label: 'Heading 1',
              icon: 'heading-1',
              isActive: false,
              command: () => {}
            },
            {
              type: 'heading2',
              label: 'Heading 2',
              icon: 'heading-2',
              isActive: false,
              command: () => {}
            },
            {
              type: 'heading3',
              label: 'Heading 3',
              icon: 'heading-3',
              isActive: false,
              command: () => {}
            },
            {
              type: 'paragraph',
              label: 'Paragraph',
              icon: 'pilcrow',
              isActive: false,
              command: () => {}
            }
          ]
        },
        {
          name: 'lists',
          items: [
            {
              type: 'bullet_list',
              label: 'Bullet List',
              icon: 'list',
              isActive: false,
              command: () => {}
            },
            {
              type: 'ordered_list',
              label: 'Numbered List',
              icon: 'list-ordered',
              isActive: false,
              command: () => {}
            }
          ]
        },
        {
          name: 'insert',
          items: [
            {
              type: 'link',
              label: 'Link',
              icon: 'link',
              isActive: false,
              command: () => {}
            },
            {
              type: 'image',
              label: 'Image',
              icon: 'image',
              isActive: false,
              command: () => {}
            },
            {
              type: 'table',
              label: 'Table',
              icon: 'table',
              isActive: false,
              command: () => {}
            },
            {
              type: 'horizontal_rule',
              label: 'Horizontal Rule',
              icon: 'minus',
              isActive: false,
              command: () => {}
            }
          ]
        }
      ]
    }
  },

  actions: {
    // Editor initialization
    initializeEditor(element: HTMLElement, initialContent?: any) {
      const state = EditorState.create({
        schema: mySchema,
        doc: initialContent ? DOMParser.fromSchema(mySchema).parse(initialContent) : undefined,
        plugins: exampleSetup({ schema: mySchema })
      })

      this.editorView = new EditorView(element, {
        state,
        dispatchTransaction: (transaction: Transaction) => {
          this.handleTransaction(transaction)
        },
        handleDOMEvents: {
          focus: () => {
            this.isFocused = true
            return false
          },
          blur: () => {
            this.isFocused = false
            return false
          }
        }
      })

      this.editorState = state
      this.updateActiveFormats()
    },

    // Transaction handling
    async handleTransaction(transaction: Transaction) {
      if (!this.editorView) return

      const newState = this.editorView.state.apply(transaction)
      this.editorView.updateState(newState)
      this.editorState = newState

      // Update selection and active formats
      this.updateSelection()
      this.updateActiveFormats()

      // Notify document store of changes if content changed
      if (transaction.docChanged) {
        const { useDocumentStore } = await import('~/stores/document')
        const documentStore = useDocumentStore()
        const content = this.getDocumentContent()
        if (content) {
          documentStore.updateContent(content as DocumentContent)
        }
      }
    },

    // Format management
    toggleFormat(format: string) {
      if (!this.editorView || !this.editorState) return

      const { schema } = this.editorState
      const markType = schema.marks[format]
      
      if (!markType) return

      const { from, to } = this.editorState.selection
      const hasMark = this.editorState.doc.rangeHasMark(from, to, markType)

      const tr = this.editorState.tr
      if (hasMark) {
        tr.removeMark(from, to, markType)
      } else {
        tr.addMark(from, to, markType.create())
      }

      this.editorView.dispatch(tr)
    },

    // Individual format toggles
    toggleBold() {
      this.toggleFormat('bold')
    },

    toggleItalic() {
      this.toggleFormat('italic')
    },

    toggleUnderline() {
      this.toggleFormat('underline')
    },

    toggleStrikethrough() {
      this.toggleFormat('strikethrough')
    },

    // Undo/Redo
    undo() {
      if (!this.editorView) return
      // Import undo command from prosemirror-history
      console.log('Undo not implemented yet - would need prosemirror-history')
    },

    redo() {
      if (!this.editorView) return
      // Import redo command from prosemirror-history
      console.log('Redo not implemented yet - would need prosemirror-history')
    },

    // Font and styling
    setFontFamily(font: string) {
      // This would require custom mark for font family
      console.log('Font family change:', font)
    },

    setFontSize(size: number) {
      // This would require custom mark for font size
      console.log('Font size change:', size)
    },

    setTextColor(color: string) {
      // This would require custom mark for text color
      console.log('Text color change:', color)
    },

    setHighlightColor(color: string) {
      // This would require custom mark for highlight
      console.log('Highlight color change:', color)
    },

    // Alignment
    setAlignment(align: string) {
      // This would require custom attribute for alignment
      console.log('Alignment change:', align)
    },

    // Lists
    toggleBulletList() {
      this.toggleList('bullet_list')
    },

    toggleOrderedList() {
      this.toggleList('ordered_list')
    },

    // Indentation
    indent() {
      // This would require list commands from prosemirror-schema-list
      console.log('Indent not implemented yet')
    },

    outdent() {
      // This would require list commands from prosemirror-schema-list
      console.log('Outdent not implemented yet')
    },

    // Page operations
    insertPageBreak() {
      if (!this.editorView || !this.editorState) return

      const { from } = this.editorState.selection
      const tr = this.editorState.tr

      // Insert a hard break for now - would need custom page break node
      if (this.editorState.schema.nodes.hard_break) {
        tr.insert(from, this.editorState.schema.nodes.hard_break.create())
        this.editorView.dispatch(tr)
      }
    },

    // Find operations
    findNext(query: string) {
      this.findText(query)
      if (this.findResults.length > 0) {
        this.currentFindIndex = (this.currentFindIndex + 1) % this.findResults.length
      }
    },

    findPrevious(query: string) {
      this.findText(query)
      if (this.findResults.length > 0) {
        this.currentFindIndex = this.currentFindIndex > 0 ? this.currentFindIndex - 1 : this.findResults.length - 1
      }
    },

    replaceNext(findText: string, replaceWith: string) {
      this.findText(findText)
      if (this.currentFindResult && this.editorView && this.editorState) {
        let tr = this.editorState.tr
        tr = tr.replaceWith(
          this.currentFindResult.from, 
          this.currentFindResult.to, 
          this.editorState.schema.text(replaceWith)
        )
        this.editorView.dispatch(tr)
      }
    },

    setHeading(level: number) {
      if (!this.editorView || !this.editorState) return

      const { schema } = this.editorState
      const headingType = schema.nodes.heading
      
      if (!headingType) return

      const { from, to } = this.editorState.selection
      const tr = this.editorState.tr

      tr.setBlockType(from, to, headingType, { level })
      this.editorView.dispatch(tr)
    },

    setParagraph() {
      if (!this.editorView || !this.editorState) return

      const { schema } = this.editorState
      const paragraphType = schema.nodes.paragraph
      
      if (!paragraphType) return

      const { from, to } = this.editorState.selection
      const tr = this.editorState.tr

      tr.setBlockType(from, to, paragraphType)
      this.editorView.dispatch(tr)
    },

    toggleList(listType: string) {
      if (!this.editorView || !this.editorState) return

      const { schema } = this.editorState
      const nodeType = schema.nodes[listType]
      
      if (!nodeType) return

      const { from, to } = this.editorState.selection
      let tr = this.editorState.tr

      // This is a simplified implementation
      // In a real editor, you'd use prosemirror-schema-list commands
      tr = tr.setBlockType(from, to, nodeType)
      this.editorView.dispatch(tr)
    },

    // Content insertion
    insertLink(options?: LinkOptions) {
      if (!this.editorView || !this.editorState) return

      if (!options) {
        // Open link dialog
        this.openLinkDialog()
        return
      }

      const { schema } = this.editorState
      const linkType = schema.marks.link
      
      if (!linkType) return

      const { from, to } = this.editorState.selection
      let tr = this.editorState.tr

      tr = tr.addMark(from, to, linkType.create({ href: options.href, title: options.title }))
      this.editorView.dispatch(tr)
    },

    insertImage(options?: ImageOptions) {
      if (!this.editorView || !this.editorState) return

      if (!options) {
        // Open image dialog
        this.openImageDialog()
        return
      }

      const { schema } = this.editorState
      const imageType = schema.nodes.image
      
      if (!imageType) return

      const { from } = this.editorState.selection
      let tr = this.editorState.tr

      const imageNode = imageType.create({
        src: options.src,
        alt: options.alt,
        width: options.width,
        height: options.height
      })

      tr = tr.insert(from, imageNode)
      this.editorView.dispatch(tr)
    },

    insertTable(options?: TableOptions) {
      if (!this.editorView || !this.editorState) return

      if (!options) {
        // Open table dialog
        this.openTableDialog()
        return
      }

      // Table insertion would require prosemirror-tables
      // This is a placeholder implementation
      console.log('Table insertion not implemented yet')
    },

    insertHorizontalRule() {
      if (!this.editorView || !this.editorState) return

      const { schema } = this.editorState
      const hrType = schema.nodes.horizontal_rule
      
      if (!hrType) return

      const { from } = this.editorState.selection
      let tr = this.editorState.tr

      tr = tr.insert(from, hrType.create())
      this.editorView.dispatch(tr)
    },

    // Dialog management
    openLinkDialog() {
      // This would trigger a dialog component
      console.log('Link dialog would open here')
    },

    openImageDialog() {
      // This would trigger an image upload dialog
      console.log('Image dialog would open here')
    },

    openTableDialog() {
      // This would trigger a table creation dialog
      console.log('Table dialog would open here')
    },

    // Format checking method
    isFormatActive(format: string): boolean {
      if (!this.editorState) return false
      return this.activeFormats.has(format)
    },

    // Update active formats method
    updateActiveFormats() {
      if (!this.editorState) return

      const { from, to } = this.editorState.selection
      const activeFormats = new Set<string>()

      // Check for each mark type in the current selection
      Object.keys(this.editorState.schema.marks).forEach(markName => {
        const markType = this.editorState!.schema.marks[markName]
        if (markType && this.editorState!.doc.rangeHasMark(from, to, markType)) {
          activeFormats.add(markName)
        }
      })

      this.activeFormats = activeFormats
    },

    // Update selection method
    updateSelection() {
      if (!this.editorState) return

      const { from, to } = this.editorState.selection
      this.selection = {
        from,
        to,
        empty: from === to
      }
    },

    // Get document content method
    getDocumentContent(): DocumentContent | null {
      if (!this.editorState) return null

      // Convert ProseMirror document to our DocumentContent format
      const convertNode = (node: any): DocumentNode => {
        const result: DocumentNode = {
          type: node.type.name
        }

        if (node.attrs && Object.keys(node.attrs).length > 0) {
          result.attrs = node.attrs
        }

        if (node.text) {
          result.text = node.text
        }

        if (node.marks && node.marks.length > 0) {
          result.marks = node.marks.map((mark: any) => ({
            type: mark.type.name,
            attrs: mark.attrs && Object.keys(mark.attrs).length > 0 ? mark.attrs : undefined
          }))
        }

        if (node.content && node.content.size > 0) {
          result.content = []
          node.content.forEach((child: any) => {
            result.content!.push(convertNode(child))
          })
        }

        return result
      }

      return {
        type: 'doc',
        content: this.editorState.doc.content.size > 0 
          ? (() => {
              const nodes: DocumentNode[] = []
              this.editorState!.doc.content.forEach((node: any) => {
                nodes.push(convertNode(node))
              })
              return nodes
            })()
          : []
      }
    },

    // Find text method
    findText(query: string) {
      if (!this.editorState || !query) {
        this.findResults = []
        this.currentFindIndex = 0
        this.currentFindResult = null
        return
      }

      const results: { from: number; to: number }[] = []
      const doc = this.editorState.doc
      const text = doc.textContent.toLowerCase()
      const searchText = query.toLowerCase()

      let index = 0
      while (index < text.length) {
        const foundIndex = text.indexOf(searchText, index)
        if (foundIndex === -1) break

        results.push({
          from: foundIndex,
          to: foundIndex + searchText.length
        })
        index = foundIndex + 1
      }

      this.findResults = results
      this.currentFindIndex = 0
      this.currentFindResult = results.length > 0 ? results[0] || null : null
    },

    replaceText(replaceWith: string) {
      if (!this.editorView || !this.editorState || this.findResults.length === 0) return

      const currentResult = this.findResults[this.currentFindIndex]
      if (!currentResult) return

      let tr = this.editorState.tr
      tr = tr.replaceWith(currentResult.from, currentResult.to, this.editorState.schema.text(replaceWith))
      
      this.editorView.dispatch(tr)
      this.findText(this.findQuery) // Refresh results
    },

    replaceAll(replaceWith: string) {
      if (!this.editorView || !this.editorState || this.findResults.length === 0) return

      let tr = this.editorState.tr
      
      // Replace from end to start to maintain positions
      for (let i = this.findResults.length - 1; i >= 0; i--) {
        const result = this.findResults[i]
        if (result) {
          tr = tr.replaceWith(result.from, result.to, this.editorState.schema.text(replaceWith))
        }
      }
      
      this.editorView.dispatch(tr)
      this.findResults = []
    },

    // Document content
    setDocumentContent(content: any) {
      if (!this.editorView || !content) return

      const doc = this.editorState?.schema.nodeFromJSON(content)
      if (!doc) return

      const newState = EditorState.create({
        schema: this.editorState!.schema,
        doc,
        plugins: this.editorState!.plugins
      })

      this.editorView.updateState(newState)
      this.editorState = newState
    },

    // Comment mode
    enableCommentMode() {
      this.commentMode = true
    },

    disableCommentMode() {
      this.commentMode = false
      this.selectedCommentRange = null
    },

    setCommentRange(from: number, to: number) {
      this.selectedCommentRange = { from, to }
    },

    // Cleanup
    destroyEditor() {
      if (this.editorView) {
        this.editorView.destroy()
        this.editorView = null
      }
      this.editorState = null
    }
  }
})
