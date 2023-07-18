import { ButtonHTMLAttributes } from 'react';

import { RecipeVariantProps, cva, cx } from '@/styled-system/css';

export type ButtonProps = RecipeVariantProps<typeof button> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  visual,
  size,
  color,
  className,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      {...restProps}
      className={cx(className, button({ visual, size, color }))}
    />
  );
};

const button = cva({
  base: {
    width: '100%',
    cursor: 'pointer',
    background: 'rgba(23, 25, 28, 0.8)',
    _disabled: {
      background: 'rgba(23, 25, 28, 0.8) !important',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    visual: {
      primary: {
        background: 'rgba(23, 25, 28, 0.8)',
        color: '#fff',
        _hover: {
          background: 'linear-gradient(180deg, #feb100 0%, #FF7A01 100%)',
        },
        _active: {
          background:
            'linear-gradient(180deg, rgba(254, 177, 0, 0.5) 0%, rgba(255, 122, 1, 0.5) 100%)',
        },
      },
      secondary: {
        background: 'rgba(23, 25, 28, 0.8)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        border: '1px solid transparent',
        transition: 'border 0.3s ease-in-out',
        _hover: {
          border: '1px solid #0F83F7',
        },
      },
    },
    size: {
      medium: {
        height: '50px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 900,
      },
      large: {
        height: '80px',
        borderRadius: '20px',
        fontSize: '23px',
        fontWeight: 900,
      },
    },
    color: {
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
  },
  defaultVariants: {
    visual: 'primary',
    size: 'medium',
  },
});
