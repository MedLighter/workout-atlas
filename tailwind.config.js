/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
        zinc: {
          50: '#FAFAFA',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          950: '#064E3B',
        },
        amber: {
          500: '#F59E0B',
        },
        red: {
          500: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};