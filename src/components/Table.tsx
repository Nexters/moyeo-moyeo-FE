import { TableHTMLAttributes } from 'react';

import { css, cx } from '@/styled-system/css';

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

export const Table = ({ className, ...restProps }: TableProps) => {
  return (
    <table
      {...restProps}
      className={cx(
        css({
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#17191c99',
          borderRadius: '20px',
          fontSize: '15px',
          '& thead': {
            fontWeight: 'bold',
            borderBottom: '1px solid #fff9',
          },
          '& tr': {
            height: '50px',
          },
          '& th, & td': {
            textAlign: 'left',
            paddingLeft: '16px',
          },
        }),
        className,
      )}
    />
  );
};
