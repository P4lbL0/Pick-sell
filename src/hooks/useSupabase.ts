'use client'

import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseOptions {
  table: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useSupabaseQuery(options: UseSupabaseOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async (filter?: Record<string, any>) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from(options.table).select('*')

      if (filter) {
        for (const [key, value] of Object.entries(filter)) {
          query = query.eq(key, value)
        }
      }

      const { data, error: err } = await query
      if (err) throw err

      options.onSuccess?.()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
      return null
    } finally {
      setLoading(false)
    }
  }, [options])

  return { fetch, loading, error }
}

export function useSupabaseMutation(options: UseSupabaseOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const insert = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from(options.table)
        .insert([data])

      if (err) throw err

      options.onSuccess?.()
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
      return false
    } finally {
      setLoading(false)
    }
  }, [options])

  const update = useCallback(async (id: string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from(options.table)
        .update(data)
        .eq('id', id)

      if (err) throw err

      options.onSuccess?.()
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
      return false
    } finally {
      setLoading(false)
    }
  }, [options])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from(options.table)
        .delete()
        .eq('id', id)

      if (err) throw err

      options.onSuccess?.()
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
      return false
    } finally {
      setLoading(false)
    }
  }, [options])

  return { insert, update, remove, loading, error }
}
