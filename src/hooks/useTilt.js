import { useCallback, useEffect, useRef } from 'react';

/**
 * Pointer-driven 3D tilt. Writes CSS variables straight to the DOM (no React
 * re-render per mouse move). Mouse only: touch/pen scrolling stays untouched.
 */
export function useTilt(max = 8) {
  const ref = useRef(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (clientX - r.left) / r.width - 0.5;
        const y = (clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        el.classList.add('is-active');
      });
    },
    [max],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('is-active');
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
