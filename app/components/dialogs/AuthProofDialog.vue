<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-5xl! max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <FileSignature class="w-5 h-5 text-indigo-600" />
          Markdown Document Proofs
        </DialogTitle>
        <DialogDescription>
          Sign and verify your markdown document using cryptographic proofs. Private keys never leave this device.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Status Badge -->
        <div class="flex items-center justify-between">
          <HoverCard>
            <HoverCardTrigger>
              <Badge :class="badgeClass"
                :variant="verified === true ? 'outline' : verified === false ? 'destructive' : 'outline'">
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
                <div v-if="currentProof">Signature: <code class="break-all">{{ currentProof.signature }}</code></div>
                <div v-if="currentProof">Proof hash: <code class="break-all">{{ currentProof.hash }}</code></div>
                <div v-if="computedHash">Computed hash: <code class="break-all">{{ computedHash }}</code></div>
                <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <!-- Key Management -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <Label>Public Key (SPKI, base64)</Label>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" @click="pastePublicKey" title="Paste from clipboard">
                  <Clipboard class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" @click="showPublicKey = !showPublicKey">
                  {{ showPublicKey ? 'Hide' : 'Show' }}
                </Button>
              </div>
            </div>
            <div v-if="showPublicKey">
              <Textarea v-model="publicKeyB64" placeholder="Paste or generate a public key"
                class="font-mono text-xs h-32 overflow-y-auto resize-none" />
            </div>
            <div v-else class="text-sm text-gray-500 p-3 bg-gray-50 rounded">
              Public key hidden — click Show to view.
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <Label>Private Key (PKCS8, base64)</Label>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" @click="exportKeys" :disabled="!privateKey"
                  title="Download key files">
                  <Download class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" @click="showPrivateKey = !showPrivateKey">
                  {{ showPrivateKey ? 'Hide' : 'Show' }}
                </Button>
              </div>
            </div>
            <div v-if="showPrivateKey">
              <Textarea v-model="privateKeyB64" placeholder="(keeps local only)"
                class="font-mono text-xs h-32 overflow-y-auto resize-none" />
            </div>
            <div v-else class="text-sm text-gray-500 p-3 bg-gray-50 rounded">
              Private key hidden — keep this secret.
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="outline" @click="generateKeys">
            <Key class="w-4 h-4 mr-2" />
            Generate Keys
          </Button>
          <Button variant="outline" @click="importProofFile">
            <FileText class="w-4 h-4 mr-2" />
            Import Proof
          </Button>
          <div class="ml-auto flex items-center gap-2">
            <Button @click="signAndExport" :disabled="!privateKey">
              <FileSignature class="w-4 h-4 mr-2" />
              Sign & Export
            </Button>
            <Button variant="outline" @click="verifyProof" :disabled="!publicKeyB64 || !currentProof">
              <CheckCircle class="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>

        <!-- Results -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="exported || currentProof">
          <div v-if="exported">
            <Label class="mb-2 block">Exported Markdown JSON</Label>
            <Textarea :model-value="exported" readonly
              class="font-mono text-xs bg-gray-50 h-32 overflow-y-auto resize-none" />
          </div>

          <div v-if="currentProof">
            <Label class="mb-2 block">Proof Details</Label>
            <Textarea :model-value="proofText" readonly
              class="font-mono text-xs bg-gray-50 h-32 overflow-y-auto resize-none" />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {{ errorMessage }}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    Key,
    Download,
    Clipboard,
    FileText,
    CheckCircle,
    X,
    FileSignature
  } from 'lucide-vue-next'
  import { generateKeyPair, exportPublicKey, exportPrivateKey } from '@/lib/crypto'
  import { useMarkdownDocStore } from '@/stores/markdownDoc'

  interface Props {
    open: boolean
  }

  defineProps<Props>()
  defineEmits<{
    'update:open': [value: boolean]
  }>()

  const store = useMarkdownDocStore()

  // State
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

  // Computed
  const proofText = computed(() => {
    if (!currentProof.value) return ''
    const parts = []
    if (currentProof.value.signature) parts.push(`Signature: ${currentProof.value.signature}`)
    if (currentProof.value.hash) parts.push(`Proof hash: ${currentProof.value.hash}`)
    if (computedHash.value) parts.push(`Computed hash: ${computedHash.value}`)
    return parts.join('\n')
  })

  const verifiedText = computed(() => {
    if (verified.value === true) return 'Valid'
    if (verified.value === false) return 'Invalid'
    return 'Not verified'
  })

  const badgeClass = computed(() => {
    if (verified.value === true) return 'text-green-700 border-green-300 bg-green-50'
    if (verified.value === false) return 'text-gray-600 border-red-600 bg-red-50'
    return 'text-gray-600'
  })

  // Methods
  async function generateKeys() {
    try {
      const keyPair = await generateKeyPair()
      privateKey.value = keyPair.privateKey
      publicKey.value = keyPair.publicKey
      publicKeyB64.value = await exportPublicKey(keyPair.publicKey)
      privateKeyB64.value = await exportPrivateKey(keyPair.privateKey)
      showPublicKey.value = true
      errorMessage.value = null
    } catch (error: any) {
      errorMessage.value = `Failed to generate keys: ${error.message}`
    }
  }

  async function exportKeys() {
    if (!publicKeyB64.value || !privateKeyB64.value) return

    // Export public key
    const publicBlob = new Blob([publicKeyB64.value], { type: 'text/plain' })
    const publicUrl = URL.createObjectURL(publicBlob)
    const publicLink = document.createElement('a')
    publicLink.href = publicUrl
    publicLink.download = 'markdown-public.spki.b64'
    publicLink.click()
    URL.revokeObjectURL(publicUrl)

    // Export private key
    const privateBlob = new Blob([privateKeyB64.value], { type: 'text/plain' })
    const privateUrl = URL.createObjectURL(privateBlob)
    const privateLink = document.createElement('a')
    privateLink.href = privateUrl
    privateLink.download = 'markdown-private.pkcs8.b64'
    privateLink.click()
    URL.revokeObjectURL(privateUrl)
  }

  async function pastePublicKey() {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        publicKeyB64.value = text.trim()
        errorMessage.value = null
      }
    } catch {
      const text = prompt('Paste public key (base64):')
      if (text) {
        publicKeyB64.value = text.trim()
        errorMessage.value = null
      }
    }
  }

  function importProofFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.proof) {
          currentProof.value = data.proof
        } else if (data.signature && data.hash) {
          currentProof.value = data
        } else {
          throw new Error('File does not contain a valid proof object')
        }

        errorMessage.value = null
      } catch (error: any) {
        errorMessage.value = `Failed to import proof: ${error.message}`
      }
    }
    input.click()
  }

  async function signAndExport() {
    if (!privateKey.value) {
      errorMessage.value = 'No private key available for signing'
      return
    }

    try {
      // Create proof from current markdown document
      const proof = await store.createProof(privateKey.value)
      const exportData = {
        title: store.title,
        content: store.content,
        timestamp: new Date().toISOString(),
        proof
      }

      exported.value = JSON.stringify(exportData, null, 2)
      currentProof.value = proof

      // Persist latest proof so other UI (export dialog) can include it
      try {
        localStorage.setItem('chainpaper_current_proof', JSON.stringify(proof))
        if (publicKeyB64.value) localStorage.setItem('chainpaper_public_key', publicKeyB64.value)
      } catch (e) {
        // ignore storage errors (private keys shouldn't be persisted)
      }

      // Try to verify locally if we have public key
      if (publicKeyB64.value) {
        await verifyProof()
      }

      errorMessage.value = null
    } catch (error: any) {
      errorMessage.value = `Failed to sign document: ${error.message}`
    }
  }

  async function verifyProof() {
    if (!publicKeyB64.value) {
      errorMessage.value = 'Public key required for verification'
      return
    }

    if (!currentProof.value) {
      errorMessage.value = 'No proof available to verify'
      return
    }

    try {
      const result = await store.verifyProof(publicKeyB64.value, currentProof.value)
      verified.value = result.valid
      computedHash.value = result.computedHash || null
      errorMessage.value = result.error || null
    } catch (error: any) {
      errorMessage.value = `Verification failed: ${error.message}`
      verified.value = false
      computedHash.value = null
    }
  }
</script>
