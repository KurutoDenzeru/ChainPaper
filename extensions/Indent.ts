import { Extension, type Commands, type KeyboardShortcutCommand } from '@tiptap/core';
import { TextSelection, AllSelection, type Transaction, type EditorState } from 'prosemirror-state';
import type { Node as ProsemirrorNode } from 'prosemirror-model';

declare module '@tiptap/core' {
  interface Commands {
    indent: {
      /**
       * Set the indent attribute
       */
      indent: () => Commands['indent']['indent']
      /**
       * Unset the indent attribute
       */
      outdent: () => Commands['indent']['outdent']
    }
  }
}

interface IndentOptions {
  types: string[];
  indentLevels: number[];
  defaultIndentLevel: number;
}

interface IndentAttributes {
  indent: number;
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  defaultOptions: {
    types: ['heading', 'paragraph'],
    indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
    defaultIndentLevel: 0,
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            renderHTML: (attributes: Record<string, any>) => ({
              style: `margin-left: ${attributes.indent}px!important;`
            }),
            parseHTML: (element: HTMLElement) => ({
              indent: Number.parseInt(element.style.marginLeft) || this.options.defaultIndentLevel,
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }: { tr: Transaction, state: EditorState, dispatch?: (tr: Transaction) => void }) => {
        const { selection } = state;
        let transaction = tr.setSelection(selection);
        transaction = updateIndentLevel(transaction, 30, this.options.types, this.options.indentLevels);

        if (transaction.docChanged) {
          dispatch?.(transaction);
          return true;
        }

        return false;
      },
      outdent: () => ({ tr, state, dispatch }: { tr: Transaction, state: EditorState, dispatch?: (tr: Transaction) => void }) => {
        const { selection } = state;
        let transaction = tr.setSelection(selection);
        transaction = updateIndentLevel(transaction, -30, this.options.types, this.options.indentLevels);

        if (transaction.docChanged) {
          dispatch?.(transaction);
          return true;
        }

        return false;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: (): boolean => {
        this.editor.commands.indent();
        return true;
      },
      'Ctrl-[': (): boolean => {
        this.editor.commands.outdent();
        return true;
      },
    };
  },
});

// Helper functions
function clamp(val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

function setNodeIndentMarkup(tr: Transaction, pos: number, delta: number, indentLevels: number[]): Transaction {
  if (!tr.doc) return tr;

  const node = tr.doc.nodeAt(pos);
  if (!node) return tr;

  const minIndent = Math.min(...indentLevels);
  const maxIndent = Math.max(...indentLevels);

  const indent = clamp(
    (node.attrs.indent || 0) + delta,
    minIndent,
    maxIndent,
  );

  if (indent === node.attrs.indent) return tr;

  const nodeAttrs = {
    ...node.attrs,
    indent,
  };

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}

function updateIndentLevel(tr: Transaction, delta: number, types: string[], indentLevels: number[]): Transaction {
  const { doc, selection } = tr;

  if (!doc || !selection) return tr;

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return tr;
  }

  const { from, to } = selection;
  
  let transaction = tr;
  doc.nodesBetween(from, to, (node: ProsemirrorNode, pos: number) => {
    const nodeType = node.type;

    if (types.includes(nodeType.name)) {
      transaction = setNodeIndentMarkup(transaction, pos, delta, indentLevels);
      return false;
    }
    return true;
  });

  return transaction;
}