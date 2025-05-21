<template>
  <ModalComponent
    :isOpen="isOpen"
    @update:isOpen="$emit('update:isOpen', $event)"
    title="Document History"
    :showFooter="false"
  >
    <div class="bg-white rounded-lg">
      <div v-if="history.length === 0" class="text-center py-6 text-gray-500">
        No history available yet. Make changes to create a version history.
      </div>
      
      <div v-else class="overflow-hidden">
        <div class="border rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash (First 8 chars)</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(entry, index) in history" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ history.length - index }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(entry.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.author || 'Anonymous' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                  {{ entry.hash.substring(0, 8) }}
                  <button 
                    @click="copyToClipboard(entry.hash)" 
                    class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
                    title="Copy full hash"
                  >
                    <Copy class="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 text-sm text-gray-600">
          <p>Merkle Root: <span class="font-mono">{{ merkleRoot ? merkleRoot.substring(0, 16) + '...' : 'Not available' }}</span></p>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import documentStorage from '../../utils/documentStorage.ts';
import { Copy } from 'lucide-vue-next';
import ModalComponent from '../ModalComponent.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isOpen']);

const history = ref([]);
const merkleRoot = ref(null);

// Load history on mount
onMounted(async () => {
  await documentStorage.initialize();
  refreshHistory();
});

// Refresh history data
const refreshHistory = () => {
  history.value = documentStorage.getHistory().slice().reverse();
  merkleRoot.value = documentStorage.merkleTree.root;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
};

// Copy hash to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Hash copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};

// Watch for storage events to refresh history
watch(() => documentStorage.merkleTree.leaves.length, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    refreshHistory();
  }
});
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