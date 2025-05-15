<template>
  <div @click="handleOutsideClick">
    <!-- Google Docs-like top menubar -->
    <div class="bg-white border-gray-200">
      <!-- Main menubar -->
      <div class="flex items-center px-2 py-1 border-b border-gray-200">
        <div class="flex items-center">
          <h2 class="text-lg font-medium text-gray-800 mr-4">ChainPaper</h2>
          <div class="flex space-x-1">
            <div class="relative">
              <button 
                class="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 menu-trigger" 
                @click.stop="activeMenu === 'file' ? activeMenu = null : activeMenu = 'file'"
              >File</button>
              <div 
                v-show="activeMenu === 'file'" 
                class="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10 menu-dropdown"
                @click.stop
              >
                <button @click="saveDocument; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Save class="w-4 h-4 mr-2" />
                  Save
                </button>
                <button @click="exportDocument; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Download class="w-4 h-4 mr-2" />
                  Export
                </button>
                <button @click="importDocument; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Upload class="w-4 h-4 mr-2" />
                  Import
                </button>
              </div>
            </div>
            <div class="relative">
              <button 
                class="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 menu-trigger"
                @click.stop="activeMenu === 'edit' ? activeMenu = null : activeMenu = 'edit'"
              >Edit</button>
              <div 
                v-show="activeMenu === 'edit'" 
                class="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10 menu-dropdown"
                @click.stop
              >
                <button @click="editor?.chain().focus().undo().run(); activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Undo class="w-4 h-4 mr-2" />
                  Undo
                </button>
                <button @click="editor?.chain().focus().redo().run(); activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Redo class="w-4 h-4 mr-2" />
                  Redo
                </button>
              </div>
            </div>
            <div class="relative">
              <button 
                class="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 menu-trigger"
                @click.stop="activeMenu === 'view' ? activeMenu = null : activeMenu = 'view'"
              >View</button>
              <div 
                v-show="activeMenu === 'view'" 
                class="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10 menu-dropdown"
                @click.stop
              >
                <button @click="editor?.chain().focus().setTextSelection(editor.state.selection.from).run(); activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Info class="w-4 h-4 mr-2" />
                  Document Information
                </button>
                <button @click="showDocumentHistory = !showDocumentHistory; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <History class="w-4 h-4 mr-2" />
                  {{ showDocumentHistory ? 'Hide' : 'Show' }} Document History
                </button>
                <button @click="showVerification = !showVerification; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Shield class="w-4 h-4 mr-2" />
                  {{ showVerification ? 'Hide' : 'Show' }} Verification
                </button>
              </div>
            </div>
            <div class="relative">
              <button 
                class="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 menu-trigger"
                @click.stop="activeMenu === 'help' ? activeMenu = null : activeMenu = 'help'"
              >Help</button>
              <div 
                v-show="activeMenu === 'help'" 
                class="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10 menu-dropdown"
                @click.stop
              >
                <button @click="showUserGuideModal = true; activeMenu = null" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <HelpCircle class="w-4 h-4 mr-2" />
                  How to use ChainPaper
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="ml-auto flex items-center space-x-2">
          <input 
            type="file" 
            ref="fileInput" 
            accept=".json" 
            class="hidden" 
            @change="handleFileUpload"
          />
        </div>
      </div>
      
      <!-- Formatting toolbar (Google Docs style) -->
      <div v-if="editor" class="flex items-center px-4 py-1 flex-wrap gap-2 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center space-x-1 mr-2">
          <select 
            class="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            @change="e => editor.chain().focus().setFontFamily(e.target.value).run()"
            :value="editor.getAttributes('textStyle').fontFamily"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div class="flex items-center space-x-1 mr-2">
          <select 
            class="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            @change="e => editor.chain().focus().setFontSize(e.target.value + 'px').run()"
            :value="editor.getAttributes('textStyle').fontSize?.replace('px', '') || '14'"
          >
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="18">18</option>
            <option value="24">24</option>
            <option value="36">36</option>
          </select>
        </div>
        <span class="border-r border-gray-300 h-6 mx-2"></span>
        <button 
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200': editor.isActive('bold') }"
          class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
          title="Bold"
        >
          <Bold class="w-4 h-4 text-gray-700" />
        </button>
        <button 
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
          class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
          title="Italic"
        >
          <Italic class="w-4 h-4 text-gray-700" />
        </button>
        <button 
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-gray-200': editor.isActive('strike') }"
          class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
          title="Strikethrough"
        >
          <Strikethrough class="w-4 h-4 text-gray-700" />
        </button>
        <button 
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-gray-200': editor.isActive('underline') }"
          class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
          title="Underline"
        >
          <UnderlineIcon class="w-4 h-4 text-gray-700" />
        </button>
        <span class="border-r border-gray-300 h-6 mx-2"></span>
        <div class="flex items-center space-x-1">
          <button 
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'bg-gray-200': editor.isActive('heading', { level: 1 }) }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Heading 1"
          >
            <Heading1 class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Heading 2"
          >
            <Heading2 class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Heading 3"
          >
            <Heading3 class="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <span class="border-r border-gray-300 h-6 mx-2"></span>
        <div class="flex items-center space-x-1">
          <button 
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Bullet List"
          >
            <List class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Ordered List"
          >
            <ListOrdered class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().sinkListItem('listItem').run()"
            :disabled="!editor.can().sinkListItem('listItem')"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            title="Indent List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-700">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button 
            @click="editor.chain().focus().liftListItem('listItem').run()"
            :disabled="!editor.can().liftListItem('listItem')"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            title="Outdent List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-700">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
        <span class="border-r border-gray-300 h-6 mx-2"></span>
        <div class="flex items-center space-x-1">
          <button 
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Blockquote"
          >
            <Quote class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().setHorizontalRule().run()"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Horizontal Rule"
          >
            <Minus class="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <span class="border-r border-gray-300 h-6 mx-2"></span>
        <div class="flex items-center space-x-1">
          <button 
            @click="editor.chain().focus().undo().run()"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Undo"
          >
            <Undo class="w-4 h-4 text-gray-700" />
          </button>
          <button 
            @click="editor.chain().focus().redo().run()"
            class="p-1 rounded-sm hover:bg-gray-200 focus:outline-none"
            title="Redo"
          >
            <Redo class="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
      
      <!-- Main document editor area (Google Docs style) -->
      <div class="border-0 min-h-[calc(100vh-120px)] bg-gray-100 py-8 px-4">
        <!-- TipTap Editor will be mounted here -->
        <div v-if="editor" class="prose max-w-none editor-content rounded-lg">
          <editor-content :editor="editor" />
        </div>
        <div v-else class="flex justify-center items-center h-64 bg-white max-w-8.5in mx-auto shadow">
          <p class="text-gray-500">Loading editor...</p>
        </div>
      </div>
    </div>
    
    <!-- Document Verification Panel (toggleable) -->
    <div v-if="showVerification" class="bg-white shadow rounded-lg p-6 mt-4 border border-gray-200">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-md font-medium text-gray-700">Document Verification</h3>
        <button @click="showVerification = false" class="text-gray-500 hover:text-gray-700">
          <X class="w-4 h-4" />
        </button>
      </div>
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
    
    <!-- Document History Component (toggleable) -->
    <DocumentHistory v-if="showDocumentHistory" />
    
    <!-- User Guide Modal -->
    <ModalComponent
      v-model:isOpen="showUserGuideModal"
      title="How to Use ChainPaper"
      :showFooter="false"
    >
      <UserGuide />
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import DocumentHistory from './DocumentHistory.vue';
import documentStorage from '../utils/documentStorage.ts';
import ModalComponent from './ModalComponent.vue';
import UserGuide from './UserGuide.vue';
import { 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Save, Download, Upload, X, HelpCircle, History, Shield, Info
} from 'lucide-vue-next';

// Get toast service
const toast = inject('toast');

// Document state
const editor = ref(null);
const currentHash = ref('');
const lastEdited = ref('');
const contributors = ref([]);
const username = ref('Anonymous User-' + Math.floor(Math.random() * 1000));
const fileInput = ref(null);
const verificationStatus = ref(null);
const verificationMessage = ref('');

// UI state
const showDocumentHistory = ref(false);
const showVerification = ref(false);
const showUserGuideModal = ref(false);
const activeMenu = ref(null); // Track which menu is currently open

// Yjs document setup
const ydoc = new Y.Doc();
const provider = ref(null);
const persistence = ref(null);

// Handle clicks outside of menus to close them
const handleOutsideClick = (event) => {
  // If we have an active menu and the click target is not inside a menu button or dropdown
  if (activeMenu.value && !event.target.closest('.menu-trigger') && !event.target.closest('.menu-dropdown')) {
    activeMenu.value = null;
  }
};

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
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
        blockquote: true,
        horizontalRule: true,
        strike: true,
        bold: true,
        italic: true,
        history: true,
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
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
  editor.value.registerCommand('Mod-u', () => editor.value.chain().focus().toggleUnderline().run());
  editor.value.registerCommand('Mod-Shift-7', () => editor.value.chain().focus().toggleOrderedList().run());
  editor.value.registerCommand('Mod-Shift-8', () => editor.value.chain().focus().toggleBulletList().run());
  
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
    toast.success('Document saved successfully!');
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error('Failed to save document.');
  }
};

// Export document as JSON with Merkle proof
const exportDocument = () => {
  if (!editor.value) return;
  
  // Get document with proof from storage
  const exportData = documentStorage.exportWithProof();
  
  if (!exportData) {
    toast.error('No document to export. Please save the document first.');
    return;
  }
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `chainpaper-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  toast.success('Document exported successfully!');
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
      toast.error('Invalid document format. Please upload a valid ChainPaper export file.');
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
        toast.success('Document imported successfully!');
      } else {
        toast.error('There was an issue importing the document. Some data may not have been imported correctly.');
      }
    }
  } catch (error) {
    console.error('Error importing document:', error);
    toast.error('Failed to import document. Please check the file format.');
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
    toast.error('No document hash available. Please save the document first.');
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
      toast.error('Document has been modified since last save.');
      return;
    }
    
    // Use the documentStorage verifyAuthorship method
    const verificationResult = documentStorage.verifyAuthorship(currentHash.value);
    
    if (verificationResult.verified) {
      verificationStatus.value = 'verified';
      verificationMessage.value = `${verificationResult.message} Author: ${verificationResult.author}`;
      toast.success(`${verificationResult.message} Author: ${verificationResult.author}`);
    } else {
      verificationStatus.value = 'failed';
      verificationMessage.value = verificationResult.message;
      toast.error(verificationResult.message);
    }
  } catch (error) {
    console.error('Error verifying document:', error);
    verificationStatus.value = 'failed';
    verificationMessage.value = 'Error verifying document: ' + error.message;
    toast.error('Error verifying document: ' + error.message);
  }
};

</script>