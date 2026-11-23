import { memo } from 'react';

/**
 * Al-Omda emblem, shipped as a PNG plate (public/logo-mark.png) cut from the owner's artwork.
 * The gold stays as supplied, so the plate needs a dark surface behind it.
 */
export const LogoMark = memo(function LogoMark({ size = 52 }) {
  return (
    <img
      src="/logo-mark.png"
      width={size}
      height={size}
      alt="شعار العمدة"
      decoding="async"
      className="shrink-0"
    />
  );
});

/** `light` = for dark backgrounds (text in paper/silver). */
export default function Logo({ size = 52, light = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span className="grid leading-tight">
        <strong className={`text-xl font-bold sm:text-2xl ${light ? 'text-paper' : 'text-ink'}`}>العمدة</strong>
        <small className={`text-xs ${light ? 'text-silver' : 'text-ink/70'}`}>للديكور ومواد البناء</small>
      </span>
    </span>
  );
}
