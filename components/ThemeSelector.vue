<template>
  <div class="flex items-center">
    <button 
      @click="toggleTheme('light')"
      class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="{ 'bg-blue-100 text-blue-600': colorMode.preference === 'light', 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': colorMode.preference !== 'light' }"
      aria-label="Light mode"
      tabindex="0"
      @keydown="(e) => e.key === 'Enter' && toggleTheme('light')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    </button>
    
    <button 
      @click="toggleTheme('dark')"
      class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="{ 'bg-gray-700 text-blue-400': colorMode.preference === 'dark', 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': colorMode.preference !== 'dark' }"
      aria-label="Dark mode"
      tabindex="0"
      @keydown="(e) => e.key === 'Enter' && toggleTheme('dark')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    </button>
    
    <button 
      @click="toggleTheme('system')"
      class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="{ 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200': colorMode.preference === 'system', 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': colorMode.preference !== 'system' }"
      aria-label="System theme"
      tabindex="0"
      @keydown="(e) => e.key === 'Enter' && toggleTheme('system')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { currentTheme, applyTheme } = useTheme();

const toggleTheme = (theme) => {
  applyTheme(theme);
};
</script>

<style>
/* Add smooth transitions when switching between themes */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>