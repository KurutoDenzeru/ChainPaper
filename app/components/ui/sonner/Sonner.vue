<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import type { ToasterProps } from 'vue-sonner'
  import { Toaster as Sonner } from 'vue-sonner'

  const props = defineProps<ToasterProps>()

  // Reactive theme state so Toaster updates when user changes theme or system preference
  const themeRef = ref<'light' | 'dark'>('light')

  const computeTheme = (): 'light' | 'dark' => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('chainpaper_theme') : null
      if (stored === 'light' || stored === 'dark') return stored as 'light' | 'dark'
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
    } catch (e) {
      // ignore
    }
    return 'light'
  }

  // update handlers
  let mm: MediaQueryList | null = null
  const onMediaChange = (ev: MediaQueryListEvent) => {
    try {
      const stored = localStorage.getItem('chainpaper_theme')
      if (!stored || stored === 'system') {
        themeRef.value = ev.matches ? 'dark' : 'light'
      }
    } catch (e) { /* ignore */ }
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key === 'chainpaper_theme') {
      themeRef.value = computeTheme()
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    themeRef.value = computeTheme()
    if (window.matchMedia) {
      mm = window.matchMedia('(prefers-color-scheme: dark)')
      if (typeof mm.addEventListener === 'function') mm.addEventListener('change', onMediaChange)
      else mm.addListener(onMediaChange as any)
    }
    window.addEventListener('storage', onStorage)
  })

  onUnmounted(() => {
    if (mm) {
      if (typeof mm.removeEventListener === 'function') mm.removeEventListener('change', onMediaChange)
      else mm.removeListener(onMediaChange as any)
    }
    window.removeEventListener('storage', onStorage)
  })

  const computedTheme = computed(() => themeRef.value)
</script>

<template>
  <Sonner class="toaster group" v-bind="props" :theme="computedTheme" :style="{
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
    /* custom variable used to override Sonner's built-in description color */
    '--sn-description': 'var(--popover-foreground)'
  }" />
</template>

<style>

  /* Ensure toast description text uses our app color variables and updates with theme changes */
  .toaster [data-description] {
    color: var(--sn-description) !important;
  }
</style>
