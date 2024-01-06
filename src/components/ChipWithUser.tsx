import { useMemo } from 'react';

import TrashBinIcon from '@/assets/icons/trashbin.svg?react';
import { css } from '@/styled-system/css';
import { center, hstack } from '@/styled-system/patterns';
import { Round, User } from '@/types';

import { Chip, ChipVisual } from './Chip';

export type ChipWithUserProps = {
  user: User;
  isShowButton: boolean;
  onClickReassign?: () => void;
  onClickDelete?: () => void;
};

export const ChipWithUser = ({
  user,
  onClickReassign,
  isShowButton,
  onClickDelete,
}: ChipWithUserProps) => {
  const visual = useMemo<ChipVisual>(() => {
    if (user.uuid === 'pm') return 'pm';
    if (user.joinedTeamUuid == null) return 'none';
    if (user.selectedRound != null) return roundVisualMap[user.selectedRound];
    const inferredVisual = indexRoundMap[
      user.choices.indexOf(user.joinedTeamUuid)
    ] as ChipVisual;
    return inferredVisual ?? 'adjust';
  }, [user.uuid, user.joinedTeamUuid, user.selectedRound, user.choices]);

  return (
    <div
      title={`uuid: ${user.uuid}`}
      className={css({
        position: 'relative',
        width: '128px',
        padding: '12px',
        backgroundColor: 'rgba(12, 13, 14, 0.50)',
        borderRadius: '12px',
        overflow: 'hidden',
      })}
    >
      <Chip visual={visual} label={user.userName} />

      {isShowButton && (
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

const roundVisualMap: Record<Round, ChipVisual> = {
  FIRST_ROUND: 'first',
  SECOND_ROUND: 'second',
  THIRD_ROUND: 'third',
  FORTH_ROUND: 'fourth',
  ADJUSTED_ROUND: 'adjust',
  COMPLETE: 'none',
};
