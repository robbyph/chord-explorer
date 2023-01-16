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
    },
  },
  plugins: [],
  important: true,
};
