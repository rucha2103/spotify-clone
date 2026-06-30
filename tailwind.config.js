/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: '#000000',
          dark: '#121212',
          light: '#282828',
          lighter: '#b3b3b3',
          green: '#1DB954',
          greenHover: '#1ed760',
        }
      }
    },
  },
  plugins: [],
}
