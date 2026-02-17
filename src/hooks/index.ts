/**
 * Custom hooks
 */

import { useState, useEffect } from 'react'
import { Product, Service, ContentBlock } from '@/lib/types'

/**
 * Fetch products from Strapi
 */
export function useProducts(universe?: 'horlogerie' | 'informatique') {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/products${universe ? `?universe=${universe}` : ''}`
        )
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [universe])

  return { products, loading, error }
}

/**
 * Fetch services from Strapi
 */
export function useServices(type?: 'repair' | 'custom' | 'buyback') {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/services${type ? `?type=${type}` : ''}`
        )
        if (!response.ok) throw new Error('Failed to fetch services')
        const data = await response.json()
        setServices(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [type])

  return { services, loading, error }
}

/**
 * Fetch content blocks from Strapi
 */
export function useContentBlock(key: string) {
  const [content, setContent] = useState<ContentBlock | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/content-blocks?key=${key}`)
        if (!response.ok) throw new Error('Failed to fetch content')
        const data = await response.json()
        setContent(data.data?.[0] || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [key])

  return { content, loading, error }
}
