/**
 * Product catalog.
 *
 * - `price` is in the currency's smallest unit (EUR cents).
 * - `images[0]` is the canonical product card image.
 * - Add new products by appending to PRODUCTS. Slugs must be unique.
 */

export const PRODUCTS = [
  {
    id: 'sweet-dreams',
    slug: 'sweet-dreams',
    name: 'SWEET DREAMS',
    tagline: 'Oversized Tee — Drop 01',
    description:
      'Heavy 240gsm cotton oversized fit. Hand-finished screen print sourced from the Karan Aujla 407 archive. Drop 01 — limited to 999 pieces, no restock.',
    price: 4900,
    currency: 'EUR',
    category: 'tees',
    images: [
      '/images/hero-neutral.jpg',
      '/images/hero-red.jpg',
      '/images/poster.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    tags: ['oversized', 'limited', 'drop-01'],
  },
  {
    id: 'aujla-407-hoodie',
    slug: 'aujla-407-hoodie',
    name: 'AUJLA 407',
    tagline: 'Heavyweight Hoodie — Coming Soon',
    description:
      'Brushed-back fleece, dropped shoulder, custom embroidered chest mark. Drop 02 release pending.',
    price: 8900,
    currency: 'EUR',
    category: 'hoodies',
    images: ['/images/poster.png', '/images/model-cutout.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
    featured: false,
    tags: ['heavyweight', 'drop-02', 'coming-soon'],
  },
  {
    id: 'sweet-dreams-cap',
    slug: 'sweet-dreams-cap',
    name: 'DREAMS CAP',
    tagline: 'Six-Panel — Coming Soon',
    description:
      'Unstructured six-panel cap with washed black canvas and tonal embroidered V mark.',
    price: 2900,
    currency: 'EUR',
    category: 'accessories',
    images: ['/images/model-cutout.png', '/images/hero-red.jpg'],
    sizes: ['One Size'],
    inStock: false,
    featured: false,
    tags: ['accessories', 'coming-soon'],
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'tees', name: 'Tees' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'accessories', name: 'Accessories' },
];

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getRelatedProducts(slug, limit = 2) {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return PRODUCTS.filter(
    (p) => p.slug !== slug && p.category === current.category
  ).slice(0, limit);
}
