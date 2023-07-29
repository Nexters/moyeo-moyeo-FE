import { extendTheme } from '@chakra-ui/react';

import colors from './colors';
import textStyles from './textStyles';

const theme = extendTheme({
  colors,
  textStyles,
});

export default theme;
