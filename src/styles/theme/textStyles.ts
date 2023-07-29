const FONT_WEIGHT = {
  BLACK: '900',
  EXTRA_BOLD: '800',
  BOLD: '700',
  SEMI: '600',
  MEDIUM: '500',
  NORMAL: '400',
  LIGHT: '300',
  EXTRA_LIGHT: '200',
  THIN: '100',
};

const textStyles = {
  h1: {
    fontSize: '1.6rem',
    fontWeight: FONT_WEIGHT.SEMI,
    lineHeight: '1.5',
  },
  h2: {
    fontSize: '1.4rem',
    fontWeight: FONT_WEIGHT.SEMI,
    lineHeight: '1.5',
  },
} as const;

export type TextStylesType = typeof textStyles;

export default textStyles;
