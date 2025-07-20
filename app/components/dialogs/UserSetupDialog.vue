<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Welcome to ChainPaper</DialogTitle>
        <DialogDescription>
          Set up your user profile to get started with document authorship verification
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto space-y-6 px-1">
        <!-- Basic Information -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="user-name">Full Name *</Label>
            <Input
              id="user-name"
              v-model="userData.name"
              placeholder="Enter your full name"
              required
            />
            <p class="text-xs text-gray-600">This will be used for document authorship</p>
          </div>

          <div class="space-y-2">
            <Label for="user-email">Email Address</Label>
            <Input
              id="user-email"
              v-model="userData.email"
              type="email"
              placeholder="your.email@example.com"
            />
            <p class="text-xs text-gray-600">Optional, for contact and verification purposes</p>
          </div>

          <div class="space-y-2">
            <Label for="user-organization">Organization</Label>
            <Input
              id="user-organization"
              v-model="userData.organization"
              placeholder="Your organization or company"
            />
            <p class="text-xs text-gray-600">Optional, appears in document metadata</p>
          </div>

          <div class="space-y-2">
            <Label for="user-title">Professional Title</Label>
            <Input
              id="user-title"
              v-model="userData.title"
              placeholder="Your job title or role"
            />
            <p class="text-xs text-gray-600">Optional, for professional documents</p>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <Checkbox
                id="generate-keys"
                v-model:checked="userData.generateKeys"
              />
              <div class="flex-1">
                <Label for="generate-keys" class="font-medium cursor-pointer">Generate cryptographic keys</Label>
                <p class="text-xs text-gray-600 mt-1">
                  Automatically generate a key pair for document signing and verification
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <Checkbox
                id="auto-sign"
                v-model:checked="userData.autoSign"
              />
              <div class="flex-1">
                <Label for="auto-sign" class="font-medium cursor-pointer">Auto-sign documents</Label>
                <p class="text-xs text-gray-600 mt-1">
                  Automatically sign new documents with your cryptographic signature
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <Checkbox
                id="backup-keys"
                v-model:checked="userData.backupKeys"
              />
              <div class="flex-1">
                <Label for="backup-keys" class="font-medium cursor-pointer">Enable key backup</Label>
                <p class="text-xs text-gray-600 mt-1">
                  Store encrypted backup of your keys for recovery purposes
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy & Usage -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Privacy & Usage</h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <Checkbox
                id="analytics"
                v-model:checked="userData.analytics"
              />
              <div class="flex-1">
                <Label for="analytics" class="font-medium cursor-pointer">Anonymous usage analytics</Label>
                <p class="text-xs text-gray-600 mt-1">
                  Help improve ChainPaper by sharing anonymous usage data
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <Checkbox
                id="updates"
                v-model:checked="userData.updates"
              />
              <div class="flex-1">
                <Label for="updates" class="font-medium cursor-pointer">Receive update notifications</Label>
                <p class="text-xs text-gray-600 mt-1">
                  Get notified about new features and security updates
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex items-start space-x-3">
            <Checkbox
              id="terms"
              v-model:checked="acceptedTerms"
              required
            />
            <div class="flex-1">
              <Label for="terms" class="font-medium cursor-pointer">I accept the Terms of Service and Privacy Policy *</Label>
              <p class="text-xs text-gray-600 mt-1">
                <button @click="showTerms" class="text-blue-600 hover:underline">View Terms</button> • 
                <button @click="showPrivacy" class="text-blue-600 hover:underline">View Privacy Policy</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="skipSetup">
          Skip Setup
        </Button>
        <Button 
          @click="completeSetup" 
          :disabled="!isFormValid"
        >
          Complete Setup
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [userData: any]
}>()

const open = ref(props.open)
const acceptedTerms = ref(false)

const userData = ref({
  name: '',
  email: '',
  organization: '',
  title: '',
  generateKeys: true,
  autoSign: true,
  backupKeys: true,
  analytics: true,
  updates: true
})

// Watch for prop changes
watch(() => props.open, (newValue) => {
  open.value = newValue
})

// Watch for open changes and emit
watch(open, (newValue) => {
  emit('update:open', newValue)
})

const isFormValid = computed(() => {
  return userData.value.name.trim() !== '' && acceptedTerms.value
})

function completeSetup() {
  if (!isFormValid.value) return
  
  const userProfile = {
    ...userData.value,
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    avatar: generateAvatar(userData.value.name)
  }
  
  emit('save', userProfile)
}

function skipSetup() {
  const anonymousUser = {
    name: 'Anonymous User',
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    avatar: '👤',
    generateKeys: false,
    autoSign: false,
    backupKeys: false,
    analytics: false,
    updates: false
  }
  
  emit('save', anonymousUser)
}

function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function generateAvatar(name: string) {
  // Generate a simple avatar based on initials
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
  
  return initials || '👤'
}

function showTerms() {
  window.open('#terms', '_blank')
}

function showPrivacy() {
  window.open('#privacy', '_blank')
}
</script>
