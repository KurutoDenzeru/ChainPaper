import { ref } from 'vue'
import { stableStringify, digestSHA256, toHex, importPublicKey, signData, verifySignature } from '@/lib/crypto'

// singleton state so composable consumers share the same document
const title = ref('Untitled Document')
const pages = ref<string[]>([''])
const isDirty = ref(false)

function setTitle(t: string) {
  title.value = t
  isDirty.value = true
}

function setPages(p: string[]) {
  pages.value = p
  isDirty.value = true
}

function toExportObject() {
  return {
    title: title.value,
    pages: pages.value,
    meta: {
      exportedAt: new Date().toISOString(),
      version: 'chainpaper-1'
    }
  }
}

export async function exportJSON() {
  const obj = toExportObject()
  const str = stableStringify(obj)
  return { obj, str }
}

export async function createProof(privateKey: CryptoKey) {
  const { obj, str } = await exportJSON()
  // strict: hash canonical JSON string, then sign the hash bytes
  const hashBytes = await digestSHA256(str)
  const sig = await signData(privateKey, hashBytes)
  return {
    proof: {
      signature: toHex(sig),
      hash: toHex(hashBytes),
      algorithm: 'ECDSA-P256-SHA256',
      exportedAt: obj.meta.exportedAt
    },
    exportObj: obj
  }
}

export async function verifyProof(publicKeyB64: string, proof: any) {
  const { obj, str } = await exportJSON()
  const imported = await importPublicKey(publicKeyB64)
  const hashBytes = await digestSHA256(str)
  const sigBytes = new Uint8Array(proof.signature.match(/.{1,2}/g).map((h: string) => parseInt(h, 16)))
  const valid = await verifySignature(imported, hashBytes, sigBytes)
  return { valid, computedHash: toHex(hashBytes), proofHash: proof.hash }
}

export function useDocument() {
  return { title, pages, isDirty, setTitle, setPages, exportJSON, createProof, verifyProof }
}

export default useDocument
