/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#107C41',
          700: '#0D5C3A',
          800: '#0A462B'
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706'
        }
      }
    },
  },
  plugins: [],
}
