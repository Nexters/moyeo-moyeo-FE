import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  html: {
    fontFamily: 'pretendard',
  },
});

export default defineConfig({
  globalCss,
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        // @ref: https://panda-css.com/docs/guides/fonts#update-panda-config
        fonts: {
          pretendard: { value: 'var(--font-pretendard)' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
