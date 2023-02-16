/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        HindSiliguri: ['Hind Siliguri', 'sans'],
        IBMPlexSans: ['IBM Plex Sans', 'sans'],
      },
      animation: {
        bounceslowonce: 'bounceslowonce .1s ease-in-out .5',
      },
      keyframes: {
        bounceslowonce: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
  important: true,
};
