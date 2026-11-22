import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import { Btn3D } from './ui3d';
import { useGallery } from '../hooks/useGallery';
import { featureList, formatPrice, parseDescription } from '../utils';
import { productInquiryLink, telLink } from '../config/store';

// Icon per known description label; anything else falls back to "info".
const ROW_ICON = { 'الوصف': 'doc', 'أهم المميزات': 'star', 'الاستخدام الرئيسي': 'tool' };

/** Hover-to-zoom image: the zoom origin follows the cursor (mouse only). */
function ZoomImage({ src, alt }) {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ref.current.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  };
  return (
    <div onPointerMove={move}
      className="group grid aspect-square cursor-zoom-in place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-silver/70">
      <img ref={ref} src={src} alt={alt} decoding="async"
        className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-[1.7]" />
    </div>
  );
}

/**
 * Product details in a native <dialog> (focus trap, Esc, inert background built in).
 * Prev/next walk through `products`; arrow keys work too.
 */
export default function ProductDialog({ product, products, features, categoryName, onSelect, onClose }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  const index = products.findIndex((p) => p.id === product.id);
  const go = useCallback(
    (step) => products.length > 1 && onSelect(products[(index + step + products.length) % products.length]),
    [products, index, onSelect],
  );

  useEffect(() => {
    const d = ref.current;
    d.showModal();
    document.body.classList.add('overflow-hidden'); // lock page scroll behind the modal
    return () => {
      document.body.classList.remove('overflow-hidden');
      if (d.open) d.close();
    };
  }, []);

  useEffect(() => setActive(0), [product.id]);

  // RTL: the "next" arrow points left, so ArrowLeft = next, ArrowRight = previous.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(1);
      if (e.key === 'ArrowRight') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const images = useGallery(product);
  const img = images[active];
  const rows = features.description ? parseDescription(product.description) : [];
  const chips = features.description ? featureList(product.description, 6) : [];
  const hasPrice = features.price && product.price != null;

  return (
    <dialog ref={ref} aria-labelledby="pd-title" onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(960px,94vw)] max-h-[92vh] overflow-y-auto rounded-3xl bg-paper p-0 text-ink shadow-float-lg backdrop:bg-ink/75 backdrop:backdrop-blur-sm">
      <div className="relative grid gap-6 p-5 md:grid-cols-2 md:p-8">
        <button type="button" onClick={onClose} aria-label="إغلاق"
          className="absolute end-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-ink text-paper shadow-edge-ink-sm transition hover:bg-royal">
          <Icon name="close" className="size-5" />
        </button>

        {/* gallery */}
        <div>
          <div className="rounded-2xl bg-white p-4 shadow-float">
            {img ? <ZoomImage src={img.url} alt={img.title || product.name} /> : (
              <div className="grid aspect-square place-items-center"><Icon name="box" className="size-16 text-royal" /></div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((im, i) => (
                <button key={im.id} type="button" aria-label={`صورة ${i + 1}`} aria-pressed={i === active} onClick={() => setActive(i)}
                  className={`size-16 overflow-hidden rounded-xl bg-white ring-2 ${i === active ? 'ring-royal' : 'ring-silver'}`}>
                  <img src={im.url} alt="" width="64" height="64" loading="lazy" className="size-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs font-semibold text-ink/60">مرّر الماوس على الصورة للتكبير</p>
        </div>

        {/* details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow !mb-0">تفاصيل المنتج</span>
            {categoryName && <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">{categoryName}</span>}
          </div>
          <h2 id="pd-title" className="mt-3 text-3xl font-bold leading-tight">{product.name}</h2>
          {hasPrice && <p className="mt-2 text-2xl font-bold text-royal">{formatPrice(product.price)}</p>}

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={c} className="rounded-lg bg-royal/10 px-3 py-1 text-sm font-bold text-royal">{c}</li>
              ))}
            </ul>
          )}

          {rows.length > 0 && (
            <dl className="mt-5 space-y-3">
              {rows.map((r) => (
                <div key={r.label + r.text} className="flex gap-3 rounded-xl bg-white p-3 shadow-edge-paper-sm ring-1 ring-silver/60">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-royal text-paper">
                    <Icon name={ROW_ICON[r.label] ?? 'info'} className="size-5" />
                  </span>
                  <div>
                    {r.label && <dt className="text-xs font-bold text-royal">{r.label}</dt>}
                    <dd className="font-semibold leading-relaxed">{r.text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex flex-wrap gap-4 pt-6">
            <Btn3D href={productInquiryLink(product.name)} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" className="size-4" /> استفسر عبر واتساب
            </Btn3D>
            <Btn3D href={telLink} variant="ink"><Icon name="phone" className="size-4" /> اتصل بنا</Btn3D>
          </div>

          {products.length > 1 && (
            <nav aria-label="التنقل بين المنتجات" className="mt-6 flex items-center justify-between border-t border-silver pt-4 text-sm font-bold">
              <button type="button" onClick={() => go(-1)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-royal hover:text-paper">
                <Icon name="arrow" className="size-4 rotate-180" /> السابق
              </button>
              <span className="text-ink/60">{index + 1} / {products.length}</span>
              <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-royal hover:text-paper">
                التالي <Icon name="arrow" className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </dialog>
  );
}
