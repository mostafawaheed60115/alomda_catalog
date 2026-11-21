import { memo } from 'react';
import { Icon } from './Icons';
import { Tilt } from './ui3d';
import SectionTitle from './SectionTitle';

const CategoryTile = memo(function CategoryTile({ category, count, active, onSelect }) {
  return (
    <li>
      {/* Whole surface is clickable; the inner button keeps it keyboard/screen-reader reachable
          (its click bubbles up, so no handler on the button itself). */}
      <Tilt max={10} onClick={() => onSelect(category.id)}
        className={`relative cursor-pointer rounded-2xl p-4 shadow-float ${active ? 'bg-royal text-paper' : 'bg-white'}`}>
        {/* image pops forward */}
        <div className="translate-z-8 mx-auto grid aspect-[4/3] w-full place-items-center rounded-xl bg-paper shadow-md ring-1 ring-silver/70">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt="" width="240" height="180" loading="lazy" decoding="async"
              className="h-full w-full rounded-xl object-contain p-3" />
          ) : (
            <Icon name="layers" className="size-10 text-royal" />
          )}
        </div>

        <div className="translate-z-4 mt-4 flex items-center justify-between gap-2">
          <h3 className="text-xl font-bold">
            <button type="button" aria-pressed={active} className="rounded">{category.name}</button>
          </h3>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-paper text-royal' : 'bg-ink text-paper'}`}>
            {count} منتج
          </span>
        </div>
      </Tilt>
    </li>
  );
});

/** 3D category tiles. Selecting one filters the product list below. */
export default function Categories({ categories, counts, activeId, onSelect }) {
  if (!categories.length) return null;
  return (
    <section id="categories" aria-labelledby="cat-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <SectionTitle id="cat-title" eyebrow="الأقسام" title="اختر القسم" hint="اضغط على أي قسم لعرض منتجاته." />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryTile key={c.id} category={c} count={counts[c.id] ?? 0} active={activeId === c.id} onSelect={onSelect} />
        ))}
      </ul>
    </section>
  );
}
