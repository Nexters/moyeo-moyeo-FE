import { useState } from 'react';

import warning from '@/assets/icons/warning.svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { mockTeams, mockUsers } from '@/mock/data';
import { css } from '@/styled-system/css';
import { hstack, stack, vstack } from '@/styled-system/patterns';
import { Team, User } from '@/types';

enum Round {
  '1지망',
  '2지망',
  '3지망',
  '4지망',
  '종료',
}
Round['1지망'];

const MAX_ROUND = Object.keys(Round).length / 2 - 1;

/**
 * @note 플레이어(PM)의 상태
 * @type selecting 선택중
 * @type selected 선택 완료
 * @type finish 팀빌딩 완료
 */
type PlayerState = 'selecting' | 'selected' | 'finish';

const POSITION_LIST = [
  '전체',
  '디자이너',
  'iOS',
  '안드로이드',
  '프론트엔드',
  '백엔드',
];

// const POSITION_LIST = ['전체', 'Design', 'iOS', 'Android', 'FE', 'BE'];

type filteredUsersType = {
  users: User[];
  selectedTeamId: Team['id'] | null;
  selectedRound: Round;
  selectedPosition: string;
};

const filteredUsers = ({
  users,
  selectedTeamId,
  selectedRound,
  selectedPosition,
}: filteredUsersType) => {
  return users.filter((user) => {
    if (selectedTeamId && user.choices[selectedRound] !== selectedTeamId)
      return false;
    if (selectedPosition !== '전체' && user.position !== selectedPosition)
      return false;
    return true;
  });
};

type PlayerProps = {
  teamId: Team['id'];
};

export const Player = ({ teamId }: PlayerProps) => {
  // @note: 유저 목록을 복사한 이유는 선택된 팀에 대한 정보를 반영하기 위함
  const [users, setUsers] = useState(mockUsers);
  const [playerState, setPlayerState] = useState<PlayerState>('selecting');
  const [selectedTeamId, setSelectedTeamId] = useState<Team['id'] | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round>(0);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');

  const toggleSelect = (selectUser: User) => {
    if (selectedTeamId === null)
      return alert('팀 지정 되지 않은 상태에선 선택할 수 없습니다.');
    if (selectedTeamId !== teamId) return alert('자신의 팀만 선택 가능합니다.');
    if (playerState !== 'selecting') return alert('선택할 수 없는 상태입니다.');

    const isSelected = selectUser.joinedTeamId === selectedTeamId;
    if (confirm(isSelected ? '선택해제 하시겠습니까?' : '선택 하시겠습니까?')) {
      setUsers((prev) => {
        return prev.map((user) => {
          if (user.id !== selectUser.id) return user;
          return {
            ...user,
            joinedTeamId: isSelected ? null : selectedTeamId,
          };
        });
      });
    }
  };

  const handleTeamSelectionComplete = () => {
    if (selectedRound === MAX_ROUND) return;

    setPlayerState('selected');
    // FIXME: 해당 라운드 종료가 됐다는것 서버에 알려야 함. 해당 콜백으로 setSelectedRound 호출
    setTimeout(() => {
      setSelectedRound((prev) => prev + 1);
      setPlayerState('selecting');
    }, 3000);
  };

  const handleCompleteButton = () => {
    setPlayerState('finish');
  };

  return (
    <>
      <div
        className={hstack({
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          padding: '36px 40px',
          gap: '20px',
          color: '#fff',
        })}
      >
        <nav
          className={vstack({
            flexShrink: 0,
            width: '200px',
          })}
        >
          <div
            className={vstack({
              width: '100%',
              borderRadius: '20px',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '20px',
              gap: '40px',
            })}
          >
            <img
              aria-label="서비스 로고"
              className={css({
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '10px',
              })}
              src="https://framerusercontent.com/images/TeoNhQyEXaPnI8mt5Zquak7mZI0.jpg"
            />

            <div className={stack({ width: '100%', gap: '15px' })}>
              <Button visual="secondary">현황 한눈에 보기</Button>
              <Button visual="secondary">결과 이미지 저장</Button>
              <Button
                visual="secondary"
                color="green"
                onClick={handleCompleteButton}
              >
                팀 빌딩 완료
              </Button>
            </div>
            <div
              className={hstack({
                width: '100%',
                justifyContent: 'center',
                padding: '20px',
              })}
            >
              <span className={css({ fontWeight: '700', fontSize: ' 12px' })}>
                현재 라운드
              </span>
              <b className={css({ fontWeight: '900', fontSize: '15px' })}>
                {Round[selectedRound]}
              </b>
            </div>
          </div>
          <div
            className={vstack({
              width: '100%',
              borderRadius: '20px',
              height: 'fit-content',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '20px',
              gap: '15px',
            })}
          >
            <img
              aria-label="warning 아이콘"
              src={warning}
              className={css({ width: '30px', height: '30px' })}
            />
            <div className={css({ fontWeight: '900', fontSize: '15px' })}>
              이번 라운드를 넘기면 다음 우선순위의 지망생을 확인할 수 있습니다.
            </div>
          </div>
          <div
            className={stack({
              flex: '1',
              direction: 'column-reverse',
              width: '100%',
            })}
          >
            <Button
              visual="primary"
              size="large"
              disabled={playerState !== 'selecting'}
              className={css({
                height: '100px',
              })}
              onClick={handleTeamSelectionComplete}
            >
              {playerState === 'selecting' ? '팀원 선택 완료' : '선택 완료'}
            </Button>
          </div>
        </nav>

        <section className={vstack({ flex: 1, alignItems: 'flex-start' })}>
          <h1
            className={css({
              padding: '20px',
              fontSize: '25px',
              fontWeight: 900,
            })}
          >
            NEXTERS 23기 팀 빌딩
          </h1>

          <div
            className={css({
              flex: 1,
              width: '880px',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '30px',
              borderRadius: '20px',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            })}
          >
            <div className={hstack()}>
              {POSITION_LIST.map((position) => (
                <PositionButton
                  key={position}
                  position={position}
                  selected={selectedPosition === position}
                  onClick={() => setSelectedPosition(position)}
                />
              ))}
            </div>
            <div
              className={css({
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridGap: '25px',
                marginTop: '30px',
              })}
            >
              {filteredUsers({
                users,
                selectedTeamId,
                selectedRound,
                selectedPosition,
              }).map((user) => (
                <Card
                  key={user.id}
                  name={user.name}
                  position={user.position}
                  selected={
                    selectedTeamId !== null
                      ? user.joinedTeamId === selectedTeamId
                      : user.joinedTeamId !== null
                  }
                  onClick={() => toggleSelect(user)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <aside
        className={css({
          position: 'fixed',
          top: '36px',
          right: '-20px',
          bottom: '36px',
        })}
      >
        <ul className={vstack({ gap: '15px', alignItems: 'flex-end' })}>
          {mockTeams.map((team) => (
            <li
              key={team.id}
              className={css({
                paddingLeft: '20px',
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
                lineHeight: '50px',
                backgroundColor:
                  selectedTeamId === team.id
                    ? 'rgba(15, 131, 247, 0.8)'
                    : '#0c0d0e99',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                paddingRight: selectedTeamId === team.id ? '40px' : '',
              })}
              onClick={() =>
                setSelectedTeamId((prev) => (prev === team.id ? null : team.id))
              }
            >
              {team.pmName} 팀
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

type PositionButtonProps = {
  selected: boolean;
  onClick: VoidFunction;
  position: string;
};

const PositionButton = ({
  selected,
  onClick,
  position,
}: PositionButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={css({
        background: selected ? '#0F83F7' : '#17191C',
        padding: '9px 20px',
        color: 'white',
        fontSize: '18px',
        fontWeight: '900',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s',
      })}
    >
      {position}
    </button>
  );
};
