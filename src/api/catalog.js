import fallbackStore from '../data/store.json';
import fallbackMenu from '../data/menu.json';
import { mapGallery, normalizeCatalog } from './normalize';

// The API lives on its own origin (Cloudflare Worker), NOT on the site's origin.
const BASE = (import.meta.env.VITE_API_BASE || 'https://stores.nova-solution.net').replace(/\/$/, '');
const SLUG = import.meta.env.VITE_STORE_SLUG || 'alomda';
const TTL_MS = Number(import.meta.env.VITE_CATALOG_TTL_MIN || 30) * 60_000;
const KEY = `catalog:${SLUG}:v2`;
const ROOT = `${BASE}/public/stores/${SLUG}`;

/** Bundled snapshot of the live data: first paint needs zero network. */
export const initialData = normalizeCatalog(fallbackStore, fallbackMenu);

// Plain GET with no custom headers => a "simple" CORS request (no preflight round-trip).
// Revalidation (ETag / Cache-Control) is left to the browser's HTTP cache.
async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};
const writeCache = (data, t = Date.now()) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ t, data }));
  } catch {
    /* storage full or blocked: run without cache */
  }
};

let inflight = null; // dedupe: concurrent callers share one request pair

/**
 * Whole catalog in TWO requests: store flags + /menu (categories + products in one payload).
 * At most one pair per TTL window; fresh cache = zero requests.
 * Returns { data, fresh }.
 */
export async function loadCatalog({ signal } = {}) {
  const cached = readCache();
  if (cached && Date.now() - cached.t < TTL_MS) return { data: cached.data, fresh: true };
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const [store, menu] = await Promise.all([getJson(ROOT, signal), getJson(`${ROOT}/menu`, signal)]);
      const data = normalizeCatalog(store, menu);
      writeCache(data);
      return { data, fresh: true };
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      // API down / offline: keep showing the last good data, retry in 5 min (not on every page load).
      const data = cached?.data ?? initialData;
      writeCache(data, Date.now() - TTL_MS + 5 * 60_000);
      return { data, fresh: false, error: err };
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export const readCachedData = () => readCache()?.data ?? initialData;

// ---- product gallery: fetched lazily, only when a product is opened, once per session ----
const galleries = new Map();

/** Resolves to the product's images (sorted). Cached in memory; failures are not cached. */
export function loadGallery(productId) {
  if (!galleries.has(productId)) {
    const p = getJson(`${ROOT}/products/${productId}`).then(mapGallery);
    p.catch(() => galleries.delete(productId));
    galleries.set(productId, p);
  }
  return galleries.get(productId);
}
