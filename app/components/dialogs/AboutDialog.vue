<template>
  <Dialog v-model:open="open">
    <DialogContent class="about-dialog">
      <DialogHeader>
        <DialogTitle class="about-title">
          <div class="logo-section">
            <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            ChainPaper
          </div>
        </DialogTitle>
        <DialogDescription>
          A sophisticated decentralized document editor with verifiable authorship
        </DialogDescription>
      </DialogHeader>

      <div class="about-content">
        <div class="version-info">
          <div class="version-item">
            <strong>Version:</strong> 1.0.0 Beta
          </div>
          <div class="version-item">
            <strong>Build:</strong> {{ getBuildInfo() }}
          </div>
          <div class="version-item">
            <strong>License:</strong> MIT
          </div>
        </div>

        <div class="features-section">
          <h3>Key Features</h3>
          <ul class="features-list">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Cryptographic authorship verification
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Decentralized document storage
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              Rich text editing with ProseMirror
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
              </svg>
              Multiple export formats (PDF, DOCX, HTML, Markdown)
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
              </svg>
              Advanced spell checking and grammar
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect width="3" height="8" x="13" y="2" rx="1.5"/>
                <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5"/>
                <rect width="3" height="8" x="8" y="14" rx="1.5"/>
                <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5"/>
                <rect width="8" height="3" x="14" y="13" rx="1.5"/>
                <path d="M15.5 19H14v1.5A1.5 1.5 0 1 0 15.5 19"/>
                <rect width="8" height="3" x="2" y="8" rx="1.5"/>
                <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5"/>
              </svg>
              Modular and extensible architecture
            </li>
          </ul>
        </div>

        <div class="tech-stack">
          <h3>Technology Stack</h3>
          <div class="tech-grid">
            <div class="tech-item">
              <strong>Frontend:</strong> Nuxt.js 4, Vue.js 3, TypeScript
            </div>
            <div class="tech-item">
              <strong>Editor:</strong> ProseMirror
            </div>
            <div class="tech-item">
              <strong>Styling:</strong> Tailwind CSS, Shadcn Vue
            </div>
            <div class="tech-item">
              <strong>Crypto:</strong> Web Crypto API, CryptoJS
            </div>
            <div class="tech-item">
              <strong>Storage:</strong> IndexedDB, LocalStorage
            </div>
            <div class="tech-item">
              <strong>Export:</strong> jsPDF, Mammoth, html2canvas
            </div>
          </div>
        </div>

        <div class="links-section">
          <h3>Links</h3>
          <div class="links-grid">
            <a href="#" class="link-item" @click.prevent="openGitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
              GitHub Repository
            </a>
            <a href="#" class="link-item" @click.prevent="openDocumentation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Documentation
            </a>
            <a href="#" class="link-item" @click.prevent="openSupport">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
              Support & Feedback
            </a>
            <a href="#" class="link-item" @click.prevent="openLicense">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              License (MIT)
            </a>
          </div>
        </div>

        <div class="credits-section">
          <h3>Credits</h3>
          <p class="credits-text">
            ChainPaper is built with open-source technologies and libraries. 
            Special thanks to the Vue.js, Nuxt.js, and ProseMirror communities 
            for their excellent work.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button @click="open = false">
          Close
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

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = ref(props.open)

// Watch for prop changes
watch(() => props.open, (newValue) => {
  open.value = newValue
})

// Watch for open changes and emit
watch(open, (newValue) => {
  emit('update:open', newValue)
})

function getBuildInfo() {
  const now = new Date()
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
}

function openGitHub() {
  window.open('https://github.com/chainpaper/chainpaper', '_blank')
}

function openDocumentation() {
  window.open('https://docs.chainpaper.io', '_blank')
}

function openSupport() {
  window.open('https://github.com/chainpaper/chainpaper/issues', '_blank')
}

function openLicense() {
  window.open('https://github.com/chainpaper/chainpaper/blob/main/LICENSE', '_blank')
}
</script>

<style scoped>
.about-dialog {
  max-width: 700px;
  max-height: 80vh;
  overflow: hidden;
}

.about-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  width: 2rem;
  height: 2rem;
  stroke: #3b82f6;
  stroke-width: 1.5;
}

.about-content {
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.version-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.version-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.features-section h3,
.tech-stack h3,
.links-section h3,
.credits-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.features-list svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: #3b82f6;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.tech-item {
  font-size: 0.875rem;
  color: #374151;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.link-item:hover {
  background: #e5e7eb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.link-item svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.credits-text {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .version-info,
  .tech-item,
  .link-item {
    background: #374151;
    color: #d1d5db;
  }
  
  .link-item:hover {
    background: #4b5563;
  }
  
  .features-section h3,
  .tech-stack h3,
  .links-section h3,
  .credits-section h3 {
    color: #f9fafb;
  }
  
  .features-list li,
  .tech-item {
    color: #d1d5db;
  }
  
  .credits-text {
    color: #9ca3af;
  }
}
</style>
