import checkIcon from '@/assets/check.svg';
import { css } from '@/styled-system/css';
import { center, vstack } from '@/styled-system/patterns';

export type CardProps = {
  name: string;
  position: string;
  imageUrl?: string;
  selected?: boolean;
  onClick?: () => void;
};

export const Card = ({
  name,
  position,
  imageUrl = 'https://framerusercontent.com/images/Z4glq7zJ6NXvB7eJvuZ8iewrbDs.png',
  selected = false,
  onClick,
}: CardProps) => {
  return (
    <button
      className={vstack({
        width: '144px',
        padding: '16px',
        backgroundColor: 'rgb(23, 25, 28)',
        color: '#fff',
        gap: '10px',
        borderRadius: '20px',
        cursor: 'pointer',
      })}
      onClick={onClick}
    >
      <div
        className={css({
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
        })}
      >
        <img
          className={css({
            width: '100%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: '10px',
          })}
          src={imageUrl}
        />
        {selected && (
          <div
            className={center({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(12, 13, 14, 0.6)',
            })}
          >
            <img
              className={css({
                width: '40px',
                height: '40px',
                objectFit: 'cover',
              })}
              src={checkIcon}
            />
          </div>
        )}
      </div>

      <div className={vstack()}>
        <p className={css({ fontSize: '14px', fontWeight: 'bold' })}>
          {position}
        </p>
        <p className={css({ fontSize: '18px', fontWeight: '900' })}>{name}</p>
      </div>
    </button>
  );
};
