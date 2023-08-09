import { useMemo } from 'react';

import trashIcon from '@/assets/icons/trash.svg';
import { css } from '@/styled-system/css';
import { center, hstack } from '@/styled-system/patterns';
import { User } from '@/types.old';

import { Chip } from './Chip';

export type ChipWithUserProps = {
  user: User;
  isPm?: boolean;
  onClickReassign?: () => void;
  onClickDelete?: () => void;
};

export const ChipWithUser = ({
  user,
  onClickReassign,
  onClickDelete,
}: ChipWithUserProps) => {
  const visual = useMemo(() => {
    if (user.id === 'pm') return 'pm';
    if (user.joinedTeamId == null) return 'none';
    return indexRoundMap[user.choices.indexOf(user.joinedTeamId)] ?? 'none';
  }, [user.choices, user.id, user.joinedTeamId]);
  const isPm = user.id === 'pm';

  return (
    <div
      className={css({
        position: 'relative',
        width: '132px',
        padding: '12px',
        backgroundColor: '#17191C',
        borderRadius: '16px',
        overflow: 'hidden',
      })}
    >
      <Chip visual={visual as any} label={user.name} />

      {!isPm && (
        <div
          className={hstack({
            justifyContent: 'space-between',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            padding: '12px',
            backgroundColor: '#17191C',
            transition: 'opacity 0.2s ease-in-out',
            opacity: 0,
            _hover: {
              opacity: 1,
            },
          })}
        >
          <button
            className={center({
              width: '72px',
              height: '30px',
              borderRadius: '8px',
              backgroundColor: '#1E6BFB',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.32px',
              color: '#fff',
              cursor: 'pointer',
            })}
            onClick={onClickReassign}
          >
            재배정
          </button>

          <button
            className={center({
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#FF453A',
              color: '#fff',
              cursor: 'pointer',
            })}
            onClick={onClickDelete}
          >
            <img width="16px" height="16px" src={trashIcon} />
          </button>
        </div>
      )}
    </div>
  );
};

const indexRoundMap: Record<number, string> = {
  0: 'first',
  1: 'second',
  2: 'third',
  3: 'fourth',
};
