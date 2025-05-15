<template>
  <div>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Document Editor</h2>
        <div class="flex space-x-2">
          <button @click="saveDocument" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Save class="w-4 h-4 inline-block mr-1" />
            Save
          </button>
          <button @click="exportDocument" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <Download class="w-4 h-4 inline-block mr-1" />
            Export
          </button>
          <button @click="importDocument" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            <Upload class="w-4 h-4 inline-block mr-1" />
            Import
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            accept=".json" 
            class="hidden" 
            @change="handleFileUpload"
          />
        </div>
      </div>
      
      <!-- Rich Text Editor Toolbar -->
      <div v-if="editor" class="border-b border-gray-300 pb-2 mb-2 flex flex-wrap gap-1">
        <button 
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200': editor.isActive('bold') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Bold"
        >
          <Bold class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Italic"
        >
          <Italic class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-gray-200': editor.isActive('strike') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Strikethrough"
        >
          <Strikethrough class="w-5 h-5" />
        </button>
        <span class="border-r border-gray-300 mx-1"></span>
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 1 }) }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Heading 1"
        >
          <Heading1 class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Heading 2"
        >
          <Heading2 class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Heading 3"
        >
          <Heading3 class="w-5 h-5" />
        </button>
        <span class="border-r border-gray-300 mx-1"></span>
        <button 
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Bullet List"
        >
          <List class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Ordered List"
        >
          <ListOrdered class="w-5 h-5" />
        </button>
        <span class="border-r border-gray-300 mx-1"></span>
        <button 
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Blockquote"
        >
          <Quote class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Horizontal Rule"
        >
          <Minus class="w-5 h-5" />
        </button>
        <span class="border-r border-gray-300 mx-1"></span>
        <button 
          @click="editor.chain().focus().undo().run()"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Undo"
        >
          <Undo class="w-5 h-5" />
        </button>
        <button 
          @click="editor.chain().focus().redo().run()"
          class="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Redo"
        >
          <Redo class="w-5 h-5" />
        </button>
      </div>
      
      <div class="border border-gray-300 rounded-lg p-4 min-h-[400px] mb-4 bg-white">
        <!-- TipTap Editor will be mounted here -->
        <div v-if="editor" class="prose max-w-none editor-content">
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
          <div class="mt-3 flex items-center">
            <button @click="verifyDocument" class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Verify Authorship
            </button>
            <span v-if="verificationStatus" class="ml-3 text-sm" :class="{'text-green-600': verificationStatus === 'verified', 'text-red-600': verificationStatus === 'failed'}">
              {{ verificationMessage }}
            </span>
          </div>
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
import documentStorage from '../utils/documentStorage.ts';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Save, Download, Upload
} from 'lucide-vue-next';

// Document state
const editor = ref(null);
const currentHash = ref('');
const lastEdited = ref('');
const contributors = ref([]);
const username = ref('Anonymous User-' + Math.floor(Math.random() * 1000));
const fileInput = ref(null);
const verificationStatus = ref(null);
const verificationMessage = ref('');

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
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: true,
        orderedList: true,
        blockquote: true,
        horizontalRule: true,
        strike: true,
        bold: true,
        italic: true,
        history: true,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    content: savedDocument?.content || '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[350px] p-2',
        'data-placeholder': 'Start typing your document...',
      },
    },
    onUpdate: ({ editor }) => {
      // Generate hash of current content
      generateContentHash(editor.getHTML());
      // Update last edited timestamp
      lastEdited.value = new Date().toISOString();
    },
  });
  
  // Add keyboard shortcuts for common formatting actions
  editor.value.registerCommand('Mod-b', () => editor.value.chain().focus().toggleBold().run());
  editor.value.registerCommand('Mod-i', () => editor.value.chain().focus().toggleItalic().run());
  
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

// Import document from JSON file
const importDocument = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file upload for import
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const fileContent = await readFileAsText(file);
    const importData = JSON.parse(fileContent);
    
    // Validate the imported data structure
    if (!importData.document || !importData.merkleRoot || !importData.history) {
      alert('Invalid document format. Please upload a valid ChainPaper export file.');
      return;
    }
    
    // Import the document content into the editor
    if (editor.value && importData.document.content) {
      // Update editor content
      editor.value.commands.setContent(importData.document.content);
      
      // Update document metadata
      currentHash.value = importData.document.hash || '';
      lastEdited.value = importData.document.timestamp || new Date().toISOString();
      
      // Use the documentStorage importDocument method
      await documentStorage.initialize();
      const importSuccess = documentStorage.importDocument(importData);
      
      if (importSuccess) {
        alert('Document imported successfully!');
      } else {
        alert('There was an issue importing the document. Some data may not have been imported correctly.');
      }
    }
  } catch (error) {
    console.error('Error importing document:', error);
    alert('Failed to import document. Please check the file format.');
  }
  
  // Reset file input
  event.target.value = null;
};

// Helper function to read file as text
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Verify document authorship
const verifyDocument = async () => {
  if (!currentHash.value) {
    verificationStatus.value = 'failed';
    verificationMessage.value = 'No document hash available. Please save the document first.';
    return;
  }
  
  try {
    // Get the current document content and hash
    const content = editor.value.getHTML();
    const generatedHash = await generateContentHash(content);
    
    // Check if the current hash matches the stored hash
    if (generatedHash !== currentHash.value) {
      verificationStatus.value = 'failed';
      verificationMessage.value = 'Document has been modified since last save.';
      return;
    }
    
    // Use the documentStorage verifyAuthorship method
    const verificationResult = documentStorage.verifyAuthorship(currentHash.value);
    
    if (verificationResult.verified) {
      verificationStatus.value = 'verified';
      verificationMessage.value = `${verificationResult.message} Author: ${verificationResult.author}`;
    } else {
      verificationStatus.value = 'failed';
      verificationMessage.value = verificationResult.message;
    }
  } catch (error) {
    console.error('Error verifying document:', error);
    verificationStatus.value = 'failed';
    verificationMessage.value = 'Error verifying document: ' + error.message;
  }
};

</script>

<style>
/* Google Docs-like editor styling */
.editor-content {
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  color: #333;
}

.editor-content p {
  margin-bottom: 0.75rem;
}

.editor-content h1 {
  font-size: 1.8rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.editor-content h2 {
  font-size: 1.5rem;
  margin-top: 1.2rem;
  margin-bottom: 0.6rem;
  color: #1a1a1a;
}

.editor-content h3 {
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.editor-content ul,
.editor-content ol {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.editor-content blockquote {
  border-left: 3px solid #ddd;
  padding-left: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}

.editor-content hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
}

/* Toolbar button styling */
.editor-content .ProseMirror:focus {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>