import { defineStore } from 'pinia'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
import type { FormatOption, ToolbarGroup, TableOptions, ImageOptions, LinkOptions } from '~/types/editor'

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

    isFormatActive: (state) => (format: string) => {
      return state.activeFormats.has(format)
    },

    toolbarGroups(): ToolbarGroup[] {
      return [
        {
          name: 'text',
          items: [
            {
              type: 'bold',
              label: 'Bold',
              icon: 'bold',
              shortcut: 'Ctrl+B',
              isActive: this.isFormatActive('bold'),
              command: () => this.toggleFormat('bold')
            },
            {
              type: 'italic',
              label: 'Italic',
              icon: 'italic',
              shortcut: 'Ctrl+I',
              isActive: this.isFormatActive('italic'),
              command: () => this.toggleFormat('italic')
            },
            {
              type: 'underline',
              label: 'Underline',
              icon: 'underline',
              shortcut: 'Ctrl+U',
              isActive: this.isFormatActive('underline'),
              command: () => this.toggleFormat('underline')
            },
            {
              type: 'strikethrough',
              label: 'Strikethrough',
              icon: 'strikethrough',
              isActive: this.isFormatActive('strikethrough'),
              command: () => this.toggleFormat('strikethrough')
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
              isActive: this.currentNodeType === 'heading' && this.currentNode?.attrs.level === 1,
              command: () => this.setHeading(1)
            },
            {
              type: 'heading2',
              label: 'Heading 2',
              icon: 'heading-2',
              isActive: this.currentNodeType === 'heading' && this.currentNode?.attrs.level === 2,
              command: () => this.setHeading(2)
            },
            {
              type: 'heading3',
              label: 'Heading 3',
              icon: 'heading-3',
              isActive: this.currentNodeType === 'heading' && this.currentNode?.attrs.level === 3,
              command: () => this.setHeading(3)
            },
            {
              type: 'paragraph',
              label: 'Paragraph',
              icon: 'pilcrow',
              isActive: this.currentNodeType === 'paragraph',
              command: () => this.setParagraph()
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
              isActive: this.currentNodeType === 'bullet_list',
              command: () => this.toggleList('bullet_list')
            },
            {
              type: 'ordered_list',
              label: 'Numbered List',
              icon: 'list-ordered',
              isActive: this.currentNodeType === 'ordered_list',
              command: () => this.toggleList('ordered_list')
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
              isActive: this.isFormatActive('link'),
              command: () => this.insertLink()
            },
            {
              type: 'image',
              label: 'Image',
              icon: 'image',
              isActive: false,
              command: () => this.insertImage()
            },
            {
              type: 'table',
              label: 'Table',
              icon: 'table',
              isActive: false,
              command: () => this.insertTable()
            },
            {
              type: 'horizontal_rule',
              label: 'Horizontal Rule',
              icon: 'minus',
              isActive: false,
              command: () => this.insertHorizontalRule()
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
    handleTransaction(transaction: Transaction) {
      if (!this.editorView) return

      const newState = this.editorView.state.apply(transaction)
      this.editorView.updateState(newState)
      this.editorState = newState

      // Update selection and active formats
      this.updateSelection()
      this.updateActiveFormats()

      // Notify document store of changes if content changed
      if (transaction.docChanged) {
        const documentStore = useDocumentStore()
        const content = this.getDocumentContent()
        documentStore.updateContent(content)
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
      const tr = this.editorState.tr

      // This is a simplified implementation
      // In a real editor, you'd use prosemirror-schema-list commands
      tr.setBlockType(from, to, nodeType)
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
      const tr = this.editorState.tr

      tr.addMark(from, to, linkType.create({ href: options.href, title: options.title }))
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
      const tr = this.editorState.tr

      const imageNode = imageType.create({
        src: options.src,
        alt: options.alt,
        width: options.width,
        height: options.height
      })

      tr.insert(from, imageNode)
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
      const tr = this.editorState.tr

      tr.insert(from, hrType.create())
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

    // Selection and state updates
    updateSelection() {
      if (!this.editorState) return

      const { from, to, empty } = this.editorState.selection
      this.selection = { from, to, empty }
    },

    updateActiveFormats() {
      if (!this.editorState) return

      const activeFormats = new Set<string>()
      const { $from } = this.editorState.selection

      // Check active marks
      for (const mark of $from.marks()) {
        activeFormats.add(mark.type.name)
      }

      this.activeFormats = activeFormats
    },

    // Find and replace
    findText(query: string) {
      if (!this.editorState || !query) return

      this.findQuery = query
      this.findResults = []
      this.currentFindIndex = 0

      // Simple text search implementation
      const text = this.editorState.doc.textContent
      let index = 0
      
      while (index < text.length) {
        const found = text.indexOf(query, index)
        if (found === -1) break
        
        this.findResults.push({
          from: found,
          to: found + query.length
        })
        
        index = found + 1
      }
    },

    replaceText(replaceWith: string) {
      if (!this.editorView || !this.editorState || this.findResults.length === 0) return

      const currentResult = this.findResults[this.currentFindIndex]
      if (!currentResult) return

      const tr = this.editorState.tr
      tr.replaceWith(currentResult.from, currentResult.to, this.editorState.schema.text(replaceWith))
      
      this.editorView.dispatch(tr)
      this.findText(this.findQuery) // Refresh results
    },

    replaceAll(replaceWith: string) {
      if (!this.editorView || !this.editorState || this.findResults.length === 0) return

      let tr = this.editorState.tr
      
      // Replace from end to start to maintain positions
      for (let i = this.findResults.length - 1; i >= 0; i--) {
        const result = this.findResults[i]
        tr = tr.replaceWith(result.from, result.to, this.editorState.schema.text(replaceWith))
      }
      
      this.editorView.dispatch(tr)
      this.findResults = []
    },

    // Document content
    getDocumentContent() {
      if (!this.editorState) return null

      return {
        type: 'doc',
        content: this.editorState.doc.toJSON().content || []
      }
    },

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
