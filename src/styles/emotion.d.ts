import '@emotion/react';

import { color } from './color';
import { font } from './font';

declare module '@emotion/react' {
  export interface Theme {
    color: typeof color;
    font: typeof font;
  }
}
