<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2">
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 w-full sm:min-w-[300px] sm:max-w-[400px] sm:w-auto"
          :class="{
            'border-green-200 bg-green-50': notification.type === 'success',
            'border-blue-200 bg-blue-50': notification.type === 'info',
            'border-yellow-200 bg-yellow-50': notification.type === 'warning',
            'border-red-200 bg-red-50': notification.type === 'error'
          }"
        >
          <div class="flex items-start space-x-2 sm:space-x-3">
            <div class="flex-shrink-0">
              <CheckCircle 
                v-if="notification.type === 'success'" 
                class="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
              />
              <Info 
                v-else-if="notification.type === 'info'" 
                class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
              />
              <AlertTriangle 
                v-else-if="notification.type === 'warning'" 
                class="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600"
              />
              <XCircle 
                v-else-if="notification.type === 'error'" 
                class="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 
                v-if="notification.title"
                class="text-xs sm:text-sm font-medium"
                :class="{
                  'text-green-900': notification.type === 'success',
                  'text-blue-900': notification.type === 'info',
                  'text-yellow-900': notification.type === 'warning',
                  'text-red-900': notification.type === 'error'
                }"
              >
                {{ notification.title }}
              </h4>
              <p 
                class="text-xs sm:text-sm"
                :class="{
                  'text-green-700': notification.type === 'success',
                  'text-blue-700': notification.type === 'info',
                  'text-yellow-700': notification.type === 'warning',
                  'text-red-700': notification.type === 'error'
                }"
              >
                {{ notification.message }}
              </p>
            </div>
            <button
              @click="removeNotification(notification.id)"
              class="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-vue-next'

export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newNotification: Notification = {
    id,
    ...notification
  }
  
  notifications.value.push(newNotification)
  
  // Auto remove after duration
  const duration = notification.duration ?? 5000
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAll = () => {
  notifications.value = []
}

// Expose methods to parent component
defineExpose({
  addNotification,
  removeNotification,
  clearAll
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
