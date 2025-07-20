<template>
  <Dialog v-model:open="open">
    <DialogContent class="user-setup-dialog">
      <DialogHeader>
        <DialogTitle>Welcome to ChainPaper</DialogTitle>
        <DialogDescription>
          Set up your user profile to get started with document authorship verification
        </DialogDescription>
      </DialogHeader>

      <div class="setup-content">
        <div class="form-group">
          <Label for="user-name">Full Name *</Label>
          <Input
            id="user-name"
            v-model="userData.name"
            placeholder="Enter your full name"
            required
          />
          <p class="field-help">This will be used for document authorship</p>
        </div>

        <div class="form-group">
          <Label for="user-email">Email Address</Label>
          <Input
            id="user-email"
            v-model="userData.email"
            type="email"
            placeholder="your.email@example.com"
          />
          <p class="field-help">Optional, for contact and verification purposes</p>
        </div>

        <div class="form-group">
          <Label for="user-organization">Organization</Label>
          <Input
            id="user-organization"
            v-model="userData.organization"
            placeholder="Your organization or company"
          />
          <p class="field-help">Optional, appears in document metadata</p>
        </div>

        <div class="form-group">
          <Label for="user-title">Professional Title</Label>
          <Input
            id="user-title"
            v-model="userData.title"
            placeholder="Your job title or role"
          />
          <p class="field-help">Optional, for professional documents</p>
        </div>

        <div class="security-section">
          <h3>Security Settings</h3>
          
          <div class="checkbox-group">
            <Checkbox
              id="generate-keys"
              v-model:checked="userData.generateKeys"
            />
            <div class="checkbox-content">
              <Label for="generate-keys">Generate cryptographic keys</Label>
              <p class="field-help">
                Automatically generate a key pair for document signing and verification
              </p>
            </div>
          </div>

          <div class="checkbox-group">
            <Checkbox
              id="auto-sign"
              v-model:checked="userData.autoSign"
            />
            <div class="checkbox-content">
              <Label for="auto-sign">Auto-sign documents</Label>
              <p class="field-help">
                Automatically sign new documents with your cryptographic signature
              </p>
            </div>
          </div>

          <div class="checkbox-group">
            <Checkbox
              id="backup-keys"
              v-model:checked="userData.backupKeys"
            />
            <div class="checkbox-content">
              <Label for="backup-keys">Enable key backup</Label>
              <p class="field-help">
                Store encrypted backup of your keys for recovery purposes
              </p>
            </div>
          </div>
        </div>

        <div class="privacy-section">
          <h3>Privacy & Usage</h3>
          
          <div class="checkbox-group">
            <Checkbox
              id="analytics"
              v-model:checked="userData.analytics"
            />
            <div class="checkbox-content">
              <Label for="analytics">Anonymous usage analytics</Label>
              <p class="field-help">
                Help improve ChainPaper by sharing anonymous usage data
              </p>
            </div>
          </div>

          <div class="checkbox-group">
            <Checkbox
              id="updates"
              v-model:checked="userData.updates"
            />
            <div class="checkbox-content">
              <Label for="updates">Receive update notifications</Label>
              <p class="field-help">
                Get notified about new features and security updates
              </p>
            </div>
          </div>
        </div>

        <div class="terms-section">
          <div class="checkbox-group">
            <Checkbox
              id="terms"
              v-model:checked="acceptedTerms"
              required
            />
            <div class="checkbox-content">
              <Label for="terms">I accept the Terms of Service and Privacy Policy *</Label>
              <p class="field-help">
                <a href="#" @click.prevent="showTerms">View Terms</a> • 
                <a href="#" @click.prevent="showPrivacy">View Privacy Policy</a>
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

<style scoped>
.user-setup-dialog {
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.setup-content {
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  margin-top: 0.25rem;
}

.security-section,
.privacy-section,
.terms-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.security-section h3,
.privacy-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox-content {
  flex: 1;
}

.checkbox-content label {
  margin: 0;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-content .field-help {
  margin-top: 0.25rem;
}

.terms-section .checkbox-content .field-help a {
  color: #3b82f6;
  text-decoration: none;
}

.terms-section .checkbox-content .field-help a:hover {
  text-decoration: underline;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .security-section,
  .privacy-section,
  .terms-section {
    border-top-color: #374151;
  }
  
  .security-section h3,
  .privacy-section h3 {
    color: #f9fafb;
  }
  
  .field-help {
    color: #9ca3af;
  }
  
  .terms-section .checkbox-content .field-help a {
    color: #60a5fa;
  }
}
</style>
