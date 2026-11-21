/** Shared section heading: chamfered eyebrow + title + optional hint. */
export default function SectionTitle({ eyebrow, title, hint, id }) {
  return (
    <div className="mb-8">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {hint && <p className="mt-1 text-ink/70">{hint}</p>}
    </div>
  );
}
