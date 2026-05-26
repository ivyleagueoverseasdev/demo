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
          50:  '#EBF4FF', 100: '#DBEAFE', 200: '#BFDBFE',
          300: '#93C5FD', 500: '#2D5A99', 600: '#1A365D',
          700: '#0F2247', 800: '#071630', 900: '#030B18',
          DEFAULT: '#1A365D',
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
      },
      screens: {
        xs: '480px', sm: '640px', md: '768px',
        lg: '1024px', xl: '1280px', '2xl': '1536px',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.08),0 16px 40px rgba(0,0,0,0.10)',
        blue:       '0 8px 30px rgba(26,54,93,0.20)',
        amber:      '0 8px 30px rgba(217,119,6,0.30)',
      },
      animation: {
        'fade-up':        'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':        'fadeIn 0.5s ease forwards',
        float:            'float 6s ease-in-out infinite',
        'pulse-dot':      'pulseDot 2s ease-in-out infinite',
        'review-scroll':  'reviewScroll 35s linear infinite',
        'review-reverse': 'reviewScrollReverse 38s linear infinite',
      },
      keyframes: {
        fadeUp:              { from:{ opacity:'0',transform:'translateY(24px)' }, to:{ opacity:'1',transform:'translateY(0)' } },
        fadeIn:              { from:{ opacity:'0' }, to:{ opacity:'1' } },
        float:               { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-12px)' } },
        pulseDot:            { '0%,100%':{ opacity:'1',transform:'scale(1)' }, '50%':{ opacity:'0.5',transform:'scale(0.85)' } },
        reviewScroll:        { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
        reviewScrollReverse: { '0%':{ transform:'translateX(-50%)' }, '100%':{ transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
