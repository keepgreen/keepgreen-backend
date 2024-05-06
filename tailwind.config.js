/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
module.exports = {
  content: ['./src/views/*.hbs', './src/views/**/*.hbs'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      red: colors.red,
      primary: '#20E09B',
      secondary: '#19C487',
    },
  },
  plugins: [],
};
