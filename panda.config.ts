import { defineConfig } from '@pandacss/dev';

import { colors, textStyles } from '@/styles';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    textStyles,
    tokens: { colors },
    extend: {
      keyframes: {
        moveUp: {
          '0%': { transform: 'translateY(30px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  // The output directory for your css system
  outdir: 'styled-system',
});
