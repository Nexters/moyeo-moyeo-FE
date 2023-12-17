import { RecipeVariantProps, cva, cx } from '@/styled-system/css';
import { center, hstack } from '@/styled-system/patterns';

export type ChipProps = RecipeVariantProps<typeof square> & {
  label: string;
};
export type ChipVisual = NonNullable<ChipProps['visual']>;

export const Chip = ({ visual = 'none', label }: ChipProps) => {
  const shortChar = visualShortCharMap[visual];

  return (
    <div
      className={hstack({
        height: '28px',
        gap: '8px',
        textStyle: 'p2',
        letterSpacing: '-0.32px',
        color: 'gray.5',
      })}
    >
      <span className={cx(center({ flexShrink: '0' }), square({ visual }))}>
        {shortChar}
      </span>

      <span>{label}</span>
    </div>
  );
};

const visualShortCharMap: Record<ChipVisual, string> = {
  first: '1',
  second: '2',
  third: '3',
  fourth: '4',
  adjust: 'E',
  pm: 'P',
  none: '',
};

const square = cva({
  base: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    textStyle: 'h4',
    color: 'gray.5',
  },
  variants: {
    visual: {
      first: {
        backgroundColor: 'purple.40',
      },
      second: {
        backgroundColor: 'purple.50',
      },
      third: {
        backgroundColor: 'purple.60',
      },
      fourth: {
        backgroundColor: 'purple.70',
      },
      adjust: {
        backgroundColor: 'gray.70',
      },
      pm: {
        backgroundColor: 'yellow.80',
      },
      none: {
        backgroundColor: 'gray.70', // @fixme: 임시
      },
    },
  },
});
