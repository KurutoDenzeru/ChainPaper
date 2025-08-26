// Lightweight WebCrypto helpers for hashing, signing and key management
function ensureArrayBuffer(input: Uint8Array | ArrayBuffer | string): ArrayBuffer {
  if (typeof input === 'string') return new TextEncoder().encode(input).buffer
  if (input instanceof ArrayBuffer) return input
  // input is Uint8Array: make a copy as ArrayBuffer slice to satisfy strict typing
  return (input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer)
}

export async function digestSHA256(input: Uint8Array | string) {
  const buffer = ensureArrayBuffer(input)
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  return new Uint8Array(hash)
}

export function toHex(bytes: Uint8Array) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function toBase64(bytes: Uint8Array) {
  // browser btoa expects binary string
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    const v = bytes[i]
    binary += String.fromCharCode(typeof v === 'number' ? v : 0)
  }
  return btoa(binary)
}

export function fromBase64(b64: string) {
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Deterministic JSON canonicalization: sort object keys recursively
export function canonicalize(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(canonicalize)
  const keys = Object.keys(obj).sort()
  const out: any = {}
  for (const k of keys) out[k] = canonicalize(obj[k])
  return out
}

export function stableStringify(obj: any) {
  return JSON.stringify(canonicalize(obj))
}

// Key generation and sign/verify using ECDSA P-256 (widely supported)
export async function generateKeyPair() {
  const key = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  )
  return key
}

export async function exportPublicKey(key: CryptoKey) {
  const spki = await crypto.subtle.exportKey('spki', key)
  return toBase64(new Uint8Array(spki))
}

export async function exportPrivateKey(key: CryptoKey) {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', key)
  return toBase64(new Uint8Array(pkcs8))
}

export async function importPublicKey(spkiB64: string) {
  const bytes = fromBase64(spkiB64)
  return crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify']
  )
}

export async function importPrivateKey(pkcs8B64: string) {
  const bytes = fromBase64(pkcs8B64)
  return crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign']
  )
}

export async function signData(privateKey: CryptoKey, data: Uint8Array | string) {
  const buffer = ensureArrayBuffer(data)
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, buffer)
  return new Uint8Array(sig)
}

export async function verifySignature(publicKey: CryptoKey, data: Uint8Array | string, signature: Uint8Array) {
  const buffer = ensureArrayBuffer(data)
  // signature.buffer may be a SharedArrayBuffer in some environments; create a copy slice to get ArrayBuffer
  const sigBuf = signature.buffer.slice(signature.byteOffset, signature.byteOffset + signature.byteLength) as ArrayBuffer
  return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, sigBuf, buffer as ArrayBuffer)
}
