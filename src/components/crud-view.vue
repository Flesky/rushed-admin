<script setup lang="ts">
import { NButton, NForm, NPopconfirm, NSpace } from 'naive-ui'
import { h, ref } from 'vue'
import type { DataTableColumns, FormRules } from 'naive-ui'

type Row = Record<string, unknown>

const props = defineProps<{
  loading: boolean
  columns: DataTableColumns
  data?: Row[] // Hacking undefined because union causes type mismatch
  form?: Row
  rules?: FormRules
  title?: string
  onRefresh: () => Promise<unknown>
  onSave?: () => Promise<unknown>
  onDelete?: (id: number) => Promise<unknown>
}>()
const emit = defineEmits(['update:form', 'reset'])

const message = useMessage()

const formRef = ref<InstanceType<typeof NForm>>()
const modal = ref<boolean>(false)
const showModal = (record?: Record<string, unknown>) => {
  emit('update:form', { ...record })
  emit('reset')
  modal.value = true
}

const columns: DataTableColumns = props.columns
if (props.onSave || props.onDelete) {
  columns.push({
    title: 'Actions',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        () => [props.onSave
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

const saveLoading = ref<boolean>(false)
function handleSave() {
  saveLoading.value = true
  formRef.value!.validate().then(() => {
    props.onSave!().then(() => {
      modal.value = false
      saveLoading.value = false
      message.success(`${props.title} saved`)
      props.onRefresh()
    }).catch((error) => {
      if (error.message === 'FetchError: Failed to fetch')
        return message.error('Network error')
      console.error(error)
    })
  }).catch(() => message.warning('Please check the form for errors')).finally(() => {
    saveLoading.value = false
  })
}

function handleDelete(id: number) {
  props.onDelete!(id).then(() => {
    message.success(`${props.title} deleted`)
    props.onRefresh()
  }).catch((error) => {
    if (error.message === 'FetchError: Failed to fetch')
      message.error('Network error')
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
          <NButton @click="onRefresh">
            <template #icon>
              <ion-refresh />
            </template>
            Refresh
          </NButton>
          <NButton v-if="onSave" type="primary" @click="showModal()">
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
      :header-style="{ 'text-align': 'center' }"
      :mask-closable="false"
      preset="card"
      segmented
      size="small"
      :title="title"
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
          <NButton :loading="saveLoading" type="primary" @click="handleSave">
            Save
          </NButton>
        </NSpace>
      </template>
    </n-modal>
  </n-card>
</template>
