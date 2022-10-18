<script setup lang="ts">
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import { supabase } from '@/composables/useSupabase'
import HomeOutline from '~icons/ion/home-outline'
import PeopleOutline from '~icons/ion/people-outline'
import PricetagsOutline from '~icons/ion/pricetags-outline'
import CubeOutline from '~icons/ion/cube-outline'
import LayersOutline from '~icons/ion/layers-outline'
import ReceiptOutline from '~icons/ion/receipt-outline'
import InformationCircleOutline from '~icons/ion/information-circle-outline'
import LogOutOutline from '~icons/ion/log-out-outline'

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
    icon: renderIcon(PricetagsOutline),
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
  {
    key: 'divider',
    type: 'divider',
  },
  {
    label: 'Log out',
    key: 'logout',
    icon: renderIcon(LogOutOutline),
  },
]

const route = useRoute()
const router = useRouter()
const selectedKey = ref(route.name)
const message = useMessage()

const onClick = (key: string) => {
  emit('closeMenu')
  if (key === 'logout') {
    supabase.auth.signOut().then(() => {
      message.success('You have been logged out')
      router.push('/login')
    })
  }
  else { router.push({ name: key }) }
}
</script>

<template>
  <n-menu v-model:value="selectedKey" :collapsed-icon-size="22" :collapsed-width="64" :default-value="route.name" :options="options" @update:value="onClick" />
</template>
