<script setup lang="ts">
import type { Component } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import HomeOutline from '~icons/ion/home-outline'
import PeopleOutline from '~icons/ion/people-outline'
import BookmarkOutline from '~icons/ion/bookmark-outline'
import CubeOutline from '~icons/ion/cube-outline'
import LayersOutline from '~icons/ion/layers-outline'
import ReceiptOutline from '~icons/ion/receipt-outline'
import InformationCircleOutline from '~icons/ion/information-circle-outline'

const emit = defineEmits(['closeMenu'])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const options = [
  {
    label: 'Home',
    key: '',
    icon: renderIcon(HomeOutline),
  },
  {
    label: 'Accounts',
    key: 'accounts',
    icon: renderIcon(PeopleOutline),
  },
  {
    label: 'Categories',
    key: 'categories',
    icon: renderIcon(BookmarkOutline),
  },
  {
    label: 'Products',
    key: 'products',
    icon: renderIcon(CubeOutline),
  },
  {
    label: 'Inventory',
    key: 'inventory',
    icon: renderIcon(LayersOutline),
  },
  {
    label: 'Orders',
    key: 'orders',
    icon: renderIcon(ReceiptOutline),
  },
  {
    label: 'About',
    key: 'about',
    icon: renderIcon(InformationCircleOutline),
  },
]

const route = useRoute()
const router = useRouter()
const selectedKey = ref(route.name)

const onClick = (key: string) => {
  emit('closeMenu')
  router.push(`/${key}`)
}
</script>

<template>
  <n-menu v-model:value="selectedKey" :default-value="route.name" :collapsed-width="64" :collapsed-icon-size="22" :options="options" @update:value="onClick" />
</template>
