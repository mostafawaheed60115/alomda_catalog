import { memo } from 'react';

/**
 * Al-Omda mark: three chamfered columns (عمدة = columns / pillars) in the
 * brand palette. The slanted cut echoes the palette artwork.
 */
export const LogoMark = memo(function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="fill-royal" />
      <path d="M14 48V26l8-8v30z" className="fill-paper" />
      <path d="M26 48V18l8-8v38z" className="fill-silver" />
      <path d="M38 48V26l8-8v30z" className="fill-ink" />
    </svg>
  );
});

/** `light` = for dark backgrounds. */
export default function Logo({ size = 44, light = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span className="grid leading-tight">
        <strong className={`text-2xl font-bold ${light ? 'text-paper' : 'text-ink'}`}>العمدة</strong>
        <small className={`text-xs ${light ? 'text-silver' : 'text-ink/70'}`}>مواد البناء والعزل</small>
      </span>
    </span>
  );
}
