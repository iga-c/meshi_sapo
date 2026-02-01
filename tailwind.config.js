/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF5',
        'gentle-orange': '#FFCC80', // Soft orange
        'gentle-green': '#A5D6A7', // Soft green
        'soft-gray': '#E0E0E0',
        'text-dark': '#424242',
      },
      borderRadius: {
        DEFAULT: '1rem', // Default to rounded-xl
      },
      fontFamily: {
        sans: ['"Zen Maru Gothic"', 'sans-serif'], // Planning to add rounded font if possible, but for now system sans
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
