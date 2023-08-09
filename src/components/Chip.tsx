import { RecipeVariantProps, cva, cx } from '@/styled-system/css';
import { center, hstack } from '@/styled-system/patterns';

export type ChipProps = RecipeVariantProps<typeof square> & {
  label: string;
};

export const Chip = ({ visual = 'none', label }: ChipProps) => {
  const shortChar = visualShortCharMap[visual];

  return (
    <div
      className={hstack({
        height: '24px',
        gap: '10px',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '-0.32px',
        color: '#fff',
      })}
    >
      <span className={cx(center(), square({ visual }))}>{shortChar}</span>

      <span>{label}</span>
    </div>
  );
};

const visualShortCharMap = {
  first: '1',
  second: '2',
  third: '3',
  fourth: '4',
  extra: 'E',
  pm: 'P',
  none: '',
};

const square = cva({
  base: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
  },
  variants: {
    visual: {
      first: {
        backgroundColor: '#27AF49',
      },
      second: {
        backgroundColor: '#1C8537',
      },
      third: {
        backgroundColor: '#145D26',
      },
      fourth: {
        backgroundColor: '#0E431B',
      },
      extra: {
        backgroundColor: '#505762',
      },
      pm: {
        backgroundColor: '#FFB800',
      },
      none: {
        backgroundColor: '#505762', // @fixme: 임시
      },
    },
  },
});
