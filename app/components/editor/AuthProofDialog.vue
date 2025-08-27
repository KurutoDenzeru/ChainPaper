<template>
    <div class="bg-white rounded-lg shadow-sm p-4 max-w-full">
      <!-- Header: icon + title + vertical status + close -->
      <div class="flex flex-col md:flex-row md:items-start gap-3 mb-3">
        <div class="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-0">
          <FileSignature class="w-6 h-6 text-indigo-600" />
        </div>
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Document Proofs</h3>
            <HoverCard>
              <HoverCardTrigger>
                <Badge :class="badgeClass" :variant="verified === true ? 'default' : verified === false ? 'destructive' : 'outline'">
                  <span class="inline-flex items-center gap-1">
                    <template v-if="verified === true">
                      <CheckCircle class="w-4 h-4 text-green-600" />
                    </template>
                    <template v-else-if="verified === false">
                      <X class="w-4 h-4 text-red-600" />
                    </template>
                    <template v-else>
                      <FileText class="w-4 h-4 text-gray-400" />
                    </template>
                    {{ verifiedText }}
                  </span>
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent>
                <div class="text-sm text-gray-700">
                  <div v-if="currentProof">Signature: <code>{{ currentProof.signature }}</code></div>
                  <div v-if="currentProof">Proof hash: <code>{{ currentProof.hash }}</code></div>
                  <div v-if="computedHash">Computed hash: <code>{{ computedHash }}</code></div>
                  <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p class="text-sm text-gray-500 mt-1">Sign and verify document proofs using local keys — private keys never leave this device.</p>
        </div>
        <div class="flex flex-col items-end gap-2 md:ml-4">
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="closeDialog" aria-label="Close dialog">
            <X class="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

    <!-- Key inputs: responsive and collapsible to reduce bulk -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div class="flex items-center justify-between mb-1">
          <Label class="mb-0">Public Key (SPKI, base64)</Label>
          <div class="flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="pastePublicKey" aria-label="Paste public key">
                  <Clipboard class="w-4 h-4 text-gray-600" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div class="text-sm text-gray-700">Paste public key from clipboard</div>
              </HoverCardContent>
            </HoverCard>
            <Button variant="outline" size="sm" class="h-8" @click="showPublicKey = !showPublicKey">
              <span v-if="showPublicKey">Hide</span>
              <span v-else>View</span>
            </Button>
          </div>
        </div>
        <div v-show="showPublicKey">
          <Textarea v-model="publicKeyB64" placeholder="Paste or generate a public key" rows="4" class="w-full h-24 resize-none border border-gray-300 rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
        </div>
        <div v-show="!showPublicKey" class="text-sm text-gray-500">Public key hidden — click View to show.</div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <Label class="mb-0">Private Key (PKCS8, base64)</Label>
          <div class="flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="exportKeys" :disabled="!privateKey" aria-label="Export keys">
                  <Download class="w-4 h-4 text-gray-600" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div class="text-sm text-gray-700">Download public & private key files</div>
              </HoverCardContent>
            </HoverCard>
            <Button variant="outline" size="sm" class="h-8" @click="showPrivateKey = !showPrivateKey">
              <span v-if="showPrivateKey">Hide</span>
              <span v-else>View</span>
            </Button>
          </div>
        </div>
        <div v-show="showPrivateKey">
          <Textarea v-model="privateKeyB64" placeholder="(keeps local only)" rows="4" class="w-full h-24 resize-none border border-gray-300 rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
        </div>
        <div v-show="!showPrivateKey" class="text-sm text-gray-500">Private key hidden — keep this secret.</div>
      </div>
    </div>

    <!-- Compact toolbar for quick actions -->
    <div class="flex items-center gap-2 mt-3">
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="generateKeys" class="px-3 py-2">
          <Key class="w-4 h-4 mr-2" />
          Generate Keys
        </Button>
        <Button variant="outline" size="sm" @click="pickProofFile" class="px-3 py-2">
          <FileText class="w-4 h-4 mr-2" />
          Import Proof
        </Button>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <Button @click="signExport" :disabled="!privateKey" class="px-3">
          <FileText class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Sign & Export</span>
        </Button>
        <Button variant="secondary" @click="verifyCurrent" :disabled="!publicKeyB64 || !currentProof" class="px-3">
          <CheckCircle class="w-4 h-4 mr-2" />
          <span class="hidden sm:inline">Verify Proof</span>
        </Button>
      </div>
    </div>

    <!-- Exported content + proof summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      <div v-if="exported">
        <div class="text-sm font-medium mb-1">Exported JSON</div>
        <Textarea :model-value="exported" disabled rows="6" class="w-full h-auto resize-none border border-gray-300 rounded bg-gray-50 text-sm p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
      </div>

      <div v-if="currentProof">
        <div class="text-sm font-medium mb-1">Proof</div>
        <Textarea :model-value="proofText" disabled rows="6" class="w-full h-auto resize-none border border-gray-300 rounded bg-gray-50 text-sm p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
      </div>
    </div>

    <div v-if="errorMessage" class="text-sm text-red-600 mt-3">{{ errorMessage }}</div>
    <div class="mt-6">
      <Button variant="outline" size="lg" class="w-full py-4 text-sm flex items-center justify-center gap-2" @click="closeDialog">
        Close
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Key, Download, Clipboard, FileText, CheckCircle, X, FileSignature } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import HoverCard from '@/components/ui/hover-card/HoverCard.vue'
import HoverCardTrigger from '@/components/ui/hover-card/HoverCardTrigger.vue'
import HoverCardContent from '@/components/ui/hover-card/HoverCardContent.vue'
import { generateKeyPair, exportPublicKey, exportPrivateKey } from '@/lib/crypto'
import useDocument from '@/composables/useDocument'

const emit = defineEmits(['close'] as const)

const { createProof, verifyProof } = useDocument()

const privateKey = ref<CryptoKey | null>(null)
const publicKey = ref<CryptoKey | null>(null)
const publicKeyB64 = ref('')
const privateKeyB64 = ref('')
const exported = ref('')
const currentProof = ref<any>(null)
const verified = ref<boolean | null>(null)
const computedHash = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const showPublicKey = ref(false)
const showPrivateKey = ref(false)

const proofText = computed(() => {
  if (!currentProof.value) return ''
  const sig = currentProof.value.signature ? `Signature: ${currentProof.value.signature}` : ''
  const hash = currentProof.value.hash ? `Proof hash: ${currentProof.value.hash}` : ''
  const docHash = computedHash.value ? `Computed document hash: ${computedHash.value}` : ''
  return [sig, hash, docHash].filter(Boolean).join('\n')
})

const verifiedText = computed(() => {
  if (verified.value === true) return 'Valid'
  if (verified.value === false) return 'Invalid'
  return 'Not verified'
})

// Only color the border/background for destructive, not the text
const badgeClass = computed(() => {
  if (verified.value === true) return 'text-green-600'
  if (verified.value === false) return 'text-gray-600 border-red-600 bg-red-50'
  return 'text-gray-600'
})

async function generateKeys() {
  const kp = await generateKeyPair()
  privateKey.value = kp.privateKey
  publicKey.value = kp.publicKey
  publicKeyB64.value = await exportPublicKey(kp.publicKey)
  privateKeyB64.value = await exportPrivateKey(kp.privateKey)
  // show small preview after generation
  showPublicKey.value = true
}

async function exportKeys() {
  if (publicKeyB64.value) {
    const blob = new Blob([publicKeyB64.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chainpaper-public.spki.b64'
    a.click()
    URL.revokeObjectURL(url)
  }
  if (privateKeyB64.value) {
    const blob = new Blob([privateKeyB64.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chainpaper-private.pkcs8.b64'
    a.click()
    URL.revokeObjectURL(url)
  }
}

async function signExport() {
  errorMessage.value = null
  if (!privateKey.value) {
    errorMessage.value = 'No private key available to sign with.'
    return
  }
  try {
    const { proof, exportObj } = await createProof(privateKey.value)
    exported.value = JSON.stringify(exportObj, null, 2)
    currentProof.value = proof
    // try local verification to compute hash; may fail if public key not present
    try {
      const res = await verifyProof(publicKeyB64.value || '', currentProof.value)
      computedHash.value = res?.computedHash ?? null
      verified.value = !!res?.valid
      if (res?.error) errorMessage.value = res.error
    } catch (e: any) {
      errorMessage.value = String(e)
      computedHash.value = null
      verified.value = null
    }
  } catch (e: any) {
    errorMessage.value = String(e)
  }
}

async function verifyCurrent() {
  errorMessage.value = null
  if (!publicKeyB64.value) {
    errorMessage.value = 'Please provide a public key to verify with.'
    return
  }
  if (!currentProof.value) {
    errorMessage.value = 'No proof loaded to verify.'
    return
  }
  try {
    const res = await verifyProof(publicKeyB64.value, currentProof.value)
    computedHash.value = res?.computedHash ?? null
    verified.value = !!res?.valid
    if (res?.error) errorMessage.value = res.error
  } catch (e: any) {
    errorMessage.value = String(e)
    verified.value = null
    computedHash.value = null
  }
}

async function pastePublicKey() {
  try {
    const text = await navigator.clipboard.readText()
    if (text) publicKeyB64.value = text.trim()
  } catch (e) {
    const t = prompt('Paste public key (base64)')
    if (t) publicKeyB64.value = t.trim()
  }
}

function pickProofFile() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.onchange = async (ev: any) => {
    const f = ev.target.files?.[0]
    if (!f) return
    const txt = await f.text()
    try {
      const obj = JSON.parse(txt)
      if (obj.proof) currentProof.value = obj.proof
      else if (obj.signature && obj.hash) currentProof.value = obj
      else alert('Selected file does not contain a proof object')
    } catch (err) {
      alert('Invalid JSON file')
    }
  }
  input.click()
}

function closeDialog() {
  emit('close')
}

</script>

<style scoped>
.break-words code { word-break: break-all; }

/* Responsive tweaks for dialog */
@media (max-width: 640px) {
  .max-w-full { padding: 0.75rem; }
}

</style>
