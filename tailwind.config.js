/** @type {import('tailwindcss').Config} */
/* Renkler src/config/theme.config.js dosyasından gelir.
   Burayı düzenlemene gerek yok — tema dosyasını düzenle. */
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: c('space'),
        atmosphere: c('atmosphere'),
        dawn: c('dawn'),
        horizon: c('horizon'),
        accent: c('accent'),
        warm: c('warm'),
        text: c('text'),
        'text-dim': c('textDim'),
        muted: c('muted'),
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius)',
        soft: 'var(--radius-sm)',
      },
      backdropBlur: {
        glass: 'var(--blur)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        drift: 'drift 18s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
