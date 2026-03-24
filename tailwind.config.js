/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e8f4f4',
          100: '#d1e9e9',
          200: '#a3d3d3',
          300: '#75bdbd',
          400: '#47a7a7',
          500: '#0D6E6E',
          600: '#0b5858',
          700: '#084242',
          800: '#062c2c',
          900: '#031616',
        },
      },
    },
  },
  plugins: [],
}
