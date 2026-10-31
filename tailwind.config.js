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
          DEFAULT: '#681B2C', // Royal Maroon
          light: '#83273B',
          dark: '#42101E',   // Deep Burgundy
        },
        secondary: {
          DEFAULT: '#42101E', // Deep Burgundy
          light: '#5E172B',
          dark: '#2B0A13',
        },
        gold: {
          DEFAULT: '#C6A15B', // Royal Gold
          light: '#E2C78E',
          dark: '#9E7E3C',
          muted: '#DFD1B7',
        },
        cream: {
          DEFAULT: '#FFF8EF',
          light: '#FFFDF9',
          dark: '#F5E8D3',
        },
        brandText: {
          DEFAULT: '#292323',
          muted: '#685F5F',
          light: '#948B8B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(104, 27, 44, 0.08), 0 4px 10px -2px rgba(198, 161, 91, 0.05)',
        'luxury-hover': '0 20px 35px -5px rgba(104, 27, 44, 0.15), 0 8px 16px -2px rgba(198, 161, 91, 0.1)',
      }
    },
  },
  plugins: [],
}
