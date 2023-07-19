import { RecipeVariantProps, css, cva } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';

export type CardInAdminProps = {
  name: string;
  position: string;
  selectedRound: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const CardInAdmin = ({
  name,
  position,
  selectedRound,
  selected = false,
  disabled = false,
  onClick,
}: CardInAdminProps) => {
  return (
    <div
      className={hstack({
        position: 'relative',
        gap: '15px',
        height: '55px',
        padding: '10px 20px',
        backgroundColor: 'rgba(12, 13, 14, 0.6)',
        borderRadius: '10px',
        lineHeight: 1,
      })}
    >
      <span className={css({ fontSize: '18px', fontWeight: 600 })}>{name}</span>
      <span className={css({ fontSize: '12px', fontWeight: 700 })}>
        {position}
      </span>
      {selectedRound >= 0 && (
        <span className={badge({ visual: roundIndexToVisual[selectedRound] })}>
          {selectedRound + 1} 지망
        </span>
      )}

      <button
        className={css({
          position: 'absolute',
          top: '10px',
          bottom: '10px',
          left: '15px',
          right: '15px',
          backgroundColor: selected ? 'rgb(228, 21, 48)' : 'rgb(34, 102, 255)',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 800,
          color: '#fff',
          opacity: 0,
          transition: '0.3s',
          _hover: {
            opacity: 1,
            cursor: 'pointer',
          },
        })}
        disabled={disabled}
        onClick={onClick}
      >
        {selected ? '배정 해제' : '팀 배정'}
      </button>
    </div>
  );
};

// @fixme: 아래 색상들을 theme에 선언해서 variation 적용하지 않아도 되도록 수정할 것!
const badge = cva({
  base: {
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 700,
    background: 'transparent',
  },
  variants: {
    visual: {
      first: {
        background: 'rgb(34, 102, 255)',
      },
      second: {
        background: '#28af4a',
      },
      third: {
        background: '#feb100',
      },
      fourth: {
        background: '#441fe2',
      },
    },
  },
});

type BadgeVisual = NonNullable<RecipeVariantProps<typeof badge>>['visual'];

const roundIndexToVisual: Record<number, BadgeVisual> = {
  0: 'first',
  1: 'second',
  2: 'third',
  3: 'fourth',
};
