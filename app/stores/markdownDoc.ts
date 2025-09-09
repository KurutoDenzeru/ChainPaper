import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stableStringify, digestSHA256, toHex, signData, verifySignature, importPublicKey, toBase64, fromBase64 } from '@/lib/crypto'

export const useMarkdownDocStore = defineStore('markdownDoc', () => {
  const title = ref('Untitled Markdown')
  const content = ref<string>('')
  const isDirty = ref(false)
  const user = ref({ name: 'Markdown User', email: undefined as string | undefined })
  // attachments stored in-memory and exported with the document
  const attachments = ref<Record<string, string>>({})
  // Auto-save preference persisted across dialog opens (and sessions)
  const autoSaveEnabled = ref(true)
  try {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem('chainpaper_auto_save_enabled')
      if (v !== null) autoSaveEnabled.value = v === '1'
    }
  } catch (e) {
    // ignore (SSR or blocked storage)
  }

  // history (simple linear stack)
  const history = ref<string[]>([''])
  const historyIndex = ref(0)

  function pushHistory(snapshot?: string) {
    const snap = snapshot ?? content.value
    if (history.value[historyIndex.value] === snap) return
    history.value.splice(historyIndex.value + 1) // drop redo tail
    history.value.push(snap)
    historyIndex.value = history.value.length - 1
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      content.value = history.value[historyIndex.value] ?? ''
    }
  }
  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      content.value = history.value[historyIndex.value] ?? ''
    }
  }

  function setTitle(t: string) { title.value = t; isDirty.value = true }
  function setContent(c: string, push = true) { content.value = c; isDirty.value = true; if (push) pushHistory(c) }
  function reset() { title.value = 'Untitled Markdown'; content.value = ''; isDirty.value = false; history.value = ['']; historyIndex.value = 0; attachments.value = {} }
  function markSaved() { isDirty.value = false }

  function setAutoSaveEnabled(v: boolean) {
    autoSaveEnabled.value = v
    try { if (typeof localStorage !== 'undefined') localStorage.setItem('chainpaper_auto_save_enabled', v ? '1' : '0') } catch (_) { }
  }

  // Attachment helpers
  function sanitizeName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
  }
  function addAttachment(dataUri: string, originalName?: string) {
    const base = originalName ? sanitizeName(originalName) : `attachment-${Date.now()}`
    let name = base
    let i = 1
    while (attachments.value[name]) {
      name = `${base}-${i++}`
    }
    attachments.value[name] = dataUri
    isDirty.value = true
    return name
  }
  function getAttachment(name: string) {
    return attachments.value[name] ?? null
  }
  function removeAttachment(name: string) {
    if (attachments.value[name]) { delete attachments.value[name]; isDirty.value = true }
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const exportObject = computed(() => ({ title: title.value, content: content.value, attachments: attachments.value, meta: { exportedAt: new Date().toISOString(), version: 'chainpaper-md-1' } }))

  async function exportJSON() { const obj = exportObject.value; return { obj, str: stableStringify(obj) } }
  async function createHash() { const { str } = await exportJSON(); const hashBytes = await digestSHA256(str); return toHex(hashBytes) }

  async function createProof(privateKey: CryptoKey) {
    const hash = await createHash()
    const signatureBytes = await signData(privateKey, hash)
    const signature = toBase64(signatureBytes)
    return { hash, signature }
  }

  async function verifyProof(publicKeyB64: string, proof: { hash: string, signature: string }) {
    try {
      const computedHash = await createHash()
      const publicKey = await importPublicKey(publicKeyB64)
      const signatureBytes = fromBase64(proof.signature)
      const valid = await verifySignature(publicKey, proof.hash, signatureBytes)

      return {
        valid: valid && computedHash === proof.hash,
        computedHash,
        error: computedHash !== proof.hash ? 'Document hash mismatch' : null
      }
    } catch (error: any) {
      return {
        valid: false,
        computedHash: null,
        error: error.message
      }
    }
  }

  return { title, content, isDirty, user, attachments, canUndo, canRedo, setTitle, setContent, reset, markSaved, undo, redo, exportJSON, createHash, createProof, verifyProof, addAttachment, getAttachment, removeAttachment, autoSaveEnabled, setAutoSaveEnabled }
})

export default useMarkdownDocStore
