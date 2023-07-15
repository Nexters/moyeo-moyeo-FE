import { InputHTMLAttributes } from 'react';

import { css, cx } from '@/styled-system/css';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...restProps }: InputProps) => {
  return (
    <input
      {...restProps}
      className={cx(
        css({
          width: '100%',
          height: '50px',
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          color: 'rgb(12,13,14)',
        }),
        className,
      )}
    />
  );
};
