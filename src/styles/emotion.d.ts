import '@emotion/react';

import { ColorType } from './theme/colors';
import { TextStylesType } from './theme/textStyles';

declare module '@emotion/react' {
  export interface Theme {
    colors: ColorType;
    textStyles: TextStylesType;
  }
}
