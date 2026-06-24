/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals — easy on the eyes
        stone: {
          50:  '#FFFFFF',
          100: '#FBF8F2', // page background (warm cream)
          150: '#F5F0E5', // subtle surface
          200: '#EDE5D4', // dividers, borders
          300: '#D9CFB8', // hover borders
          400: '#B5A88C', // muted text
          500: '#8C7E64', // secondary text
          600: '#6B5F4A', // tertiary text
          700: '#4A4234', // primary text
          800: '#2D2820', // headings
          900: '#1A1714', // darkest
        },
        // Refined amber accent — ties to logo red, sophisticated
        amber: {
          50:  '#FDF6EC',
          100: '#FAE8CC',
          200: '#F2D29A',
          300: '#E8B66A',
          400: '#D99442',
          500: '#C17728', // primary
          600: '#A85F1F',
          700: '#874A18',
          800: '#643812',
          900: '#42260C',
        },
        // Muted indigo — ties to logo blue
        indigo: {
          50:  '#F1F4F8',
          100: '#DFE5EE',
          200: '#BFCEDC',
          300: '#94AAC3',
          400: '#6E89A6',
          500: '#4D6A8B',
          600: '#3A5470',
          700: '#2C4258',
          800: '#1F2F40',
          900: '#141F2C',
        },
        // Muted terracotta for errors — replaces bright red
        clay: {
          50:  '#FAF2F0',
          100: '#F5E0DC',
          200: '#EBC1B9',
          300: '#DD9F93',
          400: '#C77A6B',
          500: '#A85A4A', // primary
          600: '#8B4536',
          700: '#6E3528',
          800: '#52271D',
          900: '#391A12',
        },
        // Sage for success (low stock indicator / success)
        sage: {
          50:  '#F2F5F0',
          100: '#E0E8DC',
          200: '#C2D2BB',
          300: '#9DB595',
          400: '#78966F',
          500: '#587A50',
          600: '#44613D',
          700: '#34492F',
          800: '#243322',
          900: '#161F15',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.03em',
      },
      boxShadow: {
        // Color-tinted, low-opacity layered shadows
        'stone-xs': '0 1px 2px rgba(74, 66, 52, 0.04)',
        'stone-sm': '0 1px 2px rgba(74, 66, 52, 0.05), 0 1px 3px rgba(74, 66, 52, 0.04)',
        'stone-md': '0 2px 4px rgba(74, 66, 52, 0.05), 0 4px 8px rgba(74, 66, 52, 0.06)',
        'stone-lg': '0 4px 8px rgba(74, 66, 52, 0.06), 0 10px 20px rgba(74, 66, 52, 0.08)',
        'stone-xl': '0 8px 16px rgba(74, 66, 52, 0.07), 0 20px 40px rgba(74, 66, 52, 0.10)',
        'amber-glow': '0 0 0 1px rgba(193, 119, 40, 0.12), 0 8px 24px rgba(193, 119, 40, 0.18)',
        'inner-soft': 'inset 0 1px 2px rgba(74, 66, 52, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer': 'shimmer 2.4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}