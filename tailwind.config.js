// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme.js'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#EAF2FF',
          '100': '#D6E4FF',
          '200': '#ADC9FF',
          '300': '#85ADFF',
          '400': '#5C92FF',
          '500': '#3377FF',
          '600': '#0057FF', // Cor Primária
          '700': '#0046CC',
          '800': '#003599',
          '900': '#002466',
          '950': '#001A4D',
        },
        success: { // Cor Positiva
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#1DB954',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
        },
        danger: { // Cor Negativa
          '50': '#fff1f2',
          '100': '#ffe4e6',
          '200': '#fecdd3',
          '300': '#fda4af',
          '400': '#fb7185',
          '500': '#FF4D4F',
          '600': '#e11d48',
          '700': '#be123c',
          '800': '#9f1239',
          '900': '#881337',
        },
        neutral: '#4DA6FF',
        'text-secondary': '#3A3A3A',
        'bg-secondary': '#F5F6F8',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    }
  },
  plugins: [],
};
