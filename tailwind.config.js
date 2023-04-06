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
        bounceslowonce: 'bounceslowonce .1s ease-out .5',
        slideup: 'slideup .7s ease-in-out 1',
      },
      screens: {
        '3xl': '1920px',
      },
      keyframes: {
        bounceslowonce: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        slideup: {
          '0%': { transform: 'translateY(-5rem)' },
          '80%': { transform: 'translateY(0)' },
          '90%': { transform: 'translateY(-.1rem)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  important: true,
};
