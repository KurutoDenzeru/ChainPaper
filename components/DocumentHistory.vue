<template>
  <div class="bg-white shadow rounded-lg p-6 mt-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Document History</h2>
    
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
                  class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Copy full hash"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import documentStorage from '../utils/documentStorage';

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