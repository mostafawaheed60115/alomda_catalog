import Logo from './Logo';
import { Icon } from './Icons';
import { Btn3D } from './ui3d';
import { CONTACT, telLink } from '../config/store';

const LINKS = [
  { href: '#categories', label: 'الأقسام' },
  { href: '#products', label: 'المنتجات' },
  { href: '#contact', label: 'تواصل معنا' },
];

/** Info strip + sticky navigation. `loading` shows a thin progress bar while revalidating. */
export default function Header({ loading }) {
  return (
    <>
      <div className="bg-ink text-xs text-silver">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
          <span className="inline-flex items-center gap-2">
            <Icon name="pin" className="size-4 shrink-0 text-paper" />
            {CONTACT.address}
          </span>
          <a href={telLink} className="inline-flex items-center gap-2 font-semibold text-paper hover:underline">
            <Icon name="phone" className="size-4" />
            <span dir="ltr">{CONTACT.phone}</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b-4 border-royal bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" aria-label="العمدة - الرئيسية"><Logo /></a>
          <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="rounded-lg px-4 py-2 font-semibold transition hover:bg-royal hover:text-paper">
                {l.label}
              </a>
            ))}
          </nav>
          <Btn3D href={telLink} className="hidden !px-4 !py-2 sm:inline-flex">
            <Icon name="phone" className="size-4" /> اتصل الآن
          </Btn3D>
        </div>
        {loading && (
          <div className="absolute inset-x-0 bottom-[-4px] h-1 overflow-hidden" role="progressbar" aria-label="جاري التحديث">
            <div className="h-full w-1/2 bg-paper [animation:load-bar_1s_linear_infinite]" />
          </div>
        )}
      </header>
    </>
  );
}
