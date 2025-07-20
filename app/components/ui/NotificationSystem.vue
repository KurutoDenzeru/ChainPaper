<template>
  <div class="notifications-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="[
        'notification',
        `notification--${notification.type}`
      ]"
    >
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m9 12 2 2 4-4"/>
          <circle cx="12" cy="12" r="9"/>
        </svg>
        <svg v-else-if="notification.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <svg v-else-if="notification.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="m12 17 .01 0"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v4"/>
          <path d="m12 16 .01 0"/>
        </svg>
      </div>
      
      <div class="notification-content">
        <div class="notification-title">{{ notification.title }}</div>
        <div v-if="notification.message" class="notification-message">{{ notification.message }}</div>
      </div>
      
      <button @click="removeNotification(notification.id)" class="notification-close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const notifications = ref<Notification[]>([])

function showNotification(type: Notification['type'], title: string, message?: string, duration = 5000) {
  const id = Date.now().toString()
  const notification: Notification = {
    id,
    type,
    title,
    message,
    duration
  }
  
  notifications.value.push(notification)
  
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

function removeNotification(id: string) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

function showSuccess(title: string, message?: string) {
  showNotification('success', title, message)
}

function showError(title: string, message?: string) {
  showNotification('error', title, message, 8000)
}

function showWarning(title: string, message?: string) {
  showNotification('warning', title, message, 6000)
}

function showInfo(title: string, message?: string) {
  showNotification('info', title, message)
}

// Expose methods to parent component
defineExpose({
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;
  max-width: 100%;
}

.notification--success {
  border-left-color: #10b981;
}

.notification--error {
  border-left-color: #ef4444;
}

.notification--warning {
  border-left-color: #f59e0b;
}

.notification--info {
  border-left-color: #3b82f6;
}

.notification-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.notification--success .notification-icon {
  color: #10b981;
}

.notification--error .notification-icon {
  color: #ef4444;
}

.notification--warning .notification-icon {
  color: #f59e0b;
}

.notification--info .notification-icon {
  color: #3b82f6;
}

.notification-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.notification-message {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
  margin-top: -0.25rem;
  margin-right: -0.25rem;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.notification-close svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .notification {
    background: #1f2937;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  .notification-title {
    color: #f9fafb;
  }
  
  .notification-message {
    color: #d1d5db;
  }
  
  .notification-close {
    color: #6b7280;
  }
  
  .notification-close:hover {
    background: #374151;
    color: #9ca3af;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .notifications-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
  
  .notification {
    padding: 0.75rem;
  }
  
  .notification-title {
    font-size: 0.875rem;
  }
  
  .notification-message {
    font-size: 0.8125rem;
  }
}
</style>
