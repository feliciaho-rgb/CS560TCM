/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: '#9EA48A',
        ivory: '#F7F1E9',
        sand: '#E8D8C0',
        wood: '#BDA183',
        gold: '#C8B68A',
        forest: '#4B5E4A',
        neutral: {
          100: '#FAF6F0',
          200: '#EFE6D8',
          300: '#D8C8B4',
          400: '#B8A388',
          500: '#8F7A61'
        }
      },
      boxShadow: {
        soft: '0 20px 50px rgba(21, 26, 25, 0.12)',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
