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
- API: `GET {VITE_API_BASE}/public/stores/alomda` (see `.env.example`)

## Request budget (Cloudflare)

- First paint uses the bundled snapshot in `src/data/storefront.json` (0 requests).
- One conditional catalog request per `VITE_CATALOG_TTL_MIN` (default 30 min), `If-None-Match` so unchanged = bodyless 304.
- Failed request backs off 5 min. Search and category filters run in the browser.
- `public/_headers` caches `/assets/*` for one year.
