<script setup lang="ts">
const form = reactive({})
</script>

<template>
  <n-form :model="form">
    <n-form-item path="email">
      <n-input
        v-model:value="form.email"
      />
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="form.password"
        type="password"
      />
    </n-form-item>
  </n-form>
</template>
