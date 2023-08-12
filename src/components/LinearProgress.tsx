import { css } from '@/styled-system/css';

type LinearProgressProps = {
  value: number;
  total: number;
};

const TOTAL_LENGTH = 138;

export const LinearProgress = ({ value, total }: LinearProgressProps) => {
  const progress = Math.min(
    ((value / total) * 100 * TOTAL_LENGTH) / 100,
    TOTAL_LENGTH,
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={TOTAL_LENGTH}
      height="30"
      viewBox="0 0 138 30"
      fill="none"
    >
      <rect
        width={TOTAL_LENGTH}
        height="30"
        rx="10"
        fill="white"
        fillOpacity="0.23"
      />
      <rect
        width={progress}
        height="30"
        rx="10"
        fill="#45B134"
        className={css({ transition: 'all 0.3s ease-out' })}
      />
    </svg>
  );
};
