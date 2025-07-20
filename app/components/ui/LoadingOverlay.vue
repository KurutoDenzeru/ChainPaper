<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4">
      <div class="flex items-center space-x-4">
        <Loader2 class="h-8 w-8 animate-spin text-blue-600" />
        <div class="text-base font-medium text-gray-900">
          {{ message }}
        </div>
      </div>
      <div v-if="progress !== undefined" class="mt-4">
        <div class="bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="text-sm text-gray-600 mt-2 text-center font-medium">
          {{ Math.round(progress) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

interface Props {
  isVisible: boolean
  message?: string
  progress?: number
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  progress: undefined
})
</script>
