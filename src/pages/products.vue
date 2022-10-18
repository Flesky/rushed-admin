<script setup lang="ts">
import type { DataTableColumns, UploadFileInfo, UploadInst } from 'naive-ui'
import { supabase, useFrom, useStorage } from '@/composables/useSupabase'
import SupabaseImage from '@/components/supabase-image.vue'

const form = ref<Record<string, unknown>>({})
const upload = ref<UploadInst | null>(null)
const fileList = ref<UploadFileInfo[]>([])
const message = useMessage()

function getFileExtension(fileName: string): string {
  return fileName.split('.').slice(-1).pop()!
}

const { data, loading, run: refresh } = useFrom(supabase.from('product').select('*').order('id', { ascending: false }))

const categoryOptions = ref<Array<{ label: string; value: string }>>([])
const { run: categoryRun } = useFrom(supabase.from('product_category').select('id, name').order('name', { ascending: false }), {
  onSuccess: (data) => { categoryOptions.value = data.map(item => ({ label: item.name, value: item.id })) },
})
onActivated(() => { categoryRun() })

const { run: save } = useFrom(form => supabase.from('product').upsert(form), {
  manual: true,
})
const { run: removeFile } = useStorage(fileName =>
  supabase.storage.from('product').remove([`${fileName}`]),
{
  manual: true,
})
async function handleRemoveFile(form: Record<string, unknown>) {
  return Promise.all(
    [
      removeFile(form.image),
      save({
        ...form,
        image: null,
      }),
    ],
  ).then(() => {
    message.success('Image removed')
    refresh()
  })
}
const { run: uploadFile } = useStorage((fileName, file) =>
  supabase.storage.from('product').upload(`${fileName}`, file),
{
  manual: true,
})
async function handleSave(form: Record<string, unknown>) {
  const file = fileList.value[0]?.file
  if (file) {
    const uuid = crypto.randomUUID()
    const fileName = `${uuid}.${getFileExtension(file.name)}`
    removeFile(form.image).catch(e => console.error(e))
    return Promise.all(
      [
        uploadFile(fileName, file),
        save({
          ...form,
          image: fileName,
        }),
      ],
    )
  }
  else {
    return save(form)
  }
}

const { run: remove } = useFrom(id => supabase.from('product').delete().match({ id }), {
  manual: true,
})

const columns: DataTableColumns = [
  {
    title: 'Image',
    render(row: { image: string }) {
      return h(SupabaseImage, { from: 'product', path: row.image, width: 50 })
    },
    width: 74,
  },
  {
    title: 'SKU',
    key: 'sku',
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Price',
    key: 'price',
    render(row: { price: any }) {
      return `₱${row.price}`
    },
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
  if (['jpg', 'jpeg', 'png'].includes(getFileExtension(data.file.file!.name)))
    return true

  message.warning('Only JPG and PNG files are allowed')
  return false
}

const rules = {
  name: [
    {
      required: true,
      message: 'Name is required',
    },
  ],
  sku: [
    {
      required: true,
      message: 'SKU is required',
    },
  ],
  price: [
    {
      required: true,
      message: 'Price is required',
    },
  ],
}
</script>

<template>
  <div>
    <crud-view
      v-model:form="form" v-bind="{
        columns,
        rules,
        data,
        loading,
        onRefresh: () => refresh(),
        onSave: () => handleSave(form),
        onDelete: (id: number) => remove(id),
        title: 'Product',
      }"
      @reset="fileList = []"
    >
      <template #form>
        <n-form-item label="SKU" path="sku" required>
          <n-input v-model:value="form.sku" placeholder="Enter product SKU" />
        </n-form-item>
        <n-form-item label="Name" path="name" required>
          <n-input v-model:value="form.name" placeholder="Enter product name" />
        </n-form-item>
        <n-form-item label="Price" path="price" required :span="12">
          <n-input-number v-model:value="form.price" label="Price" :min="0" placeholder="0.00" :show-button="false">
            <template #prefix>
              ₱
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Category" path="category_id">
          <n-select v-model:value="form.category_id" clearable :options="categoryOptions" placeholder="Select product category" />
        </n-form-item>
        <n-form-item label="Tag" path="tag">
          <n-select v-model:value="form.tag" clearable :options="tagOptions" placeholder="Select product tag" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input v-model:value="form.description" label="Name" placeholder="Enter product description" type="textarea" />
        </n-form-item>
        <n-form-item label="Image" path="image">
          <n-space vertical>
            <n-upload ref="upload" v-model:file-list="fileList" accept=".jpg, .jpeg, .png" list-type="image-card" :max="1" :on-before-upload="beforeUpload">
              <n-button>Upload</n-button>
            </n-upload>
            <n-a v-if="form.image" @click="handleRemoveFile(form)">
              Remove image
            </n-a>
          </n-space>
        </n-form-item>
      </template>
    </crud-view>
  </div>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
