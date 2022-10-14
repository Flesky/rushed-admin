import { createClient } from '@supabase/supabase-js'
import type { PostgrestResponse } from '@supabase/supabase-js'
import { reactive } from 'vue'
import type { Ref } from 'vue'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY)

interface FromOptions<T> {
  manual?: boolean
  onSuccess?: (data: T[], count: number) => any
  onError?: (error: unknown) => any
}

interface From<T> {
  data: Ref<T[]> | undefined
  error: unknown | undefined
  count: number | undefined
  loading: boolean
}

export function useFrom<T>(query: PromiseLike<PostgrestResponse<T>> | ((...args: any[]) => PromiseLike<PostgrestResponse<T>>), options?: FromOptions<T>) {
  const state = reactive<From<T>>({
    data: undefined,
    error: undefined,
    count: undefined,
    loading: false,
  })

  const { manual, onSuccess, onError } = options ?? {}

  async function run(...args: any[]) {
    state.loading = true
    const _query = typeof query === 'function' ? query(...args) : query
    try {
      const { data, error, count, status } = await _query

      if (error && status !== 406)
        throw error
      state.data = data!
      if (onSuccess)
        onSuccess(data!, count!)
      return data
    }
    catch (error: any) {
      state.error = error
      if (onError)
        onError(error)

      throw error
    }
    finally {
      state.loading = false
    }
  }

  if (!manual)
    run()

  return { ...toRefs(state), run }
}
