/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        warm: {
          50: '#fef9f3',
          100: '#f5ebe0',
          200: '#e8dfd5',
          300: '#d5c4a1',
          400: '#c4a574',
          500: '#8b7355',
          600: '#8b5a2b',
          700: '#5d4e37',
          800: '#2d3436',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      backgroundImage: {
        'warm-gradient':
          'linear-gradient(135deg, #fef9f3 0%, #f5ebe0 30%, #e8dfd5 60%, #d5c4a1 100%)',
        'nav-fade': 'linear-gradient(to bottom, rgba(254,249,243,0.95), transparent)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
        progress: {
          '0%': {transform: ' translateX(0) scaleX(0)'},
          '40%': {transform: 'translateX(0) scaleX(0.4)'},
          '100%': {transform: 'translateX(100%) scaleX(0.5)'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        progress: 'progress 1s infinite linear',
      },
      transformOrigin: {
        'left-right': '0% 50%',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#5d4e37',
            '[class~="lead"]': {color: '#5d4e37'},
            a: {color: '#8b5a2b'},
            strong: {color: '#2d3436'},
            'a strong': {color: '#8b5a2b'},
            'blockquote strong': {color: '#2d3436'},
            'thead th strong': {color: '#2d3436'},
            'ol > li::marker': {color: '#5d4e37'},
            'ul > li::marker': {color: '#5d4e37'},
            dt: {color: '#2d3436'},
            blockquote: {color: '#5d4e37'},
            h1: {color: '#2d3436'},
            'h1 strong': {color: '#2d3436'},
            h2: {color: '#2d3436'},
            'h2 strong': {color: '#2d3436'},
            h3: {color: '#2d3436'},
            'h3 strong': {color: '#2d3436'},
            h4: {color: '#2d3436'},
            'h4 strong': {color: '#2d3436'},
            kbd: {color: '#5d4e37'},
            code: {color: '#5d4e37'},
            'a code': {color: '#8b5a2b'},
            'h1 code': {color: '#2d3436'},
            'h2 code': {color: '#2d3436'},
            'h3 code': {color: '#2d3436'},
            'h4 code': {color: '#2d3436'},
            'blockquote code': {color: '#5d4e37'},
            'thead th code': {color: '#2d3436'},
            pre: {color: '#5d4e37'},
            'pre code': {color: '#5d4e37'},
            'thead th': {color: '#2d3436'},
            figcaption: {color: '#8b7355'},
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
