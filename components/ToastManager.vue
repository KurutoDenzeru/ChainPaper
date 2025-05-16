<template>
  <div class="toast-container">
    <ToastNotification
      v-for="(toast, index) in toasts"
      :key="index"
      :title="toast.title"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      :show="toast.show"
      @close="removeToast(index)"
    />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import ToastNotification from './ToastNotification.vue';

// Use the toast service provided at the app level
const toast = inject('toast');

// Access the toasts array from the parent component
const toasts = inject('toasts', []);

// Use the removeToast method from the parent component
const removeToast = (index) => {
  toast.remove(index);
};

</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column-reverse; /* Show newest toast at the bottom */
  gap: 0.75rem;
  pointer-events: none; /* Allow clicking through the container */
}

.toast-container > :deep(*) {
  pointer-events: auto; /* Re-enable pointer events for toast notifications */
}
</style>