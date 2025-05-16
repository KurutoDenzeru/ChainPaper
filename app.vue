<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">ChainPaper</h1>
        <p class="text-sm text-gray-500">Trustless whitepaper collaboration tool with authorship proofs</p>
      </div>
    </header> -->
    <!-- Toast Manager for notifications -->
    <ToastManager />
    <main class="max-w-full mx-auto">
      <EditorComponent />
    </main>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import EditorComponent from './components/EditorComponent.vue';
import ToastManager from './components/ToastManager.vue';

// Create and provide toast service at the app level
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

// Provide the toasts array for the ToastManager component
provide('toasts', toasts);

useHead({
  title: 'ChainPaper',
  meta: [
    { name: 'description', content: 'Trustless whitepaper collaboration tool with authorship proofs' },
    { name: 'keywords', content: 'whitepaper, collaboration, authorship, proofs' },
    { name: 'author', content: 'ChainPaper' }
  ]
})
</script>
