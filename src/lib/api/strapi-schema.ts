/**
 * Strapi CMS Collection Schema
 * This file documents the required Strapi collections and their structure
 */

export const STRAPI_COLLECTIONS = {
  // Products Collection
  products: {
    title: 'Products',
    description: 'Products for Horlogerie and Informatique universes',
    attributes: {
      title: 'string (required)',
      price: 'decimal',
      shortDescription: 'text',
      detailedDescription: 'richtext',
      stock: 'integer',
      category: 'enumeration: seiko-mod, diverse, accessories, computer, computer-accessories',
      universe: 'enumeration: horlogerie, informatique (required)',
      images: 'media (multiple)',
      videos: 'media (multiple)',
      vintedLink: 'string (URL)',
      reviews: 'relation to reviews',
    },
  },

  // Services Collection
  services: {
    title: 'Services',
    description: 'Services like repair, custom watches, buyback',
    attributes: {
      title: 'string (required)',
      slug: 'string (unique)',
      description: 'richtext',
      type: 'enumeration: repair, custom, buyback',
      universe: 'enumeration: horlogerie, informatique',
      images: 'media (multiple)',
      contactUrl: 'string (URL)',
    },
  },

  // Content Blocks Collection
  contentBlocks: {
    title: 'Content Blocks',
    description: 'Editable text content blocks for pages',
    attributes: {
      key: 'string (unique, required)',
      title: 'string',
      content: 'richtext (required)',
      universe: 'enumeration: horlogerie, informatique, global',
    },
  },

  // Hero Slides Collection
  heroSlides: {
    title: 'Hero Slides',
    description: 'Banner slides for hero sections',
    attributes: {
      title: 'string (required)',
      subtitle: 'string',
      image: 'media (single, required)',
      video: 'media (single)',
      universeType: 'enumeration: horlogerie, informatique, global (required)',
      ctaText: 'string',
      ctaLink: 'string (URL)',
      order: 'integer (required, for sorting)',
    },
  },

  // Reviews Collection
  reviews: {
    title: 'Reviews',
    description: 'Customer reviews from Vinted, LeBonCoin, or internal',
    attributes: {
      rating: 'integer (1-5)',
      text: 'text',
      author: 'string',
      source: 'enumeration: vinted, leboncoin, internal',
      image: 'media (single)',
      product: 'relation to products',
    },
  },

  // Contacts Collection
  contacts: {
    title: 'Contacts',
    description: 'Contact links (Email, WhatsApp, Social media)',
    attributes: {
      platform: 'enumeration: email, whatsapp, tiktok, instagram, vinted',
      url: 'string (URL, required)',
      icon: 'string (icon class or name)',
    },
  },
}

/**
 * Strapi Setup Instructions
 * 
 * 1. Install Strapi locally or on a server
 * 2. Create the collections as defined above
 * 3. Configure roles & permissions to allow public read access to collections
 * 4. Create an API token for backend authentication
 * 5. Add environment variables to .env.local
 * 
 * Quick-start Strapi:
 * ```bash
 * npx create-strapi-app strapi --template cms
 * cd strapi
 * npm run develop
 * ```
 */
