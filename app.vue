<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">ChainPaper</h1>
        <p class="text-sm text-gray-500">Trustless whitepaper collaboration tool with authorship proofs</p>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <EditorComponent />
      <UserGuide />
    </main>
  </div>
</template>

<script setup>
import EditorComponent from './components/EditorComponent.vue';
import UserGuide from './components/UserGuide.vue';
</script>
