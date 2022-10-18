<script setup lang="ts">
const config = {
  abstract: true,
  preflightStyleDisabled: true,
}
</script>

<template>
  <n-config-provider v-bind="config">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <slot />
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
