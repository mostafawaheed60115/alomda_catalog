import fallback from '../data/storefront.json';

const BASE = import.meta.env.VITE_API_BASE ?? '';
const SLUG = import.meta.env.VITE_STORE_SLUG || 'alomda';
const TTL_MS = Number(import.meta.env.VITE_CATALOG_TTL_MIN || 30) * 60_000;
const KEY = `catalog:${SLUG}:v1`;

/** Bundled snapshot: first paint needs zero network. */
export const initialData = normalize(fallback);

/** Accept `{store, catalog}`, `{configuration: "<json>"}` or a bare catalog. */
function normalize(raw) {
  const src = typeof raw?.configuration === 'string' ? JSON.parse(raw.configuration) : raw;
  const catalog = src.catalog ?? src;
  const store = src.store ?? {};
  const products = (catalog.products ?? [])
    .filter((p) => p.isActive !== false)
    .map((p) => ({ ...p, images: [...(p.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder) }));
  return {
    store,
    categories: catalog.categories ?? [],
    products,
    features: store.features ?? {},
  };
}

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

let inflight = null; // dedupe: concurrent callers share one request

/**
 * Returns { data, fresh }. At most ONE network call per TTL window, and it is
 * conditional (If-None-Match) so an unchanged catalog costs a bodyless 304.
 */
export async function loadCatalog({ signal } = {}) {
  const cached = readCache();
  if (cached && Date.now() - cached.t < TTL_MS) return { data: cached.data, fresh: true };
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const headers = cached?.etag ? { 'If-None-Match': cached.etag } : {};
      const res = await fetch(`${BASE}/public/stores/${SLUG}`, { headers, signal });
      if (res.status === 304 && cached) {
        localStorage.setItem(KEY, JSON.stringify({ ...cached, t: Date.now() }));
        return { data: cached.data, fresh: true };
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = normalize(await res.json());
      localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), etag: res.headers.get('ETag'), data }));
      return { data, fresh: true };
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      // Offline / API down: serve stale cache, then bundled snapshot.
      // Back off 5 min so a failing API is not retried on every page load.
      const data = cached?.data ?? initialData;
      localStorage.setItem(KEY, JSON.stringify({ ...cached, data, t: Date.now() - TTL_MS + 5 * 60_000 }));
      return { data, fresh: false, error: err };
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export const readCachedData = () => readCache()?.data ?? initialData;
