import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Config } from 'tailwindcss';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extendedTheme = {
  colors: {
    border: 'var(--border)',
    input: {
      DEFAULT: 'var(--input)',
      invalid: 'var(--input-invalid)',
    },
    ring: {
      DEFAULT: 'var(--ring)',
      invalid: 'var(--foreground-danger)',
    },
    background: 'var(--background)',
    foreground: {
      DEFAULT: 'var(--foreground)',
      danger: 'var(--foreground-danger)',
    },
    primary: {
      DEFAULT: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
    },
    secondary: {
      DEFAULT: 'var(--secondary)',
      foreground: 'var(--secondary-foreground)',
    },
    destructive: {
      DEFAULT: 'var(--destructive)',
      foreground: 'var(--destructive-foreground)',
    },
    muted: {
      DEFAULT: 'var(--muted)',
      foreground: 'var(--muted-foreground)',
    },
    accent: {
      DEFAULT: 'var(--accent)',
      foreground: 'var(--accent-foreground)',
    },
    warning: {
      DEFAULT: 'var(--warning)',
      foreground: 'var(--warning-foreground)',
    },
    success: {
      DEFAULT: 'var(--success)',
      foreground: 'var(--success-foreground)',
    },
    popover: {
      DEFAULT: 'var(--popover)',
      foreground: 'var(--popover-foreground)',
    },
    card: {
      DEFAULT: 'var(--card)',
      foreground: 'var(--card-foreground)',
    },

    back_black: {
      DEFAULT: '#252E42',
    },
    fore_black: {
      DEFAULT: '#2F3B52',
    },

    accent_salmon: {
      DEFAULT: '#f9b4ab',
    },
    accent_tan: {
      DEFAULT: '#fdebd3',
    },
    accent_blue: {
      DEFAULT: '#264e70',
    },
    accent_dark_green: {
      DEFAULT: '#679186',
    },
    accent_light_green: {
      DEFAULT: '#bbd4ce',
    },
  },
  keyframes: {
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' },
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' },
    },
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
  },
  gridTemplateColumns: {
    sidebar: '300px auto', // for sidebar layout. adds grid-cols-sidebar class
  },
  gridTemplateRows: {
    header: '64px auto', // for the navbar layout. adds grid-rows-header class
  },
} satisfies Config['theme'];
