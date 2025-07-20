<template>
  <div class="welcome-screen">
    <div class="welcome-overlay" @click="$emit('close')"></div>
    
    <div class="welcome-container">
      <!-- Header -->
      <div class="welcome-header">
        <div class="logo-section">
          <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          <div>
            <h1 class="app-title">ChainPaper</h1>
            <p class="app-subtitle">Decentralized Document Editor with Verifiable Authorship</p>
          </div>
        </div>
        <button @click="$emit('close')" class="close-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Main Content -->
      <div class="welcome-content">
        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Get Started</h2>
          <div class="actions-grid">
            <button 
              @click="$emit('create-new')"
              class="action-card primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <div>
                <h3>Create New Document</h3>
                <p>Start with a blank document</p>
              </div>
            </button>

            <button 
              @click="handleOpenDocument"
              class="action-card"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <div>
                <h3>Open Document</h3>
                <p>Import existing document</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Templates -->
        <div class="templates-section" v-if="templates.length > 0">
          <h2>Templates</h2>
          <div class="templates-grid">
            <button
              v-for="template in templates"
              :key="template.id"
              @click="$emit('use-template', template)"
              class="template-card"
            >
              <div class="template-preview">
                <svg v-if="!template.thumbnail" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <img v-else :src="template.thumbnail" :alt="template.name" />
              </div>
              <div class="template-info">
                <h3>{{ template.name }}</h3>
                <p>{{ template.description }}</p>
                <span class="template-category">{{ template.category }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Documents -->
        <div class="recent-section" v-if="recentDocuments.length > 0">
          <h2>Recent Documents</h2>
          <div class="recent-list">
            <button
              v-for="doc in recentDocuments.slice(0, 5)"
              :key="doc.id"
              @click="handleOpenRecent(doc)"
              class="recent-item"
            >
              <div class="recent-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <div class="recent-info">
                <h4>{{ doc.title || 'Untitled Document' }}</h4>
                <p>{{ formatDate(doc.lastModified) }}</p>
                <span class="recent-author">by {{ doc.author }}</span>
              </div>
              <div class="recent-stats">
                <span>{{ doc.wordCount || 0 }} words</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Features -->
        <div class="features-section">
          <h2>Features</h2>
          <div class="features-grid">
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h3>Verifiable Authorship</h3>
              <p>Cryptographic proof of document ownership and authenticity</p>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <h3>Decentralized Storage</h3>
              <p>Store documents securely without relying on central servers</p>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h3>Rich Editing</h3>
              <p>Full-featured document editing with advanced formatting</p>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <h3>Export Formats</h3>
              <p>Export to JSON, PDF, DOCX, HTML, and more formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  recentDocuments: any[]
  templates: any[]
}>()

const emit = defineEmits<{
  'create-new': []
  'open-document': [file?: File]
  'use-template': [template: any]
  'close': []
}>()

function handleOpenDocument() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.docx,.html,.txt'
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      emit('open-document', file)
    }
  }
  input.click()
}

function handleOpenRecent(doc: any) {
  // In a real implementation, this would load the document from storage
  console.log('Opening recent document:', doc)
  emit('close')
}

function formatDate(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return d.toLocaleDateString()
  }
}
</script>

<style scoped>
.welcome-screen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.welcome-container {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 1200px;
  max-height: 90vh;
  width: 90vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 3rem;
  height: 3rem;
  stroke-width: 1.5;
}

.app-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.app-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-button svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: white;
  stroke-width: 2;
}

.welcome-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.welcome-content h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.quick-actions {
  margin-bottom: 3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.action-card.primary {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.action-card.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.action-card svg {
  width: 2.5rem;
  height: 2.5rem;
  stroke-width: 1.5;
  flex-shrink: 0;
}

.action-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-card p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.875rem;
}

.templates-section,
.recent-section,
.features-section {
  margin-bottom: 3rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.template-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.template-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.template-preview {
  height: 120px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.template-preview svg {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
  stroke-width: 1.5;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-info {
  padding: 1rem;
}

.template-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.template-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.template-category {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.recent-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.recent-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  stroke-width: 1.5;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.recent-author {
  font-size: 0.75rem;
  color: #9ca3af;
}

.recent-stats {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature {
  text-align: center;
  padding: 1.5rem;
}

.feature svg {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  stroke-width: 1.5;
  margin-bottom: 1rem;
}

.feature h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.feature p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}
</style>
