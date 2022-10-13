<script setup lang="ts">
import { ref } from 'vue'
import { supabase, useFrom } from '@/composables/useSupabase'

const form = ref<Record<string, unknown>>({})
const message = useMessage()

const { data: getData, run: getRun } = useFrom(supabase.from('product_category').select('*').order('id', { ascending: false }))

const { run: postRun } = useFrom(form => supabase.from('product_category').upsert(form), {
  manual: true,
  onSuccess: () => {
    getRun()
    message.success('Product category saved')
  },
})

const { run: deleteRun } = useFrom(id => supabase.from('product_category').delete().match({ id }), {
  manual: true,
  onSuccess: () => {
    getRun()
    message.success('Product category deleted')
  },
})

const columns = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Description',
    key: 'description',
  }]

const rules = {
  name: {
    required: true,
    message: 'Name is required',
    trigger: ['input', 'blur'],
  },
}
</script>

<template>
  <div>
    <crud-view v-model:form="form" :data="getData" :columns="columns" modal-title="category" :on-save="() => postRun(form)" :on-delete="(id) => deleteRun(id)" :rules="rules">
      <template #form>
        <n-form-item label="Name" path="name" required>
          <n-input v-model:value="form.name" label="Name" placeholder="" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input v-model:value="form.description" type="textarea" label="Name" placeholder="" />
        </n-form-item>
      </template>
    </crud-view>
  </div>
</template>
