import { supabase } from '../supabase';
import type { Product, ProductDetail, Service, ContentBlock, HeroSlide, Contact, Review } from '../types';

// PRODUCTS API
export async function getProducts(universe?: string): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');

    if (universe) {
      query = query.eq('universe', universe);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((product: any) => ({
      id: String(product.id),
      title: product.title,
      price: Number(product.price),
      category: product.category,
      universe: product.universe,
      stock: product.stock || 0,
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      image_url: product.image_url || '',
      created_at: product.created_at,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductsByCategory(
  universe: string,
  category: string
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('universe', universe)
      .eq('category', category);

    if (error) throw error;

    return (data || []).map((product: any) => ({
      id: String(product.id),
      title: product.title,
      price: Number(product.price),
      category: product.category,
      universe: product.universe,
      stock: product.stock || 0,
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      image_url: product.image_url || '',
      created_at: product.created_at,
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews: reviews(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: String(data.id),
      title: data.title,
      price: Number(data.price),
      category: data.category,
      universe: data.universe,
      stock: data.stock || 0,
      short_description: data.short_description || '',
      long_description: data.long_description || '',
      image_url: data.image_url || '',
      created_at: data.created_at,
      detailedDescription: data.long_description || '',
      reviews: (data.reviews || []).map((review: any) => ({
        id: String(review.id),
        rating: review.rating,
        text: review.text,
        author: review.author,
        source: review.source as any,
        imageUrl: review.image_url || '',
      })),
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// SERVICES API
export async function getServicesByType(type: string): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('type', type);

    if (error) throw error;

    return (data || []).map((service: any) => ({
      id: String(service.id),
      title: service.title,
      slug: service.slug,
      universe: service.universe,
      description: service.description || '',
      type: service.type,
      images: [],
      contactUrl: service.contact_url || '',
      createdAt: service.created_at,
      updatedAt: service.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// CONTENT BLOCKS API
export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  try {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: String(data.id),
      key: data.key,
      title: data.title || '',
      content: data.content || '',
      universe: data.universe || 'global',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching content block:', error);
    return null;
  }
}

export async function getContentBlocksByUniverse(
  universe: string
): Promise<ContentBlock[]> {
  try {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('universe', universe);

    if (error) throw error;

    return (data || []).map((block: any) => ({
      id: String(block.id),
      key: block.key,
      title: block.title || '',
      content: block.content || '',
      universe: block.universe || 'global',
      createdAt: block.created_at,
      updatedAt: block.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching content blocks by universe:', error);
    return [];
  }
}

// HERO SLIDES API
export async function getHeroSlides(universe?: string): Promise<HeroSlide[]> {
  try {
    let query = supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });

    if (universe) {
      query = query.eq('universe_type', universe);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((slide: any) => ({
      id: String(slide.id),
      title: slide.title,
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '',
      video_url: slide.video_url || '',
      universe_type: slide.universe_type,
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      order_index: slide.order_index || 0,
    }));
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

// REVIEWS API
export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    let query = supabase.from('reviews').select('*');

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((review: any) => ({
      id: String(review.id),
      rating: review.rating,
      text: review.text,
      author: review.author,
      source: review.source as any,
      imageUrl: review.image_url || '',
      productId: String(review.product_id),
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// CONTACTS API
export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('platform', { ascending: true });

    if (error) throw error;

    return (data || []).map((contact: any) => ({
      id: String(contact.id),
      platform: contact.platform,
      url: contact.url,
      icon: contact.icon || '',
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

// Error handling wrapper
export async function fetchWithFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('Fetch error, using fallback:', error);
    return fallback;
  }
}
