/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  '#FFF8F0',
          100: '#FFD4B2',
          200: '#FFBA8A',
          300: '#FF9A62',
          400: '#FF8C42',
          500: '#FF7A28',
          600: '#E06010',
        },
        mint: {
          100: '#C8E6C9',
          200: '#A8D8B9',
          300: '#7BC89A',
        },
        coral: '#FF6B6B',
        lavender: '#C9B8E8',
        text: {
          primary:   '#4A3728',
          secondary: '#8B6E63',
          light:     '#C4A99A',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(255, 140, 66, 0.12)',
        'warm':    '0 4px 16px rgba(255, 140, 66, 0.18)',
        'warm-lg': '0 8px 32px rgba(255, 140, 66, 0.24)',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in':   'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'fade-up':     'fadeUp 0.3s ease-out',
        'scale-check': 'scaleCheck 0.3s ease-out',
        'wiggle':      'wiggle 0.3s ease-in-out',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '60%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleCheck: {
          '0%':   { transform: 'scale(0)' },
          '50%':  { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
