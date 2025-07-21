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
          50: '#FFF2ED',
          100: '#FFE4D6',
          200: '#FFC9AE',
          300: '#FFA57A',
          400: '#FF7744',
          500: '#FF6B35',
          600: '#E5561B',
          700: '#BF4517',
          800: '#99391A',
          900: '#7D3218'
        },
        secondary: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#2D3E50'
        },
        accent: {
          50: '#E6F7FF',
          100: '#BAE7FF',
          200: '#91D5FF',
          300: '#69C0FF',
          400: '#40A9FF',
          500: '#00B4D8',
          600: '#0096C7',
          700: '#0077B6',
          800: '#023E8A',
          900: '#03045E'
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'nav': '0 2px 8px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}