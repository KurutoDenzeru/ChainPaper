<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">ChainPaper</h1>
        <p class="text-sm text-gray-500">Trustless whitepaper collaboration tool with authorship proofs</p>
      </div>
    </header> -->
    <main class="max-w-full mx-auto">
      <EditorComponent />
    </main>
    <!-- Toast Manager for notifications -->
    <ToastManager />
    <footer class="border-t border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div class="flex space-x-4">
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <Instagram />
          </a>
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <Linkedin />
          </a>
          <a href="#" class="text-gray-500 hover:text-gray-700">
            <Github />
          </a>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">© 2025 ChainPaper. All rights reserved.</p>
          <p class="text-xs text-gray-400">Trustless whitepaper collaboration tool</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import EditorComponent from './components/EditorComponent.vue';
import UserGuide from './components/UserGuide.vue';
import ToastManager from './components/ToastManager.vue';
import { Instagram, Github, Linkedin  } from 'lucide-vue-next';


useHead({
  title: 'ChainPaper',
  meta: [
    { name: 'description', content: 'Trustless whitepaper collaboration tool with authorship proofs' },
    { name: 'keywords', content: 'whitepaper, collaboration, authorship, proofs' },
    { name: 'author', content: 'ChainPaper' }
  ]
})
</script>
