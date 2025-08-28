<template>
  <StickyFooter :wordCount="wordCount" :pageCount="1" :zoom="zoom" :fitMode="false" @set-zoom="z=>$emit('set-zoom',z)" @word-count="$emit('word-count')" />
</template>
<script setup lang="ts">
import StickyFooter from '@/components/layout/StickyFooter.vue'

const props = defineProps<{ wordCount: number; zoom: number }>()
const emit = defineEmits(['set-zoom','word-count'])
</script>
