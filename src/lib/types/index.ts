/**
 * Product Types for Horlogerie and Informatique universes
 */

export interface Product {
  id: string
  title: string
  price: number
  short_description: string
  long_description: string
  stock: number
  category: 'seiko-mod' | 'diverse' | 'accessories' | 'computer' | 'computer-accessories'
  universe: 'horlogerie' | 'informatique'
  image_url: string
  vinted_url?: string
  created_at: string
}

export interface ProductColor {
  id: string
  product_id: string
  name: string
  hex_color: string
  image_url?: string
  stock: number
  created_at: string
}

export interface QuoteItem {
  label: string
  price_min: number
  price_max: number
  description?: string
}

export interface ServiceQuote {
  id: string
  title: string
  universe: 'horlogerie' | 'informatique'
  service_type: 'repair' | 'custom' | 'buyback'
  items: QuoteItem[]
  note?: string
  created_at: string
  updated_at: string
}

export interface ProductDetail extends Product {
  detailedDescription: string
  reviews?: Review[]
}

export interface Review {
  id: string
  rating: number
  text: string
  author: string
  source: 'vinted' | 'leboncoin' | 'internal'
  imageUrl?: string
}

export interface Service {
  id: string
  title: string
  slug: string
  universe: 'horlogerie' | 'informatique'
  description: string
  type: 'repair' | 'custom' | 'buyback'
  images?: string[]
  contactUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ContentBlock {
  id: string
  key: string
  title?: string
  content: string
  universe?: 'horlogerie' | 'informatique' | 'global'
  bg_image_url?: string
  bg_video_url?: string
  bg_overlay_opacity?: number
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  image_url: string
  video_url?: string
  universe_type: 'horlogerie' | 'informatique' | 'global'
  cta_text?: string
  cta_link?: string
  order_index: number
}

export interface Contact {
  id: string
  platform: 'email' | 'whatsapp' | 'tiktok' | 'instagram' | 'vinted'
  url: string
  icon?: string
}

// ─── Quote Requests (customer submissions) ───────────────────────────────────

export interface QuoteFormFieldOption {
  value: string
  label: string
}

export interface QuoteFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox-group'
  required: boolean
  placeholder?: string
  options?: QuoteFormFieldOption[]
  row?: number
}

export interface QuoteFormConfig {
  id?: string
  universe: 'horlogerie' | 'informatique'
  service_type: 'repair' | 'custom' | 'buyback'
  fields: QuoteFormField[]
  updated_at?: string
}

export interface QuoteRequest {
  id: string
  universe: 'horlogerie' | 'informatique'
  service_type: 'repair' | 'custom' | 'buyback'
  name: string
  email: string
  phone?: string
  data: Record<string, unknown>
  status: 'new' | 'read' | 'in_progress' | 'done' | 'rejected'
  notes?: string
  created_at: string
}
