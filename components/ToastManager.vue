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
import { ref, provide } from 'vue';
import ToastNotification from './ToastNotification.vue';

const toasts = ref([]);

const addToast = (toast) => {
  const newToast = {
    title: toast.title || 'Notification',
    message: toast.message,
    type: toast.type || 'info',
    duration: toast.duration || 3000,
    show: true
  };
  
  toasts.value.push(newToast);
  
  return toasts.value.length - 1;
};

const removeToast = (index) => {
  if (index >= 0 && index < toasts.value.length) {
    toasts.value[index].show = false;
    setTimeout(() => {
      toasts.value.splice(index, 1);
    }, 300); // Allow time for exit animation
  }
};

const clearToasts = () => {
  toasts.value = [];
};

// Provide toast methods to all components
provide('toast', {
  success: (message, title = 'Success', duration = 3000) => {
    return addToast({ title, message, type: 'success', duration });
  },
  error: (message, title = 'Error', duration = 5000) => {
    return addToast({ title, message, type: 'error', duration });
  },
  info: (message, title = 'Information', duration = 3000) => {
    return addToast({ title, message, type: 'info', duration });
  },
  remove: removeToast,
  clear: clearToasts
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>