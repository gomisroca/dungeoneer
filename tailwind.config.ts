import { type Config } from 'tailwindcss';

import colors from 'tailwindcss/colors';

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    colors: {
      background: colors.stone,
      primary: colors.cyan,
      highlight: colors.orange,
    },
  },
  content: ['./src/**/*.tsx'],
  darkMode: ['class'],
  plugins: [],
} satisfies Config;
