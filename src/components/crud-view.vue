<script setup lang="ts">
import { NButton, NForm, NPopconfirm, NSpace } from 'naive-ui'
import { h, ref } from 'vue'
import type { DataTableColumns, FormRules } from 'naive-ui'

type Row = Record<string, unknown>

const props = defineProps<{
  form?: Row // Not supplying form disables New and Edit functionality
  data?: Row[] // Hacking undefined because union causes type mismatch
  rules?: FormRules
  columns: DataTableColumns
  modalTitle?: string
  onSave?: () => Promise<unknown>
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
if (props.form) {
  columns.push({
    title: 'Actions',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        () => [props.onSave
          ? h(NButton, {
            type: 'primary',
            onClick: () => showModal(row),
          }, () => 'Edit')
          : undefined,
        props.onDelete
          ? h(NPopconfirm, {
            positiveButtonProps: { type: 'error' },
            onPositiveClick: () => props.onDelete!(row.id as number),
          }, { default: () => 'Are you sure?', trigger: () => h(NButton, { type: 'error' }, () => 'Delete') })
          : undefined],

        // props.onDelete
        //   ? h(NButton, {
        //     type: 'error',
        //     onClick: () => props.onDelete!(row.id as number),
        //   }, () => 'Delete')
        //   : undefined],
      )
    },
  })
}

const saveLoading = ref<boolean>(false)
function handleSave() {
  saveLoading.value = true
  formRef.value!.validate().then(() => {
    props.onSave!().then(() => {
      modal.value = false
      saveLoading.value = false
    })
  }).catch(() => message.warning('Please check the form for errors')).finally(() => {
    saveLoading.value = false
  })
}
</script>

<template>
  <n-card>
    <NSpace vertical>
      <NButton v-if="form" type="primary" @click="showModal()">
        <template #icon>
          <ion-plus />
        </template>
        New
      </NButton>
      <n-data-table :columns="columns" :data="data" />
    </NSpace>

    <n-modal
      v-model:show="modal"
      preset="card"
      class="max-w-lg"
      segmented
      size="small"
      :title="`${mode} ${modalTitle}`"
      :header-style="{ 'text-align': 'center' }"
    >
      <NForm
        ref="formRef"
        :model="form" label-placement="left" label-width="auto" :rules="rules" require-mark-placement="right-hanging"
      >
        <slot name="form" />
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="modal = false">
            Cancel
          </NButton>
          <NButton type="primary" :loading="saveLoading" @click="handleSave">
            Save
          </NButton>
        </NSpace>
      </template>
    </n-modal>
  </n-card>
</template>
