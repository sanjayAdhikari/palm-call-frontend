/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    colors: {
      primary: "#0D0D0D",
      lightGray: "#B0B0B0",
      bgSecondary:"#EFEFEF",
      bgPrimary:"#FEFFFE",
      success:"#52C419",
      ash: {
        50: '#F5F5F5', // eeeeee — Fog Horizon
        100: '#EEEEEE', // eeeeee — Fog Horizon
        200: '#DDDDDD', // dddddd — Urban Smoke
        300: '#CCCCCC', // CCCCC — Cement Mist
        400: '#BBBBBB', // BBBBB — Bold Graphite
        500: '#AAAAAA', // aaaaaa — Ash Whisper
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
