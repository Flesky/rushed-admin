<script setup lang="ts">
import { supabase, useStorage } from '@/composables/useSupabase'

const props = defineProps<{
  from: string
  width: string | number
  height?: string | number
  path?: string
}>()

const src = ref<string>('')
if (props.path) {
  useStorage(supabase.storage.from(props.from).download(props.path), {
    onSuccess: data => src.value = URL.createObjectURL(data as Blob),
  })
}
</script>

<template>
  <div :style="{ height: `${height ? height : typeof width === 'number' ? `${width}px` : width}` }">
    <n-image v-bind="{ src, width }" />
  </div>
</template>
