<script setup lang="ts">
const route = useRoute()
const collapsed = useStorage('collapsed', false)

const message = useMessage()
const { isOnline } = useNetwork()
watch(isOnline, (online) => {
  if (online)
    message.success('Reconnected')
  else
    message.error('Disconnected')
})
</script>

<template>
  <n-layout class="h-full" has-sider>
    <n-layout-sider v-model:collapsed="collapsed" bordered collapse-mode="width" :collapsed-width="64" show-trigger>
      <side-menu />
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered class="fixed top-0 z-10 flex h-14 items-center p-4 capitalize">
        <div class="font-bold">
          {{ route.name }}
        </div>
      </n-layout-header>
      <n-layout-content class="h-full" embedded>
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition"
            enter-from-class="opacity-0 -translate-x-12"
            leave-active-class="transition"
            leave-to-class="opacity-0 translate-x-12"
            mode="out-in"
          >
            <keep-alive>
              <Component :is="Component" class="p-4 pt-[72px]" />
            </keep-alive>
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
