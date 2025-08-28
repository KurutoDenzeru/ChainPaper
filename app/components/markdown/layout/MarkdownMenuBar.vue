<template>
  <MenuBar
    :documentTitle="title"
    :isDirty="isDirty"
    :user="user"
    @update-title="updateTitle"
    @save-document="save"
    @new-document="newDoc"
    @open-document="$emit('open-document')"
    @insert-link="$emit('insert-link')"
    @insert-image="$emit('insert-image')"
    @insert-table="$emit('insert-table')"
    @insert-code-block="$emit('insert-code-block')"
    @format-bold="$emit('format-bold')"
    @format-italic="$emit('format-italic')"
    @format-underline="$emit('format-underline')"
    @toggle-bullet-list="$emit('toggle-bullet-list')"
    @toggle-ordered-list="$emit('toggle-ordered-list')"
    @verify-authorship="$emit('verify-authorship')"
    @word-count="$emit('word-count')"
  />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import MenuBar from '@/components/layout/MenuBar.vue'
import { useMarkdownDocStore } from '@/stores/markdownDoc'

const emit = defineEmits([
  'open-document','insert-link','insert-image','insert-table','insert-code-block','format-bold','format-italic','format-underline','toggle-bullet-list','toggle-ordered-list','verify-authorship','word-count'
])

const store = useMarkdownDocStore()
const { title, isDirty, user } = storeToRefs(store)

function updateTitle(t: string){ store.setTitle(t) }
function save(){ store.markSaved() }
function newDoc(){ store.reset() }
</script>
