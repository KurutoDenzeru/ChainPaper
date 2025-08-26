<template>
  <div class="p-4">
    <div class="flex gap-2 mb-3">
      <Button variant="outline" size="sm" @click="generateKeys">Generate Keypair</Button>
      <Button variant="ghost" size="sm" @click="exportKeys" :disabled="!privateKey">Export Keys</Button>
    </div>

    <div class="mb-3">
      <Label>Public Key (SPKI, base64)</Label>
      <Textarea class="w-full" :value="publicKeyB64" readonly />
    </div>

    <div class="mb-3">
      <Label>Private Key (PKCS8, base64)</Label>
      <Textarea class="w-full" :value="privateKeyB64" readonly />
    </div>

    <div class="flex gap-2">
      <Button @click="signExport" :disabled="!privateKey">Sign & Export JSON</Button>
      <Button variant="secondary" @click="verifyCurrent" :disabled="!publicKeyB64 || !currentProof">Verify Proof</Button>
    </div>

    <div v-if="exported" class="mt-4 p-3 border rounded bg-gray-50">
      <div class="text-sm font-medium">Exported JSON</div>
      <pre class="text-xs mt-2 max-h-40 overflow-auto">{{ exported }}</pre>
    </div>

    <div v-if="currentProof" class="mt-4 p-3 border rounded bg-white">
      <div class="flex justify-between items-center">
        <div>
          <div class="text-sm font-medium">Proof</div>
          <div class="text-xs text-gray-600">Signature: {{ currentProof.signature.slice(0, 24) }}…</div>
        </div>
        <div class="text-sm">Status: <span :class="verified ? 'text-green-600' : 'text-red-600'">{{ verified ? 'Valid' : 'Unknown' }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { generateKeyPair, exportPublicKey, exportPrivateKey, importPrivateKey, importPublicKey } from '@/lib/crypto'
import useDocument from '@/composables/useDocument'

const { exportJSON, createProof, verifyProof } = useDocument()

const privateKey = ref<CryptoKey | null>(null)
const publicKey = ref<CryptoKey | null>(null)
const publicKeyB64 = ref('')
const privateKeyB64 = ref('')
const exported = ref('')
const currentProof = ref<any>(null)
const verified = ref<boolean | null>(null)

async function generateKeys() {
  const kp = await generateKeyPair()
  privateKey.value = kp.privateKey
  publicKey.value = kp.publicKey
  publicKeyB64.value = await exportPublicKey(kp.publicKey)
  privateKeyB64.value = await exportPrivateKey(kp.privateKey)
}

async function exportKeys() {
  // trigger download of keys as files
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
  if (!privateKey.value) return
  const { exportObj, proof } = await createProof(privateKey.value)
  exported.value = JSON.stringify(exportObj, null, 2)
  currentProof.value = proof
  verified.value = true
}

async function verifyCurrent() {
  if (!publicKeyB64.value || !currentProof.value) return
  const res = await verifyProof(publicKeyB64.value, currentProof.value)
  verified.value = !!res.valid
}
</script>
