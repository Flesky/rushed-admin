<script setup lang="ts">
import type { SignInWithPasswordCredentials } from '@supabase/supabase-js'
import { NForm } from 'naive-ui'
import { ref } from 'vue'
import { supabase, useAuth } from '@/composables/useSupabase'

const form = reactive<SignInWithPasswordCredentials>({ email: '', password: '' })
const formRef = ref<InstanceType<typeof NForm>>()
const rules = {
  email: {
    type: 'email',
    required: true,
    message: 'Please enter a valid email address.',
  },
}

const router = useRouter()
const { data, error, loading, run } = useAuth(form => supabase.auth.signInWithOtp(form))
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN')
    router.push('/products')
})

function handleSubmit() {
  formRef.value?.validate().then(() => {
    run(form)
  })
}
const errorMessages = {
  'AuthApiError: For security purposes, you can only request this once every 60 seconds': 'You can only request this once every 60 seconds. Please try again shortly.',
}
</script>

<template>
  <div class="-mt-12">
    <n-h1 class="text-center">
      Log in
    </n-h1>
    <n-card class="mx-auto max-w-sm">
      <NForm v-if="!data" ref="formRef" :model="form" :rules="rules">
        <n-space size="large" vertical>
          <n-collapse-transition>
            <n-alert v-if="error" :show-icon="false" type="error">
              {{ errorMessages[error] }}
            </n-alert>
          </n-collapse-transition>
          <n-form-item label="Email address" path="email">
            <n-input
              v-model:value="form.email"
              placeholder="you@email.com"
            />
          </n-form-item>
          <n-button block :loading="loading" type="primary" @click="handleSubmit">
            {{ 'Send magic link' }}
          </n-button>
        </n-space>
      </NForm>
      <n-space v-else align="center" size="large" vertical>
        <ion-send class="text-4xl text-green-600" />
        <n-p>
          We sent you a magic link. Please check your email.
        </n-p>
      </n-space>
    </n-card>
    <n-p class="!mt-6 text-center text-gray-500">
      Powered by RUSHED eCommerce System Technologies (REST)
    </n-p>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
