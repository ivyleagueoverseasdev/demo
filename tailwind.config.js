/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FAFFE5', 100: '#F4FFC9', 200: '#E9FF8F',
          300: '#CCFF00', 400: '#B5FF00', 500: '#A3E635',
          600: '#65A30D', 700: '#4D7C0F', 800: '#3F6212',
          900: '#1A2E05', DEFAULT: '#CCFF00',
        },
        partner: {
          50:  '#FAFFE5', 100: '#F4FFC9', 200: '#E9FF8F',
          300: '#CCFF00', 400: '#B5FF00', 500: '#A3E635',
          600: '#65A30D', 700: '#4D7C0F', 800: '#3F6212',
          900: '#1A2E05', DEFAULT: '#B5FF00',
        },
        // Homepage body sections only — header/hero/footer keep the lime "primary" palette above.
        homeblue: {
          50:  '#EBF2FF', 100: '#D6E6FF', 200: '#ADCCFF',
          300: '#7AADFF', 400: '#5A8CFF', 500: '#246DFF',
          600: '#1A5CE8', 700: '#1249C4', 800: '#0C37A0',
          900: '#07257C', 950: '#051A57', DEFAULT: '#246DFF',
        },
        amber: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A',
          300: '#FCD34D', 400: '#FBBF24', 500: '#D97706',
          600: '#B45309', 700: '#92400E',
          DEFAULT: '#D97706',
        },
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        dm:      ['var(--font-dm)',      'system-ui', 'sans-serif'],
        bruno:   ['var(--font-bruno)',   'Georgia',   'serif'],
      },
      screens: {
        xs: '480px', sm: '640px', md: '768px',
        lg: '1024px', xl: '1280px', '2xl': '1536px',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.08),0 16px 40px rgba(0,0,0,0.10)',
        blue:       '0 8px 30px rgba(77,124,15,0.25)',
        lime:       '0 8px 30px rgba(204,255,0,0.35)',
        amber:      '0 8px 30px rgba(217,119,6,0.30)',
      },
      animation: {
        'fade-up':        'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':        'fadeIn 0.5s ease forwards',
        float:            'float 6s ease-in-out infinite',
        'pulse-dot':      'pulseDot 2s ease-in-out infinite',
        'review-scroll':  'reviewScroll 35s linear infinite',
        'review-reverse': 'reviewScrollReverse 38s linear infinite',
        slideUp:          'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeUp:              { from:{ opacity:'0',transform:'translateY(24px)' }, to:{ opacity:'1',transform:'translateY(0)' } },
        fadeIn:              { from:{ opacity:'0' }, to:{ opacity:'1' } },
        slideUp:             { from:{ opacity:'0',transform:'translateY(16px)' }, to:{ opacity:'1',transform:'translateY(0)' } },
        float:               { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-12px)' } },
        pulseDot:            { '0%,100%':{ opacity:'1',transform:'scale(1)' }, '50%':{ opacity:'0.5',transform:'scale(0.85)' } },
        reviewScroll:        { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
        reviewScrollReverse: { '0%':{ transform:'translateX(-50%)' }, '100%':{ transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
