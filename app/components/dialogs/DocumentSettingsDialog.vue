<template>
  <Dialog v-model:open="open">
    <DialogContent class="settings-dialog">
      <DialogHeader>
        <DialogTitle>Document Settings</DialogTitle>
        <DialogDescription>
          Configure document settings and security options
        </DialogDescription>
      </DialogHeader>

      <div class="settings-content">
        <div class="settings-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="tab-content">
          <div class="form-group">
            <Label for="document-title">Document Title</Label>
            <Input
              id="document-title"
              v-model="localSettings.title"
              placeholder="Enter document title"
            />
          </div>

          <div class="form-group">
            <Label for="document-description">Description</Label>
            <Textarea
              id="document-description"
              v-model="localSettings.description"
              placeholder="Document description"
              rows="3"
            />
          </div>

          <div class="form-group">
            <Label for="document-language">Language</Label>
            <Select v-model="localSettings.language">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <Checkbox
                id="auto-save"
                v-model:checked="localSettings.autoSave"
              />
              <Label for="auto-save">Auto-save document</Label>
            </div>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <Checkbox
                id="spell-check"
                v-model:checked="localSettings.spellCheck"
              />
              <Label for="spell-check">Enable spell check</Label>
            </div>
          </div>
        </div>

        <!-- Formatting Settings -->
        <div v-if="activeTab === 'formatting'" class="tab-content">
          <div class="form-group">
            <Label for="font-family">Font Family</Label>
            <Select v-model="localSettings.fontFamily">
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="form-group">
            <Label for="font-size">Font Size</Label>
            <Select v-model="localSettings.fontSize">
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8pt</SelectItem>
                <SelectItem value="9">9pt</SelectItem>
                <SelectItem value="10">10pt</SelectItem>
                <SelectItem value="11">11pt</SelectItem>
                <SelectItem value="12">12pt</SelectItem>
                <SelectItem value="14">14pt</SelectItem>
                <SelectItem value="16">16pt</SelectItem>
                <SelectItem value="18">18pt</SelectItem>
                <SelectItem value="20">20pt</SelectItem>
                <SelectItem value="24">24pt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="form-group">
            <Label for="line-spacing">Line Spacing</Label>
            <Select v-model="localSettings.lineSpacing">
              <SelectTrigger>
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Single</SelectItem>
                <SelectItem value="1.15">1.15</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2">Double</SelectItem>
                <SelectItem value="2.5">2.5</SelectItem>
                <SelectItem value="3">Triple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <div class="form-group">
            <div class="checkbox-group">
              <Checkbox
                id="enable-signing"
                v-model:checked="localSecurity.enableSigning"
              />
              <Label for="enable-signing">Enable document signing</Label>
            </div>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <Checkbox
                id="require-verification"
                v-model:checked="localSecurity.requireVerification"
              />
              <Label for="require-verification">Require authorship verification</Label>
            </div>
          </div>

          <div class="form-group">
            <Label for="encryption-level">Encryption Level</Label>
            <Select v-model="localSecurity.encryptionLevel">
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="basic">Basic (AES-128)</SelectItem>
                <SelectItem value="standard">Standard (AES-256)</SelectItem>
                <SelectItem value="advanced">Advanced (RSA-2048)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="form-group">
            <Label for="backup-frequency">Backup Frequency</Label>
            <Select v-model="localSecurity.backupFrequency">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="open = false">
          Cancel
        </Button>
        <Button @click="saveSettings">
          Save Settings
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  open: boolean
  settings: any
  security: any
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [settings: any, security: any]
}>()

const open = ref(props.open)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'formatting', label: 'Formatting' },
  { id: 'security', label: 'Security' }
]

// Local copies of settings
const localSettings = ref({ ...props.settings })
const localSecurity = ref({ ...props.security })

// Watch for prop changes
watch(() => props.open, (newValue) => {
  open.value = newValue
})

watch(() => props.settings, (newValue) => {
  localSettings.value = { ...newValue }
})

watch(() => props.security, (newValue) => {
  localSecurity.value = { ...newValue }
})

// Watch for open changes and emit
watch(open, (newValue) => {
  emit('update:open', newValue)
})

function saveSettings() {
  emit('save', localSettings.value, localSecurity.value)
}
</script>

<style scoped>
.settings-dialog {
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-weight: 500;
  color: #6b7280;
}

.tab-button:hover {
  color: #3b82f6;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}
</style>
