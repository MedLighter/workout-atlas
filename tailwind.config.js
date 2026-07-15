/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#05090B',
          secondary: '#091013',
        },
        surface: {
          DEFAULT: '#101619',
          elevated: '#151D21',
          soft: '#0C1215',
        },
        border: {
          subtle: '#1D282D',
          strong: '#2A383E',
        },
        content: {
          primary: '#F5F7F8',
          secondary: '#B6BEC6',
          muted: '#747E87',
          disabled: '#4E565E',
        },
        accent: {
          DEFAULT: '#18D49B',
          bright: '#27E6B0',
          deep: '#07966F',
          hover: '#24DEAA',
          pressed: '#0CB584',
          surface: 'rgba(24,212,155,0.11)',
          border: 'rgba(39,230,176,0.32)',
        },
        warning: '#F4B740',
        error: '#F05D5E',
        info: '#5CA8FF',
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
      },
    },
  },
  plugins: [],
};
