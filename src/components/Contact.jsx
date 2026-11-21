import { Icon } from './Icons';
import { Btn3D, Tilt } from './ui3d';
import SectionTitle from './SectionTitle';
import { CONTACT, mapLink, telLink, waLink } from '../config/store';

const Item = ({ icon, label, children }) => (
  <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-edge-paper-sm ring-1 ring-silver/60">
    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-royal text-paper shadow-edge-royal-sm">
      <Icon name={icon} className="size-6" />
    </span>
    <div>
      <div className="text-sm font-bold text-royal">{label}</div>
      <div className="text-lg font-bold leading-snug">{children}</div>
    </div>
  </div>
);

/** Address + phone with one-tap call, WhatsApp and map actions. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <SectionTitle id="contact-title" eyebrow="تواصل معنا" title="زورونا أو اتصلوا بنا" />
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Item icon="pin" label="العنوان">{CONTACT.address}</Item>
          <Item icon="phone" label="رقم التواصل">
            <a href={telLink} dir="ltr" className="inline-block hover:underline">{CONTACT.phone}</a>
          </Item>
        </div>

        <Tilt max={7} base={{ x: 4, y: -5 }} className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-ink p-8 text-paper shadow-float-lg">
          <div className="translate-z-8">
            <h3 className="text-2xl font-bold">محتاج استفسار عن منتج؟</h3>
            <p className="mt-2 text-silver">كلمنا مباشرة وهنساعدك تختار المنتج المناسب لشغلك.</p>
          </div>
          <div className="translate-z-12 flex flex-wrap gap-4">
            <Btn3D href={waLink()} target="_blank" rel="noopener noreferrer"><Icon name="chat" className="size-4" /> واتساب</Btn3D>
            <Btn3D href={telLink} variant="paper"><Icon name="phone" className="size-4" /> اتصل الآن</Btn3D>
            <Btn3D href={mapLink} target="_blank" rel="noopener noreferrer" variant="paper">
              <Icon name="pin" className="size-4" /> افتح الخريطة
            </Btn3D>
          </div>
        </Tilt>
      </div>
    </section>
  );
}
