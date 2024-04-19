import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme.js';
import animatePlugin from 'tailwindcss-animate';
import radixPlugin from 'tailwindcss-radix';
import { extendedTheme } from './app/styles/extended-theme.ts';

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      ...extendedTheme,
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [animatePlugin, radixPlugin],
} satisfies Config;
