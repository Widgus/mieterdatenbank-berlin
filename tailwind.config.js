/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#141413',
          2: '#3C3B3A',
          3: '#7A7977',
        },
        parchment: {
          DEFAULT: '#FAF9F5',
          2: '#F0EFEA',
          3: '#E8E7E2',
        },
        primary: {
          DEFAULT: '#162660',
          bright: '#3454F5',
          50: '#E8F3FE',
          100: '#D0E6FD',
          200: '#B8D4F0',
          300: '#3F6DAD',
          400: '#3454F5',
          500: '#162660',
          600: '#111E4D',
          700: '#0D173A',
          800: '#081027',
          900: '#040814',
        },
        glow: {
          DEFAULT: '#D0E6FD',
          light: '#E8F3FE',
        },
        secondary: '#F1E4D1',
        accent: {
          DEFAULT: '#3F6DAD',
          light: '#B8D4F0',
        },
        success: '#10b981',
        error: '#E5484D',
      },
      borderRadius: {
        'card': '20px',
        'sm-card': '14px',
        'btn': '10px',
        'pill': '100px',
      },
      letterSpacing: {
        'headline': '-0.02em',
        'section': '0.1em',
      },
    },
  },
  plugins: [],
}
