import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';
import { Icon } from './Icons';
import { Btn3D } from './ui3d';
import { useDebounce } from '../hooks/useDebounce';
import { descendantIds } from '../utils';
import { waLink } from '../config/store';

const GROUP_PREVIEW = 4; // cards per category in the grouped view
const PAGE_SIZE = 12; // cards per "load more" step in the filtered view

// auto-fill keeps cards a sensible width even when a category has only 1-2 products.
const GRID = 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]';
const LIST = 'grid gap-5 grid-cols-1';

const SORTS = [
  { id: 'default', label: 'الترتيب الافتراضي' },
  { id: 'name', label: 'الاسم (أ - ي)' },
];

/** Grid / list switch (segmented 3D control). */
function ViewToggle({ view, onChange }) {
  const btn = (id, label, d) => (
    <button type="button" aria-pressed={view === id} aria-label={label} onClick={() => onChange(id)}
      className={`grid size-10 place-items-center rounded-lg transition ${
        view === id ? 'bg-royal text-paper shadow-edge-royal-sm' : 'bg-paper text-ink shadow-edge-paper-sm'
      }`}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </button>
  );
  return (
    <div role="group" aria-label="طريقة العرض" className="flex gap-2">
      {btn('grid', 'عرض شبكة', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z')}
      {btn('list', 'عرض قائمة', 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01')}
    </div>
  );
}

/** One compact strip for all categories without products (instead of big empty boxes). */
function ComingSoon({ names }) {
  if (!names.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-silver bg-white/70 p-5">
      <p className="font-semibold">
        <Icon name="box" className="me-2 inline size-5 align-text-bottom text-royal" />
        قريباً: <bdi>{names.join(' - ')}</bdi>
      </p>
      <Btn3D href={waLink(`مرحبا اود الاستفسار عن منتجات ${names.join(' و')}`)} target="_blank" rel="noopener noreferrer"
        variant="ink" className="!py-2">
        <Icon name="chat" className="size-4" /> استفسر الآن
      </Btn3D>
    </div>
  );
}

/**
 * Sticky toolbar (search, categories with counts, sort, view) + the product list.
 * - No filter  -> grouped by category (a short preview of each).
 * - Filter set -> flat list with "load more".
 * All filtering is client-side: browsing never touches the network.
 */
export default function Products({ categories, products, features, counts, categoryId, onCategory, onOpen }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('default');
  const q = useDebounce(query.trim().toLowerCase());

  const roots = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const nameOf = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  // Reset paging whenever the filter changes.
  useEffect(() => setLimit(PAGE_SIZE), [categoryId, q, sort]);

  const filtered = useMemo(() => {
    const ids = categoryId ? descendantIds(categories, categoryId) : null;
    const out = products.filter((p) => (!ids || ids.has(p.categoryId)) && (!q || p.name.toLowerCase().includes(q)));
    return sort === 'name' ? [...out].sort((a, b) => a.name.localeCompare(b.name, 'ar')) : out;
  }, [products, categories, categoryId, q, sort]);

  const grouped = !categoryId && !q;

  // Grouped view: categories with products get a section; empty ones go to one strip.
  const { groups, empty } = useMemo(() => {
    if (!grouped) return { groups: [], empty: [] };
    const seen = new Set();
    const all = roots.map((c) => {
      const ids = descendantIds(categories, c.id);
      const items = products.filter((p) => ids.has(p.categoryId));
      items.forEach((p) => seen.add(p.id));
      return { category: c, items: sort === 'name' ? [...items].sort((a, b) => a.name.localeCompare(b.name, 'ar')) : items };
    });
    const rest = products.filter((p) => !seen.has(p.id));
    if (rest.length) all.push({ category: { id: 'other', name: 'منتجات أخرى' }, items: rest });
    return {
      groups: all.filter((g) => g.items.length),
      empty: all.filter((g) => !g.items.length).map((g) => g.category.name),
    };
  }, [grouped, categories, products, roots, sort]);

  const activeName = categoryId ? nameOf[categoryId] : null;
  const wrapClass = view === 'list' ? LIST : GRID;
  const cardProps = { features, onOpen, view };

  return (
    <section id="products" aria-labelledby="prod-title" className="scroll-mt-24 bg-silver/25 pb-16 pt-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle id="prod-title" eyebrow="المنتجات" title={activeName ? `منتجات ${activeName}` : 'كل المنتجات'}
          hint={`${filtered.length} منتج`} />
      </div>

      {/* sticky toolbar */}
      <div className="sticky top-[76px] z-20 mb-8 border-y border-silver/60 bg-paper/95 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-[200px] flex-1">
              <span className="sr-only">ابحث عن منتج</span>
              <Icon name="search" className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-ink/50" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتج بالاسم"
                className="w-full rounded-xl border-2 border-silver bg-white py-2.5 pe-4 ps-12 font-semibold outline-none transition focus:border-royal" />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <span className="sr-only sm:not-sr-only">ترتيب</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border-2 border-silver bg-white px-3 py-2.5 font-semibold outline-none focus:border-royal">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <ViewToggle view={view} onChange={setView} />
          </div>

          <div role="group" aria-label="تصفية حسب القسم" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {[{ id: null, name: 'الكل' }, ...roots].map((c) => {
              const on = categoryId === c.id;
              const n = c.id ? counts[c.id] ?? 0 : products.length;
              return (
                <button key={c.id ?? 'all'} type="button" aria-pressed={on} onClick={() => onCategory(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 active:translate-y-0.5 ${
                    on ? 'bg-royal text-paper shadow-edge-royal-sm' : 'bg-white text-ink shadow-edge-paper-sm'
                  }`}>
                  {c.name}
                  <span className={`rounded-full px-2 text-xs ${on ? 'bg-paper text-royal' : 'bg-ink text-paper'}`}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* results */}
      <div className="mx-auto max-w-6xl px-4" aria-live="polite">
        {grouped ? (
          <div className="space-y-14">
            {groups.map(({ category, items }) => (
              <div key={category.id}>
                <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-ink/10 pb-3">
                  <h3 className="flex items-center gap-3 text-2xl font-bold">
                    <span className="h-7 w-2 bg-royal clip-chip" aria-hidden="true" />
                    {category.name}
                    <span className="rounded-full bg-ink px-3 py-0.5 text-xs text-paper">{items.length}</span>
                  </h3>
                  {items.length > GROUP_PREVIEW && category.id !== 'other' && (
                    <button type="button" onClick={() => onCategory(category.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-bold text-royal hover:bg-royal hover:text-paper">
                      عرض الكل ({items.length}) <Icon name="arrow" className="size-4" />
                    </button>
                  )}
                </div>
                <ul className={wrapClass}>
                  {items.slice(0, GROUP_PREVIEW).map((p, i) => (
                    <ProductCard key={p.id} product={p} {...cardProps} priority={i < 2} />
                  ))}
                </ul>
              </div>
            ))}
            <ComingSoon names={empty} />
          </div>
        ) : filtered.length ? (
          <>
            <ul className={wrapClass}>
              {filtered.slice(0, limit).map((p, i) => (
                <ProductCard key={p.id} product={p} {...cardProps} categoryName={nameOf[p.categoryId]} priority={i < 4} />
              ))}
            </ul>
            {filtered.length > limit && (
              <div className="mt-10 text-center">
                <Btn3D variant="ink" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                  عرض المزيد ({filtered.length - limit})
                </Btn3D>
              </div>
            )}
          </>
        ) : q ? (
          <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-float">
            <p className="text-lg font-bold">لا توجد نتائج لـ "{query}"</p>
            <Btn3D className="mt-5" onClick={() => setQuery('')}>مسح البحث</Btn3D>
          </div>
        ) : (
          <ComingSoon names={[activeName ?? 'هذا القسم']} />
        )}
      </div>
    </section>
  );
}
