<template>
  <div>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Document Editor</h2>
        <div class="flex space-x-2">
          <button @click="saveDocument" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save
          </button>
          <button @click="exportDocument" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Export
          </button>
        </div>
      </div>
      
      <div class="border border-gray-300 rounded-lg p-4 min-h-[400px] mb-4">
        <!-- TipTap Editor will be mounted here -->
        <div v-if="editor" class="prose max-w-none">
          <editor-content :editor="editor" />
        </div>
        <div v-else class="flex justify-center items-center h-64">
          <p class="text-gray-500">Loading editor...</p>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-md font-medium text-gray-700 mb-2">Document Verification</h3>
        <div class="text-sm text-gray-600">
          <p>Current document hash: {{ currentHash || 'Not generated yet' }}</p>
          <p>Last edited: {{ lastEdited || 'Not edited yet' }}</p>
          <p>Contributors: {{ contributors.length || 0 }}</p>
        </div>
      </div>
    </div>
    
    <!-- Document History Component -->
    <DocumentHistory />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import DocumentHistory from './DocumentHistory.vue';
import documentStorage from '../utils/documentStorage';

// Document state
const editor = ref(null);
const currentHash = ref('');
const lastEdited = ref('');
const contributors = ref([]);
const username = ref('Anonymous User-' + Math.floor(Math.random() * 1000));

// Yjs document setup
const ydoc = new Y.Doc();
const provider = ref(null);
const persistence = ref(null);

// Initialize editor with collaboration features
onMounted(async () => {
  // Initialize document storage
  await documentStorage.initialize();
  
  // Set up persistence with IndexedDB
  persistence.value = new IndexeddbPersistence('chainpaper-document', ydoc);
  
  // Set up WebRTC provider for real-time collaboration
  provider.value = new WebrtcProvider('chainpaper-document', ydoc, {
    signaling: ['wss://signaling.yjs.dev']
  });
  
  // Add current user to awareness
  provider.value.awareness.setLocalStateField('user', {
    name: username.value,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
  });
  
  // Initialize TipTap editor with Yjs collaboration
  const ytext = ydoc.getText('content');
  
  // Load existing document if available
  const savedDocument = documentStorage.loadDocument();
  
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    content: savedDocument?.content || '',
    onUpdate: ({ editor }) => {
      // Generate hash of current content
      generateContentHash(editor.getHTML());
      // Update last edited timestamp
      lastEdited.value = new Date().toISOString();
    },
  });
  
  // If we have a saved document, update the hash and timestamp
  if (savedDocument) {
    currentHash.value = savedDocument.hash;
    lastEdited.value = savedDocument.timestamp;
  }
  
  // Track contributors
  provider.value.awareness.on('change', () => {
    const states = provider.value.awareness.getStates();
    const users = [];
    states.forEach((state) => {
      if (state.user) {
        users.push(state.user);
      }
    });
    contributors.value = users;
  });
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
  if (provider.value) {
    provider.value.destroy();
  }
  if (persistence.value) {
    persistence.value.destroy();
  }
  ydoc.destroy();
});

// Generate SHA-256 hash of content
const generateContentHash = async (content) => {
  if (!content) return;
  
  try {
    // Use Web Crypto API for SHA-256 hashing
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    currentHash.value = hashHex;
    return hashHex;
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
};

// Save document using DocumentStorage
const saveDocument = async () => {
  if (!editor.value) return;
  
  const documentData = {
    content: editor.value.getHTML(),
    hash: currentHash.value,
    timestamp: new Date().toISOString(),
    author: username.value,
    contributors: contributors.value.map(user => user.name),
  };
  
  try {
    await documentStorage.saveDocument(documentData);
    alert('Document saved successfully!');
  } catch (error) {
    console.error('Error saving document:', error);
    alert('Failed to save document.');
  }
};

// Export document as JSON with Merkle proof
const exportDocument = () => {
  if (!editor.value) return;
  
  // Get document with proof from storage
  const exportData = documentStorage.exportWithProof();
  
  if (!exportData) {
    alert('No document to export. Please save the document first.');
    return;
  }
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `chainpaper-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
</script>