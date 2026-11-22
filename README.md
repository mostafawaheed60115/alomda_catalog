# alomda_catalog

العمدة - Online Catalog. React 18 + Vite + Tailwind CSS 3 + `tailwindcss-3d`.

## Run

```
npm install
npm run dev      # development
npm run build    # production build in dist/
```

## Config

- Contact details: `src/config/store.js`
- Palette and 3D shadows: `tailwind.config.js`
- API origin: `VITE_API_BASE` (default `https://stores.nova-solution.net`), store slug `VITE_STORE_SLUG` (default `alomda`). See `.env.example`.

## Data flow (Nova Stores public API)

| Request | When | Gives |
| :--- | :--- | :--- |
| `GET /public/stores/alomda` | catalog refresh | feature flags (`allow_*`) |
| `GET /public/stores/alomda/menu` | catalog refresh | categories + products, one payload |
| `GET /public/stores/alomda/products/{id}` | product dialog opened | full image gallery (cached per session) |

Mapping from snake_case to the UI shape lives in `src/api/normalize.js`.

## Request budget (Cloudflare)

- First paint uses the bundled snapshot (`src/data/store.json`, `src/data/menu.json`): 0 requests.
- Catalog refresh = 2 requests, at most once per `VITE_CATALOG_TTL_MIN` (default 30 min); fresh cache = 0.
- Plain GETs with no custom headers: no CORS preflight requests.
- API failure: shows last good data, retries in 5 min, not on every page load.
- Search, filters and sorting run in the browser. `public/_headers` caches `/assets/*` for one year.
