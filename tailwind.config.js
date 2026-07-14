/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf4f0',
          100: '#fbe6de',
          200: '#f7cbbd',
          300: '#f1a88e',
          400: '#e97d5a',
          500: '#e05d33',
          600: '#cc4828',
          700: '#aa3a24',
          800: '#883326',
          900: '#702e24',
        },
      },
    },
  },
  plugins: [],
}
