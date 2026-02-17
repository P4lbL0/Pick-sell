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
  created_at: string
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
  createdAt: string
  updatedAt: string
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
