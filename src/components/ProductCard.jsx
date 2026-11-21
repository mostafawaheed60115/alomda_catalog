import { memo } from 'react';
import { Icon } from './Icons';
import { Tilt } from './ui3d';
import { productInquiryLink } from '../config/store';
import { featureList, formatPrice, teaser, usageText } from '../utils';

/**
 * 3D catalog card. `view` = 'grid' (portrait card) | 'list' (wide row).
 * The surface tilts with the pointer; image, chips and actions sit at different Z depths.
 * Memoised so filtering only re-renders cards that changed.
 */
function ProductCard({ product, categoryName, features, onOpen, view = 'grid', priority = false }) {
  const img = product.images[0];
  const list = view === 'list';
  const hasPrice = features.price && product.price != null;
  const showText = features.description;
  const usage = showText ? usageText(product.description) : '';
  const chips = showText ? featureList(product.description) : [];
  const fallbackText = showText && !usage ? teaser(product.description) : '';

  return (
    <li>
      <Tilt max={list ? 5 : 8} onClick={() => onOpen(product)}
        className={`relative flex h-full cursor-pointer rounded-2xl bg-white p-3 shadow-float ${
          list ? 'flex-row items-stretch gap-4' : 'flex-col'
        }`}>
        {/* image */}
        <div className={`${list ? 'translate-z-4' : 'translate-z-8'} relative shrink-0 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-silver/70 ${
          list ? 'w-36 sm:w-52' : 'aspect-[4/5] w-full'
        }`}>
          {img ? (
            <img src={img.url} alt={img.title || product.name} width="400" height="500"
              loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'} decoding="async"
              className="h-full w-full object-contain p-3" />
          ) : (
            <span className="grid h-full place-items-center text-royal"><Icon name="box" className="size-12" /></span>
          )}
          {categoryName && (
            <span className="absolute start-2 top-2 rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">
              {categoryName}
            </span>
          )}
        </div>

        {/* details */}
        <div className={`translate-z-4 flex min-w-0 flex-1 flex-col ${list ? 'py-1' : 'px-1 pb-1 pt-4'}`}>
          <h3 className="text-lg font-bold leading-snug">
            <button type="button" className="rounded text-start">{product.name}</button>
          </h3>

          {usage && (
            <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-ink/80">
              <Icon name="tool" className="mt-0.5 size-4 shrink-0 text-royal" />
              <span className="line-clamp-2">{usage}</span>
            </p>
          )}
          {fallbackText && <p className="mt-2 line-clamp-2 text-sm text-ink/70">{fallbackText}</p>}

          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                // bg-royal/10 = 10% tint of the brand blue
                <li key={c} className="rounded-lg bg-royal/10 px-2.5 py-1 text-xs font-bold text-royal">{c}</li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            {hasPrice ? <span className="font-bold text-royal">{formatPrice(product.price)}</span> : <span />}
            <span className="translate-z-6 flex items-center gap-2">
              <a href={productInquiryLink(product.name)} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} aria-label={`استفسر عن ${product.name} عبر واتساب`}
                className="grid size-9 place-items-center rounded-lg bg-ink text-paper shadow-edge-ink-sm transition hover:-translate-y-0.5">
                <Icon name="chat" className="size-4" />
              </a>
              <span className="inline-flex items-center gap-1 rounded-lg bg-royal px-3 py-2 text-xs font-bold text-paper shadow-edge-royal-sm">
                التفاصيل <Icon name="arrow" className="size-3" />
              </span>
            </span>
          </div>
        </div>
      </Tilt>
    </li>
  );
}

export default memo(ProductCard);
