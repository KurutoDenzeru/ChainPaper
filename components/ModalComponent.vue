<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 content-center bg-black/75">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="closeOnBackdrop && close()"
          ></div>

          <!-- Modal panel -->
          <Transition name="modal-content">
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle max-w-5xl sm:w-full pointer-events-auto relative" @click.stop>
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {{ title }}
                      </h3>
                      <button 
                        @click="close" 
                        class="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                      >
                        <X class="h-5 w-5" />
                      </button>
                    </div>
                    <div class="mt-2 select-text">
                      <slot></slot>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="showFooter" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  v-if="showConfirmButton"
                  @click="confirm" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ confirmText }}
                </button>
                <button 
                  v-if="showCancelButton"
                  @click="close" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ cancelText }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    default: 'Modal'
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:isOpen', 'confirm', 'close']);

const close = () => {
  emit('update:isOpen', false);
  emit('close');
};

const confirm = () => {
  emit('confirm');
  close();
};

// Listen for escape key to close modal
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    close();
  }
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    // Restore body scrolling when modal is closed
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal content animation */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>