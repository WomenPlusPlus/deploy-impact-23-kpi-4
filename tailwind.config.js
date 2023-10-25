/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryYellow: '#FECC33',
        primaryGreen: '#1FA5A6',
        text: '#2D373D',
      },
      fontFamily: {
        Montserrat: ['Montserrat', 'serif'],
      },
    },
  },
  plugins: [],
}

