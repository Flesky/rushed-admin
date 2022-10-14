<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { supabase, useFrom } from '@/composables/useSupabase'

const form = ref<Record<string, unknown>>({})
const fileList = ref<Array<UploadFileInfo>>([])
const message = useMessage()

const { data: getData, loading: getLoading, run: getRun } = useFrom(supabase.from('product').select('*').order('id', { ascending: false }))

const categoryOptions = ref<Record<string, unknown>[]>([])
const { run: categoryRun } = useFrom(supabase.from('product_category').select('id, name').order('name', { ascending: false }), {
  onSuccess: (data) => { categoryOptions.value = data.map(item => ({ label: item.name, value: item.id })) },
})
onActivated(() => { categoryRun() })

const { run: postRun } = useFrom(form => supabase.from('product').upsert(form), {
  manual: true,
})

const { run: deleteRun } = useFrom(id => supabase.from('product').delete().match({ id }), {
  manual: true,
})

const columns = [
  {
    title: 'Name',
    key: 'name',
  },
]

const tagOptions = [
  { label: 'Hot', value: 'hot' },
  { label: 'Limited', value: 'limited' },
  { label: 'New', value: 'new' },
]

const beforeUpload = async (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  if (!['.jpg', '.jpeg', 'image/png'].includes(data.file.file!.type)) {
    message.warning('Only JPG and PNG files are allowed')
    return false
  } return true
}
</script>

<template>
  <div>
    <crud-view v-model:form="form" v-bind="{ columns, data: getData, loading: getLoading }" :on-delete="(id) => deleteRun(id)" :on-get="() => getRun()" :on-post="() => postRun(form)" title="Product">
      <template #form>
        <n-form-item label="Name" path="name" required>
          <n-input v-model:value="form.name" placeholder="Enter product name" />
        </n-form-item>
        <n-form-item label="SKU" path="sku" required>
          <n-input v-model:value="form.sku" placeholder="Enter product SKU" />
        </n-form-item>
        <n-form-item label="Price" path="price" required :span="12">
          <n-input-number v-model:value="form.price" label="Price" :min="0" placeholder="0.00" :precision="2" :show-button="false">
            <template #prefix>
              ₱
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Category" path="category_id">
          <n-select v-model:value="form.category_id" clearable :options="categoryOptions" placeholder="Select product category" status="asd" />
        </n-form-item>
        <n-form-item label="Tag" path="tag">
          <n-select v-model:value="form.tag" clearable :options="tagOptions" placeholder="Select product tag" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input v-model:value="form.description" label="Name" placeholder="Enter product description" type="textarea" />
        </n-form-item>
        <n-form-item label="Image" path="image">
          <n-upload accept=".jpg, .jpeg, image/png" list-type="image-card" :max="1" :on-before-upload="beforeUpload">
            <n-button>Upload</n-button>
          </n-upload>
        </n-form-item>
      </template>
    </crud-view>
  </div>
</template>
