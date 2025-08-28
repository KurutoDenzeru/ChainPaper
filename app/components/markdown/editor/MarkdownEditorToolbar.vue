<template>
  <EditorToolbar
    v-bind="$attrs"
    @set-heading="(l: number)=>$emit('set-heading',l)"
    @set-paragraph="$emit('set-paragraph')"
    @set-subtitle="$emit('set-subtitle')"
    @format-bold="$emit('format-bold')"
    @format-italic="$emit('format-italic')"
    @format-underline="$emit('format-underline')"
    @format-strikethrough="$emit('format-strikethrough')"
    @toggle-bullet-list="$emit('toggle-bullet-list')"
    @toggle-ordered-list="$emit('toggle-ordered-list')"
    @insert-link="$emit('insert-link')"
    @insert-image="$emit('insert-image')"
    @insert-table="$emit('insert-table')"
    @insert-code-block="$emit('insert-code-block')"
    @set-zoom="(z: number | 'fit')=>$emit('set-zoom',z)"
  />
</template>
<script setup lang="ts">
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
// thin wrapper kept separate so we can customize for markdown later
const emit = defineEmits([
  'set-heading','set-paragraph','set-subtitle','format-bold','format-italic','format-underline','format-strikethrough','toggle-bullet-list','toggle-ordered-list','insert-link','insert-image','insert-table','insert-code-block','set-zoom'
])
</script>
