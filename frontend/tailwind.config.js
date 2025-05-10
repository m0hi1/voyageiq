/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        BaseColor: '#1D1DD7FF',
        GreenColor: '#388E3C',
        GrayColor: '#455A64',
        PurpleColor: '#1DA6CBFF',
        BHoverColor: '#4A8EE7FF',
      },
      fontFamily: {
        cursiveFont: ['Island Moments', 'cursive'],
        paraFont: ['Kalam', 'cursive'],
      },
    },
  },
  plugins: [],
};
