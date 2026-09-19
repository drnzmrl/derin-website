/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111118',
        'surface-2': '#16161f',
        border: '#1e1e2e',
        accent: '#4FC3F7',
        'accent-dim': '#1a3a4a',
        muted: '#64748B',
        text: '#E2E8F0',
        'text-dim': '#94A3B8',
        gold: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.03) 1px, transparent 1px)",
        'grid-pattern-teal': "linear-gradient(rgba(79,195,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
