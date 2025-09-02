declare module 'markdown-it-katex' {
  import MarkdownIt from 'markdown-it'

  interface KaTeXOptions {
    throwOnError?: boolean
    errorColor?: string
    macros?: Record<string, string>
  }

  function katex(md: MarkdownIt, options?: KaTeXOptions): void

  export = katex
}
