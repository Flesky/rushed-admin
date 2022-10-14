<script setup lang="ts">
import { ref } from 'vue'
import { supabase, useFrom } from '@/composables/useSupabase'

const form = ref<Record<string, unknown>>({})

const { data: getData, loading: getLoading, run: getRun } = useFrom(supabase.from('product_category').select('*').order('id', { ascending: false }))

const { run: postRun } = useFrom(form => supabase.from('product_category').upsert(form), {
  manual: true,
})

const { run: deleteRun } = useFrom(id => supabase.from('product_category').delete().match({ id }), {
  manual: true,
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
    <crud-view v-model:form="form" v-bind="{ columns, data: getData, loading: getLoading, rules }" :on-delete="(id) => deleteRun(id)" :on-get="() => getRun()" :on-post="() => postRun(form)" title="Category">
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
