import type { Session, User } from '@supabase/gotrue-js/src/lib/types'
import type { StorageError } from '@supabase/storage-js/dist/module/lib/errors'
import type { FileObject } from '@supabase/storage-js/dist/module/lib/types'
import { createClient } from '@supabase/supabase-js'
import type { AuthResponse, PostgrestResponse } from '@supabase/supabase-js'
import { reactive } from 'vue'
import type { Ref } from 'vue'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY)

interface FromOptions<T> {
  manual?: boolean
  onBefore?: (...args: any[]) => any
  onSuccess?: (data: T[], count?: number) => any
  onError?: (error: unknown) => any
}

interface StorageOptions {
  manual?: boolean
  onBefore?: (...args: any[]) => any
  onSuccess?: (data: { path: string } | Blob | FileObject[]) => any
  onError?: (error: unknown) => any
}

export function useAuth(query: Promise<AuthResponse> | ((...args: any[]) => Promise<AuthResponse>)) {
  const state = reactive<{
    data: { user: User | null; session: Session | null } | undefined
    error: unknown | undefined
    loading: boolean
  }>({
    data: undefined,
    error: undefined,
    loading: false,
  })

  async function run(...args: any[]) {
    state.loading = true
    const _query = typeof query === 'function' ? query(...args) : query
    try {
      const { data, error } = await _query

      if (error)
        throw (error)
      state.data = data
      return data
    }
    catch (error: any) {
      state.error = error
      throw error
    }
    finally {
      state.loading = false
    }
  }

  return { ...toRefs(state), run }
}

export function useFrom<T>(query: PromiseLike<PostgrestResponse<T>> | ((...args: any[]) => PromiseLike<PostgrestResponse<T>>), options?: FromOptions<T>) {
  const state = reactive<{
    data: Ref<T[]> | undefined
    error: unknown | undefined
    count: number | undefined
    loading: boolean }>({
      data: undefined,
      error: undefined,
      count: undefined,
      loading: false,
    })

  const { manual, onBefore, onSuccess, onError } = options ?? {}

  async function run(...args: any[]) {
    state.loading = true
    const _query = typeof query === 'function' ? query(...args) : query
    if (onBefore)
      onBefore()

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

type StorageType = Promise<{ data: { path: string } | Blob | FileObject[] ; error: null } | { data: null; error: StorageError }>

export function useStorage(query: StorageType | ((...args: any[]) => StorageType), options?: StorageOptions) {
  const state = reactive<{
    data: { path: string } | Blob | FileObject[] | undefined
    error: unknown | undefined
    loading: boolean
  }>({
    data: undefined,
    error: undefined,
    loading: false,
  })

  const { manual, onBefore, onSuccess, onError } = options ?? {}

  async function run(...args: any[]) {
    state.loading = true
    const _query = typeof query === 'function' ? query(...args) : query
    if (onBefore)
      onBefore()

    try {
      const { data, error } = await _query

      if (error)
        throw error
      state.data = data!
      if (onSuccess)
        onSuccess(data)
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
