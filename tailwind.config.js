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
          DEFAULT: 'var(--color-primary, #681B2C)', // Dynamic Primary Brand Color
          light: 'var(--color-primary-light, #83273B)',
          dark: 'var(--color-primary-dark, #42101E)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #42101E)',
          light: '#5E172B',
          dark: '#2B0A13',
        },
        gold: {
          DEFAULT: 'var(--color-gold, #C6A15B)', // Dynamic Accent/Gold Color
          light: 'var(--color-gold-light, #E2C78E)',
          dark: 'var(--color-gold-dark, #9E7E3C)',
          muted: '#DFD1B7',
        },
        cream: {
          DEFAULT: '#FFF8EF',
          light: '#FFFDF9',
          dark: '#F5E8D3',
        },
        brandText: {
          DEFAULT: '#1A1616', // Deep Crisp Black-Burgundy
          muted: '#4A4343',
          light: '#6E6464',
        }
      },
      fontFamily: {
        sans: ['"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
        roboto: ['"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
        cinzel: ['"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(104, 27, 44, 0.08), 0 4px 10px -2px rgba(198, 161, 91, 0.05)',
        'luxury-hover': '0 20px 35px -5px rgba(104, 27, 44, 0.15), 0 8px 16px -2px rgba(198, 161, 91, 0.1)',
      }
    },
  },
  plugins: [],
}
