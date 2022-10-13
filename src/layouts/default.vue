<template>
  <n-layout has-sider class="h-full">
    <n-layout-sider collapse-mode="width" :collapsed-width="64" bordered show-trigger>
      <side-menu />
    </n-layout-sider>
    <n-layout>
      <n-layout-header class="fixed top-0 z-10 flex h-14 items-center justify-between p-4" bordered />
      <n-layout-content embedded class="h-full">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive>
              <Component :is="Component" class="p-4 pt-[72px]" />
            </keep-alive>
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style>
.slide-fade-enter-active, .slide-fade-leave-active {
  @apply transition
}

.slide-fade-enter-from, .slide-fade-leave-to {
  @apply opacity-0
}

.slide-fade-enter-from {
  @apply -translate-x-12
}

.slide-fade-leave-to {
  @apply translate-x-12
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
