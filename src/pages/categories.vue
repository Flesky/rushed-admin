<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { ref } from 'vue'
import { supabase, useFrom } from '@/composables/useSupabase'

const form = ref<Record<string, unknown>>({})

const { data, loading, run: refresh } = useFrom(supabase.from('product_category').select('*').order('id', { ascending: false }))

const { run: save } = useFrom(form => supabase.from('product_category').upsert(form), {
  manual: true,
})

const { run: remove } = useFrom(id => supabase.from('product_category').delete().match({ id }), {
  manual: true,
})

const columns: DataTableColumns = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Description',
    key: 'description',
  },
]

const rules = {
  name: {
    required: true,
    message: 'Name is required',
    // trigger: ['input', 'blur'],
  },
}
</script>

<template>
  <div>
    <crud-view v-model:form="form" v-bind="{ columns, data, loading, rules }" :on-delete="(id) => remove(id)" :on-refresh="() => refresh()" :on-save="() => save(form)" title="Category">
      <template #form>
        <n-form-item label="Name" path="name" required>
          <n-input v-model:value="form.name" label="Name" placeholder="Enter category name" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input v-model:value="form.description" label="Name" placeholder="Enter category description" type="textarea" />
        </n-form-item>
      </template>
    </crud-view>
  </div>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
