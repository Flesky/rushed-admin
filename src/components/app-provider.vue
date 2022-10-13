<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const config = {
  abstract: true,
  preflightStyleDisabled: true,
  // theme: darkTheme,
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
