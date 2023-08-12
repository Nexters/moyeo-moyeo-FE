import checkIcon from '@/assets/icons/check.svg';
import { ReactComponent as LinkIcon } from '@/assets/icons/link.svg';
import { ReactComponent as NoLinkIcon } from '@/assets/icons/noLink.svg';
import { css, cva, cx } from '@/styled-system/css';
import { center, hstack, vstack } from '@/styled-system/patterns';
import { Choice } from '@/types';

export type CardProps = {
  name: string;
  position: string;
  choice: Choice;
  border?: 'default' | 'yellow' | 'selected';
  link?: string;
  imageUrl?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const choiceRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textStyle: 'h4',
    height: '100%',
    width: '54px',
    borderRadius: '8px',
  },
  variants: {
    choice: {
      '1지망': { background: 'purple.40' },
      '2지망': { background: 'purple.50' },
      '3지망': { background: 'purple.60' },
      '4지망': { background: 'purple.70' },
      '팀 구성 조정': { background: 'gray.60' },
    },
  },
});

const cardRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.11)',
    color: 'gray.5',
    borderRadius: '20px',
    backdropFilter: 'blur(50px)',
    gap: '12px',
    transition: 'border 0.3s ease-in-out',
    position: 'relative',
  },
  variants: {
    border: {
      default: {
        border: '1px solid rgba(255, 255, 255, 0.23)',
      },
      yellow: {
        border: '2px solid token(colors.yellow.20)',
      },
      selected: {
        border: '1px solid rgba(255, 255, 255, 0.11)',
      },
    },
  },
  defaultVariants: {
    border: 'default',
  },
});

export const Card = ({
  name,
  position,
  choice,
  link,
  border,
  imageUrl = 'https://framerusercontent.com/images/Eq9Flp2bXD1AeW4UzqLfZffzM.png',
  selected = false,
  onClick,
  className,
}: CardProps) => {
  return (
    <button className={cx(cardRecipe({ border }), className)} onClick={onClick}>
      <div className={vstack({ alignItems: 'flex-start' })}>
        <div className={hstack({ gap: '6px', height: '28px' })}>
          <span className={choiceRecipe({ choice })}>
            {choice === '팀 구성 조정' ? 'E' : choice}
          </span>
          <a
            className={center({
              background: link
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(255, 255, 255, 0.09)',
              height: '100%',
              padding: '0 2px',
              borderRadius: '8px',
              cursor: link ? 'pointer' : 'default',
              transition: 'background 0.3s ease-in-out',
              _hover: {
                background: link ? 'rgba(255, 255, 255, 0.3)' : '',
              },
            })}
            href={link}
            target={link ? '_blank' : undefined}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {link ? (
              <LinkIcon />
            ) : (
              <NoLinkIcon fill="rgba(255, 255, 255, 0.5)" />
            )}
          </a>
        </div>
        <div className={vstack({ alignItems: 'flex-start', gap: '2px' })}>
          <p className={css({ textStyle: 'h3' })}>{name}</p>
          <p
            className={css({
              textStyle: 'h4',
              color: 'rgba(255, 255, 255, 0.64)',
            })}
          >
            {position}
          </p>
        </div>
      </div>
      <div
        className={css({
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          height: '100%',
        })}
      >
        <img
          className={css({
            width: '88px',
            height: '100%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: '10px',
          })}
          src={imageUrl}
        />
      </div>
      {selected && (
        <div
          className={center({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(12, 13, 14, 0.6)',
            borderRadius: '20px',
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
    </button>
  );
};
