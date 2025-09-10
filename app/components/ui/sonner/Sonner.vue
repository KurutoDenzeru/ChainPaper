<script lang="ts" setup>
  import { computed } from 'vue'
  import type { ToasterProps } from 'vue-sonner'
  import { Toaster as Sonner } from 'vue-sonner'

  const props = defineProps<ToasterProps>()

  // Compute theme at runtime in a safe way (avoids SSR window usage).
  const computedTheme = computed<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('chainpaper_theme')
      if (stored === 'light' || stored === 'dark') return stored
      // fallback to system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
    } catch (e) {
      // ignore and fallback
    }
    return 'light'
  })
</script>

<template>
  <Sonner class="toaster group" v-bind="props" :theme="computedTheme" :style="{
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)'
  }" />
</template>
