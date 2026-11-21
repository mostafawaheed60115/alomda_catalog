import Logo from './Logo';
import { Icon } from './Icons';
import { Btn3D } from './ui3d';
import { CONTACT, telLink, waLink } from '../config/store';

export default function Footer() {
  return (
    <>
      <footer className="border-t-4 border-royal bg-ink pb-24 text-silver md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8">
          <Logo light />
          <p className="max-w-md text-sm">{CONTACT.address}</p>
          <a href={telLink} dir="ltr" className="font-bold text-paper hover:underline">{CONTACT.phone}</a>
        </div>
        <p className="border-t border-paper/10 py-4 text-center text-xs">© {new Date().getFullYear()} العمدة. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Mobile quick actions: always one tap away from calling */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 bg-paper/95 p-3 shadow-[0_-8px_20px_-10px_rgb(30_30_30/.4)] backdrop-blur md:hidden">
        <Btn3D href={telLink}><Icon name="phone" className="size-4" /> اتصل</Btn3D>
        <Btn3D href={waLink()} target="_blank" rel="noopener noreferrer" variant="ink">
          <Icon name="chat" className="size-4" /> واتساب
        </Btn3D>
      </div>
    </>
  );
}
