/**
 * Pure mappers: Nova Stores public API (snake_case) -> the shape the UI uses.
 * Kept free of `import.meta` so it can be unit-tested in plain Node.
 */

/** GET /public/stores/{slug} flags (0/1) -> booleans. */
export const mapFeatures = (store = {}) => ({
  price: !!store.allow_price,
  description: !!store.allow_description,
  salePrice: !!store.allow_sale_price,
  stock: !!store.allow_stock,
  checkout: !!store.allow_checkout,
  coupons: !!store.allow_coupons,
});

export const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  description: c.description ?? null,
  imageUrl: c.img_url ?? null,
  parentId: c.parent_id ?? null,
});

/** List/menu products carry only the primary image (`image_url`). */
export const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description ?? null,
  price: p.price ?? null,
  salePrice: p.sale_price ?? null,
  stock: p.stock ?? null,
  categoryId: p.category_id,
  images: p.image_url ? [{ id: `${p.id}:primary`, url: p.image_url, title: null, sortOrder: 0 }] : [],
});

/** GET /products/{id} gallery, ordered by sort_order (first = primary). */
export const mapGallery = (detail) =>
  (detail?.images ?? [])
    .map((i) => ({ id: i.id, url: i.img_url, title: i.img_title ?? null, sortOrder: i.sort_order ?? 0 }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

/** store = GET /public/stores/{slug}, menu = GET /public/stores/{slug}/menu */
export function normalizeCatalog(store, menu) {
  return {
    store: { name: store.name, slug: store.slug, description: store.description ?? null, logoUrl: store.logo_url ?? null },
    features: mapFeatures(store),
    categories: (menu.categories ?? []).map(mapCategory),
    products: (menu.products ?? []).map(mapProduct),
  };
}
