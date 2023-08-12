import { ButtonHTMLAttributes } from 'react';

import { RecipeVariantProps, cva, cx } from '@/styled-system/css';

export type ButtonProps = RecipeVariantProps<typeof button> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  color,
  size,
  className,
  ...restProps
}: ButtonProps) => {
  return (
    <button {...restProps} className={cx(className, button({ color, size }))} />
  );
};

const button = cva({
  base: {
    width: '100%',
    cursor: 'pointer',
    _disabled: {
      background: 'gray.30 !important',
      boxShadow:
        '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px rgba(12, 12, 14, 0.30) inset',
      cursor: 'not-allowed',
    },
  },
  variants: {
    color: {
      primary: {
        background: 'linear-gradient(180deg, #8060FF 0%, #5818DF 100%)',
        color: 'gray.5',
        boxShadow:
          '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px #441FE2 inset',
      },
      secondary: {
        background: 'linear-gradient(180deg, #FFAA05 0%, #FF7A00 100%)',
        color: 'gray.5',
        boxShadow:
          '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px #A13A00 inset',
      },
      green: {
        background: '#27af49',
        color: '#fff',
      },
      red: {
        background: '#e41530',
        color: '#fff',
      },
      blue: {
        background: '#0099ff',
        color: '#fff',
      },
    },
    size: {
      small: {
        height: '48px',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '20px',
        fontFamily: 'GmarketSansMedium',
      },
      medium: {
        height: '80px',
        padding: '24px',
        borderRadius: '10px',
        fontSize: '24px',
        fontFamily: 'GmarketSansBold',
      },
      large: {
        height: '180px',
        borderRadius: '20px',
        fontSize: '28px',
        padding: '24px',
        fontWeight: 800,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
});
