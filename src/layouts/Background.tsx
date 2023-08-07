import { css } from '@/styled-system/css';

export type BackgroundProps = {
  src: string;
  isBlurred?: boolean;
};

export const Background = ({ src, isBlurred = false }: BackgroundProps) => {
  return (
    <div
      className={css({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      })}
    >
      <img
        className={css({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          ...(isBlurred && {
            backgroundColor: 'rgba(0,0,0,0.2)',
            filter: 'blur(20px)',
          }),
        })}
        src={src}
      />
    </div>
  );
};
