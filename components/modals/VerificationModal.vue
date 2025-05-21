<template>
  <ModalComponent
    :isOpen="isOpen"
    @update:isOpen="$emit('update:isOpen', $event)"
    title="Document Verification"
    :showFooter="false"
  >
    <div class="bg-white rounded-lg p-4">
      <div v-if="!verificationStatus" class="text-center py-6 text-gray-500">
        No verification performed yet. Click "Verify Authorship" to check document authenticity.
      </div>
      
      <div v-else>
        <div class="flex items-center mb-4">
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            :class="{'bg-green-100': verificationStatus === 'verified', 'bg-red-100': verificationStatus === 'failed'}"
          >
            <Shield 
              class="w-6 h-6" 
              :class="{'text-green-600': verificationStatus === 'verified', 'text-red-600': verificationStatus === 'failed'}"
            />
          </div>
          <div>
            <h3 
              class="text-lg font-medium" 
              :class="{'text-green-600': verificationStatus === 'verified', 'text-red-600': verificationStatus === 'failed'}"
            >
              {{ verificationStatus === 'verified' ? 'Verification Successful' : 'Verification Failed' }}
            </h3>
            <p class="text-sm text-gray-600">{{ verificationMessage }}</p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4 mt-4">
          <button 
            @click="verifyDocument" 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Verify Again
          </button>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { Shield } from 'lucide-vue-next';
import ModalComponent from '../ModalComponent.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    default: null
  },
  verificationMessage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:isOpen', 'verify']);

const verifyDocument = () => {
  emit('verify');
};
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