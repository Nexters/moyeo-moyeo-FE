import { useMemo } from 'react';

import { ReactComponent as TrashBinIcon } from '@/assets/icons/trashbin.svg';
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
        width: '128px',
        padding: '12px',
        backgroundColor: 'rgba(12, 13, 14, 0.50)',
        borderRadius: '12px',
        overflow: 'hidden',
      })}
    >
      {/* @fixme: 일단 타입 체크 피하기 위해 any 잠시 사용... */}
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
            backgroundColor: 'rgb(6,7,7)', // @note: rgba(12, 13, 14, 0.50)를 rgb로 변환한 값
            transition: 'opacity 0.2s ease-in-out',
            opacity: 0,
            _hover: {
              opacity: 1,
            },
          })}
        >
          <button
            className={center({
              width: '70px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'gray.80',
              textStyle: 'h4',
              color: 'gray.5',
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
              color: 'gray.5',
              cursor: 'pointer',
              '& svg': {
                width: '16px',
                height: '16px',
              },
            })}
            onClick={onClickDelete}
          >
            <TrashBinIcon />
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
