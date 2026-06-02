/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Channel format so opacity modifiers (e.g. text-ivory/90) work.
        ivory: 'rgb(var(--ivory-rgb) / <alpha-value>)',
        'ivory-soft': 'rgb(var(--ivory-soft-rgb) / <alpha-value>)',
        'maroon-deep': 'rgb(var(--maroon-deep-rgb) / <alpha-value>)',
        maroon: 'rgb(var(--maroon-rgb) / <alpha-value>)',
        'maroon-silk': 'rgb(var(--maroon-silk-rgb) / <alpha-value>)',
        'zari-gold': 'rgb(var(--zari-gold-rgb) / <alpha-value>)',
        'zari-light': 'rgb(var(--zari-light-rgb) / <alpha-value>)',
        'peacock-blue': 'rgb(var(--peacock-blue-rgb) / <alpha-value>)',
        'peacock-teal': 'rgb(var(--peacock-teal-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
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
