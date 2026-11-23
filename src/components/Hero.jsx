import { Icon } from './Icons';
import { Btn3D, Tilt } from './ui3d';
import { CONTACT, telLink } from '../config/store';

const Stat = ({ value, label }) => (
  <div className="rounded-xl bg-paper/10 px-4 py-3 text-center ring-1 ring-paper/20">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-silver">{label}</div>
  </div>
);

/** Dark hero: pitch + CTAs on one side, an interactive 3D pillar stage on the other. */
export default function Hero({ categoryCount, productCount, featured, onOpen }) {
  const img = featured?.images[0];
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-paper">
      {/* blueprint grid + soft blue glow */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#F6F6F6_1px,transparent_1px),linear-gradient(90deg,#F6F6F6_1px,transparent_1px)] [background-size:48px_48px]" />
      <div aria-hidden="true" className="absolute -top-40 end-[-8rem] size-[30rem] rounded-full bg-royal/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:py-24">
        <div>
          <span className="eyebrow">كتالوج المنتجات</span>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">{CONTACT.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-silver">{CONTACT.tagline}</p>
          <p className="mt-4 max-w-md text-silver">
            تصفح الأقسام والمنتجات، واعرف المميزات والاستخدامات، ثم تواصل معنا مباشرة للاستفسار أو الطلب.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Btn3D href="#products" variant="paper">
              تصفح المنتجات <Icon name="arrow" className="size-4" />
            </Btn3D>
            <Btn3D href={telLink}>
              <Icon name="phone" className="size-4" /> <span dir="ltr">{CONTACT.phone}</span>
            </Btn3D>
          </div>

          <div className="mt-10 grid max-w-sm grid-cols-2 gap-3">
            <Stat value={categoryCount} label="أقسام" />
            <Stat value={productCount} label="منتج" />
          </div>
        </div>

        {/* 3D stage */}
        <Tilt max={16} base={{ x: 8, y: -14 }} wrapperClassName="mx-auto w-full max-w-[440px]"
          className="relative h-[440px] sm:h-[480px]">
          {/* Full lockup as a floating plate. Fixed width/height so nothing shifts while it loads. */}
          <img src="/logo.png" width="506" height="666" fetchPriority="high"
            alt="شعار العمدة للديكور ومواد البناء"
            className="absolute inset-x-0 top-0 mx-auto h-[300px] w-auto rounded-3xl shadow-float-lg translate-z-[60px] sm:h-[340px]" />

          {featured && (
            <button type="button" onClick={() => onOpen(featured)}
              className="absolute inset-x-4 bottom-4 translate-z-[110px] rounded-2xl bg-paper p-3 text-start text-ink shadow-float-lg transition hover:-translate-y-1">
              <span className="flex items-center gap-3">
                {img && (
                  <img src={img.url} alt="" width="72" height="72" fetchpriority="high"
                    className="size-[72px] shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-silver" />
                )}
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-royal">منتج مميز</span>
                  <span className="block truncate font-bold">{featured.name}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold">
                    عرض التفاصيل <Icon name="arrow" className="size-3" />
                  </span>
                </span>
              </span>
            </button>
          )}
        </Tilt>
      </div>
    </section>
  );
}
