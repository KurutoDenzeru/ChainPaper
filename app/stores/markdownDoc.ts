import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stableStringify, digestSHA256, toHex, signData, verifySignature, importPublicKey, toBase64, fromBase64 } from '@/lib/crypto'

export const useMarkdownDocStore = defineStore('markdownDoc', () => {
  const title = ref('Untitled Markdown')
  const content = ref<string>('')
  const isDirty = ref(false)
  const user = ref({ name: 'Markdown User', email: undefined as string | undefined })

  // history (simple linear stack)
  const history = ref<string[]>([''])
  const historyIndex = ref(0)

  function pushHistory(snapshot?: string){
    const snap = snapshot ?? content.value
    if (history.value[historyIndex.value] === snap) return
    history.value.splice(historyIndex.value + 1) // drop redo tail
    history.value.push(snap)
    historyIndex.value = history.value.length - 1
  }

  function undo(){
    if (historyIndex.value > 0){
      historyIndex.value--
      content.value = history.value[historyIndex.value] ?? ''
    }
  }
  function redo(){
    if (historyIndex.value < history.value.length - 1){
      historyIndex.value++
      content.value = history.value[historyIndex.value] ?? ''
    }
  }

  function setTitle(t: string){ title.value = t; isDirty.value = true }
  function setContent(c: string, push = true){ content.value = c; isDirty.value = true; if (push) pushHistory(c) }
  function reset(){ title.value = 'Untitled Markdown'; content.value=''; isDirty.value=false; history.value=['']; historyIndex.value=0 }
  function markSaved(){ isDirty.value = false }

  const canUndo = computed(()=> historyIndex.value > 0)
  const canRedo = computed(()=> historyIndex.value < history.value.length - 1)

  const exportObject = computed(()=>({ title: title.value, content: content.value, meta: { exportedAt: new Date().toISOString(), version: 'chainpaper-md-1' } }))

  async function exportJSON(){ const obj = exportObject.value; return { obj, str: stableStringify(obj) } }
  async function createHash(){ const { str } = await exportJSON(); const hashBytes = await digestSHA256(str); return toHex(hashBytes) }

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

  return { title, content, isDirty, user, canUndo, canRedo, setTitle, setContent, reset, markSaved, undo, redo, exportJSON, createHash, createProof, verifyProof }
})

export default useMarkdownDocStore
