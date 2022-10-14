<script setup lang="ts">
import { NButton, NForm, NPopconfirm, NSpace } from 'naive-ui'
import { h, ref } from 'vue'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { useFuse } from '@vueuse/integrations/useFuse'

type Row = Record<string, unknown>

const props = defineProps<{
  loading: boolean
  columns: DataTableColumns
  data?: Row[] // Hacking undefined because union causes type mismatch
  form?: Row
  rules?: FormRules
  title?: string
  onGet: () => Promise<unknown>
  onPost?: () => Promise<unknown>
  onDelete?: (id: number) => Promise<unknown>
}>()
const emit = defineEmits(['update:form'])

const message = useMessage()

const formRef = ref<InstanceType<typeof NForm>>()
const mode = ref<string>()
const modal = ref<boolean>(false)
const showModal = (record?: Record<string, unknown>) => {
  mode.value = !record ? 'Add' : 'Edit'
  emit('update:form', { ...record })
  modal.value = true
}

const columns: DataTableColumns = props.columns
if (props.onPost || props.onDelete) {
  columns.push({
    title: 'Actions',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        () => [props.onPost
          ? h(NButton, {
            type: 'primary',
            secondary: true,
            onClick: () => showModal(row),
          }, () => 'Edit')
          : undefined,
        props.onDelete
          ? h(NPopconfirm, {
            positiveButtonProps: { type: 'error' },
            onPositiveClick: () => handleDelete(row.id as number),
          }, { default: () => 'Are you sure?', trigger: () => h(NButton, { type: 'error', secondary: true }, () => 'Delete') })
          : undefined],
      )
    },
  })
}
const search = ref<string>('')
const filteredData = computed(() => {
  if (search.value && props.data)
    return props.data.filter(item => JSON.stringify(Object.values(item)).toLowerCase().includes(search.value.toString().toLowerCase()))
  else return props.data
},
)

const postLoading = ref<boolean>(false)
function handlePost() {
  postLoading.value = true
  formRef.value!.validate().then(() => {
    props.onPost!().then(() => {
      modal.value = false
      postLoading.value = false
      message.success(`${props.title} saved`)
      props.onGet()
    }).catch((error) => {
      if (error.message === 'FetchError: Failed to fetch')
        message.error('Network error.')
    })
  }).catch(() => message.warning('Please check the form for errors')).finally(() => {
    postLoading.value = false
  })
}

function handleDelete(id: number) {
  props.onDelete!(id).then(() => {
    message.success(`${props.title} deleted`)
    props.onGet()
  }).catch((error) => {
    if (error.message === 'FetchError: Failed to fetch')
      message.error('Network error.')
  })
}
</script>

<template>
  <n-card>
    <NSpace size="large" vertical>
      <NSpace justify="space-between">
        <n-input v-model:value="search" placeholder="Type to search">
          <template #suffix>
            <ion-search-outline />
          </template>
        </n-input>
        <NSpace justify="end" size="small">
          <NButton @click="onGet">
            <template #icon>
              <ion-refresh />
            </template>
            Refresh
          </NButton>
          <NButton v-if="onPost" type="primary" @click="showModal()">
            <template #icon>
              <ion-plus />
            </template>
            New
          </NButton>
        </NSpace>
      </NSpace>
      <n-data-table v-bind="{ columns, data: filteredData, loading }" />
    </NSpace>

    <n-modal
      v-model:show="modal"
      class="max-w-lg"
      :header-style="{ 'text-align': 'center', 'text-transform': 'lowercase' }"
      preset="card"
      segmented
      size="small"
      :title="`${mode} ${title}`"
    >
      <NForm
        ref="formRef"
        label-placement="left" label-width="auto" :model="form" require-mark-placement="right-hanging" :rules="rules"
      >
        <slot name="form" />
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="modal = false">
            Cancel
          </NButton>
          <NButton :loading="postLoading" type="primary" @click="handlePost">
            Save
          </NButton>
        </NSpace>
      </template>
    </n-modal>
  </n-card>
</template>
