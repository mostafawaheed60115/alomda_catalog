import plugin from 'tailwindcss/plugin';
import tailwind3d from 'tailwindcss-3d'; // rotate-x/y, translate-z, perspective, transform-style-3d

/**
 * Brand palette (assets/colorpalette.jpeg):
 *   Deep Royal Blue #0010A4 | Pure White #F6F6F6 | Light Silver #BEBDBA | Soft Black #1E1E1E
 * Only addition: `royal-deep` (#000B75), a darker shade of the blue used for 3D button edges.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        royal: { DEFAULT: '#0010A4', deep: '#000B75' },
        paper: '#F6F6F6',
        silver: '#BEBDBA',
        ink: '#1E1E1E',
      },
      fontFamily: { sans: ['Cairo', 'Tahoma', 'sans-serif'] },
      boxShadow: {
        // "Extruded" edges: a solid offset shadow reads as the thickness of a 3D slab.
        'edge-royal': '0 6px 0 #000B75, 0 14px 22px -6px rgb(0 16 164 / .45)',
        'edge-royal-sm': '0 2px 0 #000B75',
        'edge-ink': '0 6px 0 #000000, 0 14px 22px -6px rgb(30 30 30 / .45)',
        'edge-ink-sm': '0 2px 0 #000000',
        'edge-paper': '0 6px 0 #BEBDBA, 0 14px 22px -6px rgb(30 30 30 / .25)',
        'edge-paper-sm': '0 2px 0 #BEBDBA',
        float: '0 28px 40px -22px rgb(0 16 164 / .35), 0 10px 16px -8px rgb(30 30 30 / .22)',
        'float-lg': '0 44px 60px -28px rgb(0 16 164 / .5), 0 16px 24px -10px rgb(30 30 30 / .3)',
      },
    },
  },
  plugins: [
    tailwind3d,
    // Brand shapes taken from the palette artwork (chamfered top-start / bottom-end corners).
    plugin(({ addUtilities }) => {
      addUtilities({
        '.clip-pillar': { 'clip-path': 'polygon(0 22%, 45% 0, 100% 0, 100% 78%, 55% 100%, 0 100%)' },
        '.clip-chip': { 'clip-path': 'polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)' },
      });
    }),
  ],
};
