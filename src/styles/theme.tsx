import React from 'react';

import { ThemeProvider as DefaultThemeProvider, Theme } from '@emotion/react';

import { color } from './color';
import { font } from './font';

const theme: Theme = {
  color,
  font,
};

export const ThemeProvider = (props: React.PropsWithChildren<unknown>) => {
  const { children } = props;
  return <DefaultThemeProvider theme={theme}>{children}</DefaultThemeProvider>;
};
