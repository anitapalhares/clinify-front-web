/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#12a08b',
          dark: '#0c6b5d',
          light: '#e6f6f4',
        }
      }
    },
  },
  plugins: [],
}