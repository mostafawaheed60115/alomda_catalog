import SectionTitle from './SectionTitle';
import { Tilt } from './ui3d';

/** Owner's own wording, kept verbatim. */
const ABOUT_TEXT =
  'وجهتك الموثوقة لأحدث حلول مواد البناء ومستلزمات التشطيب والديكور. نوفر منتجات عالمية معتمدة وأنظمة متكاملة للتأسيس واللصق والعزل والديكور تضمن أعلى مستويات الجودة والاحترافية في كل مشروع، مدعومة بخبرة حقيقية والتزام تام برضا عملائنا';

// Highlights only restate the paragraph above. They add no new claims or numbers.
const HIGHLIGHTS = [
  'منتجات عالمية معتمدة',
  'أنظمة متكاملة: تأسيس، لصق، عزل، ديكور',
  'جودة واحترافية في كل مشروع',
  'خبرة حقيقية والتزام برضا العملاء',
];

/** About section: the owner's paragraph plus four 3D highlight cards that restate it. */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle id="about-title" eyebrow="من نحن" title="شركة العمدة لمواد البناء الحديث والديكور" />
      <p className="max-w-3xl text-lg leading-relaxed text-ink/80">{ABOUT_TEXT}</p>

      {/* One column on phones, two on tablets, four on desktop. */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((text) => (
          <li key={text}>
            <Tilt max={10} wrapperClassName="h-full">
              <div className="h-full rounded-2xl bg-white p-5 font-semibold text-ink shadow-edge-royal-sm ring-1 ring-silver">
                {text}
              </div>
            </Tilt>
          </li>
        ))}
      </ul>
    </section>
  );
}
