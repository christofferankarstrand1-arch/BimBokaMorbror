/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm': {
          50: '#fdf8f3',
          100: '#faeee3',
          200: '#f5dcc6',
          300: '#eec5a0',
          400: '#e5a673',
          500: '#dd8a4c',
          600: '#cf7241',
          700: '#ac5a37',
          800: '#8a4a32',
          900: '#703e2b',
        },
        'sage': {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c8d7c8',
          300: '#a3bba3',
          400: '#789878',
          500: '#5a7a5a',
          600: '#466146',
          700: '#3a4f3a',
          800: '#314031',
          900: '#2a352a',
        }
      }
    },
  },
  plugins: [],
}
