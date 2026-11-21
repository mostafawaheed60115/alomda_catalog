import { useTilt } from '../hooks/useTilt';

/**
 * Tilt: a perspective wrapper + a pointer-tilting 3D surface.
 * Children may use `translate-z-*` to pop out of the surface.
 * Note: never put `overflow-hidden` on the surface itself, it flattens the 3D context.
 */
export function Tilt({ max = 8, base, className = '', wrapperClassName = '', children, ...rest }) {
  const t = useTilt(max);
  const style = base ? { '--bx': `${base.x}deg`, '--by': `${base.y}deg` } : undefined;
  return (
    <div className={`perspective-1000 ${wrapperClassName}`} onPointerMove={t.onPointerMove} onPointerLeave={t.onPointerLeave}>
      <div ref={t.ref} className={`tilt ${className}`} style={style} {...rest}>
        {children}
      </div>
    </div>
  );
}

const VARIANTS = {
  royal: 'bg-royal text-paper shadow-edge-royal hover:shadow-edge-royal active:shadow-edge-royal-sm',
  ink: 'bg-ink text-paper shadow-edge-ink hover:shadow-edge-ink active:shadow-edge-ink-sm',
  paper: 'bg-paper text-ink shadow-edge-paper hover:shadow-edge-paper active:shadow-edge-paper-sm',
};

/** Extruded 3D button: lifts on hover, presses down on click. Renders <a> when `href` is set. */
export function Btn3D({ variant = 'royal', className = '', href, children, ...rest }) {
  const Tag = href ? 'a' : 'button';
  const extra = href ? {} : { type: 'button' };
  return (
    <Tag
      href={href}
      {...extra}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-150 hover:-translate-y-0.5 active:translate-y-1 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}
