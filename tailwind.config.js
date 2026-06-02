/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'var(--ivory)',
        'ivory-soft': 'var(--ivory-soft)',
        'maroon-deep': 'var(--maroon-deep)',
        maroon: 'var(--maroon)',
        'maroon-silk': 'var(--maroon-silk)',
        'zari-gold': 'var(--zari-gold)',
        'zari-light': 'var(--zari-light)',
        'peacock-blue': 'var(--peacock-blue)',
        'peacock-teal': 'var(--peacock-teal)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        roman: ['Cinzel', 'serif'],
        telugu: ['"Tiro Telugu"', 'serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        roman: '0.32em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
