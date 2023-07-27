import { css } from '@emotion/react';

const defaultFont = css`
  font-family: 'Pretendard';
  line-height: '1.5';
`;

export const font = {
  h1: css`
    ${defaultFont}
    font-size: 1.6rem;
    font-weight: 600;
  `,
  h2: css`
    ${defaultFont}
    font-size: 1.4rem;
    font-weight: 600;
  `,
};
