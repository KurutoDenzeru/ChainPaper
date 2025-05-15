<template>
  <ModalComponent
    :isOpen="isOpen"
    @update:isOpen="$emit('update:isOpen', $event)"
    title="About ChainPaper"
    :showFooter="false"
  >
    <div class="bg-white rounded-lg p-4">
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Project Information</h3>
        <p class="text-gray-600 mb-4">
          ChainPaper is a trustless whitepaper collaboration tool with authorship proofs. It allows multiple users to collaborate on documents while maintaining cryptographic proof of contributions.
        </p>
        <p class="text-gray-600">
          Built with Vue.js, Yjs for real-time collaboration, and cryptographic verification using Merkle Trees.
        </p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Connect With Us</h3>
        <div class="flex space-x-4">
          <a href="https://www.instagram.com/krtclcdy/" class="text-gray-500 hover:text-gray-700 flex items-center">
            <Instagram class="w-5 h-5 mr-2" />
            Instagram
          </a>
          <a href="https://www.linkedin.com/in/kurtcalacday/" class="text-gray-500 hover:text-gray-700 flex items-center">
            <Linkedin class="w-5 h-5 mr-2" />
            LinkedIn
          </a>
          <a href="https://github.com/KurutoDenzeru" class="text-gray-500 hover:text-gray-700 flex items-center">
            <Github class="w-5 h-5 mr-2" />
            GitHub
          </a>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <p class="text-sm text-gray-500">© 2025 ChainPaper. All rights reserved.</p>
        <p class="text-xs text-gray-400">Trustless whitepaper collaboration tool</p>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Instagram, Github, Linkedin } from 'lucide-vue-next';
import ModalComponent from '../ModalComponent.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isOpen']);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>