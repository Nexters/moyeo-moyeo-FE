import checkIcon from '@/assets/icons/check.svg';
import { css } from '@/styled-system/css';
import { center, hstack, vstack } from '@/styled-system/patterns';

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
  imageUrl = 'https://framerusercontent.com/images/Eq9Flp2bXD1AeW4UzqLfZffzM.png',
  selected = false,
  onClick,
}: CardProps) => {
  return (
    <button
      className={hstack({
        justifyContent: 'space-between',
        width: '275px',
        padding: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        color: 'gray.5',
        borderRadius: '20px',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.23)',
        transition: 'border 0.3s ease-in-out',
        _hover: {
          border: '1px solid #0F83F7',
        },
      })}
      onClick={onClick}
    >
      <div className={vstack({ alignItems: 'flex-start' })}>
        <span
          className={css({
            textStyle: 'h4',
            paddingX: '10px',
            borderRadius: '6px',
            backgroundColor: 'green.70',
          })}
        >
          1지망
        </span>
        <p className={css({ textStyle: 'h4' })}>{position}</p>
        <p className={css({ textStyle: 'h3' })}>{name}</p>
      </div>
      <div
        className={css({
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
        })}
      >
        <img
          className={css({
            width: '120px',
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
    </button>
  );
};
