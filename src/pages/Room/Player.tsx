import { useState } from 'react';

import arrowDown from '@/assets/icons/arrowDown.svg';
import arrowUp from '@/assets/icons/arrowUp.svg';
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

const MAX_ROUND = Object.keys(Round).length / 2 - 1;

type PlayerState = 'selecting' | 'selected' | 'finish';

const POSITION_LIST = [
  '전체',
  '디자이너',
  'iOS',
  '안드로이드',
  '프론트엔드',
  '백엔드',
];

type filteredUsersType = {
  users: User[];
  selectedTeamId: Team['id'];
  currentRound: Round;
  selectedPosition: string;
};

const filteredUsers = ({
  users,
  selectedTeamId,
  currentRound,
  selectedPosition,
}: filteredUsersType) => {
  return users.filter((user) => {
    if (user.choices[currentRound] !== selectedTeamId) return false;
    if (selectedPosition !== '전체' && user.position !== selectedPosition)
      return false;
    return true;
  });
};

const filteredSelectedUsers = ({
  users,
  selectedTeamId,
  selectedPosition,
}: Omit<filteredUsersType, 'currentRound'>) => {
  return users.filter((user) => {
    if (user.joinedTeamId !== selectedTeamId) return false;
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
  const [selectedTeamId, setSelectedTeamId] = useState<Team['id']>(teamId);
  const [currentRound, setCurrentRound] = useState<Round>(0);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [isOpenApplicantModal, setIsOpenApplicantModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User['id'][]>([]);

  const toggleSelect = (selectUser: User) => {
    if (selectedTeamId === null)
      return alert('팀 지정 되지 않은 상태에선 선택할 수 없습니다.');
    if (selectedTeamId !== teamId) return alert('자신의 팀만 선택 가능합니다.');
    if (playerState !== 'selecting') return alert('선택할 수 없는 상태입니다.');

    const isSelected = !!selectedUsers.find((id) => id === selectUser.id);
    if (confirm(isSelected ? '선택해제 하시겠습니까?' : '선택 하시겠습니까?')) {
      setSelectedUsers((prev) =>
        isSelected
          ? prev.filter((id) => id !== selectUser.id)
          : [...prev, selectUser.id],
      );
    }
  };

  const handleTeamSelectionComplete = () => {
    if (currentRound === MAX_ROUND) return;

    setPlayerState('selected');
    // FIXME: 해당 라운드 종료가 됐다는것 서버에 알려야 함. 해당 콜백으로 setCurrentRound 호출
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
      if (currentRound + 1 !== MAX_ROUND) setPlayerState('selecting');

      // users에서 해당 라운드에 선택된 유저들 currentTeamId를 selectedTeamId로 변경
      setUsers((prev) =>
        prev.map((user) => {
          if (selectedUsers.includes(user.id)) {
            return {
              ...user,
              joinedTeamId: selectedTeamId,
            };
          }
          return user;
        }),
      );
      setSelectedUsers([]);
    }, 3000);
  };

  const handleCompleteButton = () => {
    // FIXME: 팀 빌딩이 최종적으로 완료했다는 것을 서버에 알려야 함.
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
                {Round[currentRound]}
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
        <section className={stack({ alignItems: 'flex-start' })}>
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
            className={vstack({
              position: 'relative',
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
                overflow: 'auto',
                maxHeight: 'calc(100% - 140px)',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              })}
            >
              {filteredSelectedUsers({
                users,
                selectedTeamId,
                selectedPosition,
              }).map((user) => (
                <Card
                  key={user.id}
                  name={user.name}
                  position={user.position}
                  selected={false}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsOpenApplicantModal(!isOpenApplicantModal)}
              className={hstack({
                position: 'absolute',
                bottom: '0',
                left: '0',
                color: 'white',
                width: '100%',
                paddingY: '10px',
                fontWeight: '800',
                fontSize: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                justifyContent: 'center',
                background: isOpenApplicantModal ? '#0c0d0e' : 'none',
                _hover: {
                  backgroundColor: isOpenApplicantModal
                    ? '#0c0d0e'
                    : 'rgba(12, 13, 14, 0.6)',
                  borderRadius: isOpenApplicantModal ? '0px' : '20px',
                },
              })}
            >
              {isOpenApplicantModal
                ? '선택된 팀원 리스트 확인'
                : `${
                    currentRound + 1 > 4 ? 4 : currentRound + 1
                  }지망 지원자 확인`}
              <img
                width="60px"
                height="60px"
                src={isOpenApplicantModal ? arrowDown : arrowUp}
              />
            </button>
            {isOpenApplicantModal && (
              <ApplicantModal
                users={users}
                currentRound={currentRound}
                selectedTeamId={selectedTeamId}
                selectedUsers={selectedUsers}
                toggleSelect={toggleSelect}
              />
            )}
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
        <ul
          className={vstack({
            gap: '15px',
            alignItems: 'flex-end',
            transition: 'all 0.3s',
          })}
        >
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
                paddingRight: selectedTeamId === team.id ? '40px' : '',
              })}
              onClick={() => setSelectedTeamId(team.id)}
            >
              {team.pmName} 팀
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

type ApplicantModalProps = {
  users: User[];
  selectedTeamId: string;
  currentRound: number;
  selectedUsers: User['id'][];
  toggleSelect: (user: User) => void;
};

const ApplicantModal = ({
  users,
  selectedTeamId,
  currentRound,
  selectedUsers,
  toggleSelect,
}: ApplicantModalProps) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  return (
    <div
      className={vstack({
        position: 'absolute',
        top: '0',
        left: '0',
        flex: 1,
        height: '100%',
        width: '880px',
        alignItems: 'flex-start',
        backgroundColor: '#0c0d0e',
        backdropFilter: 'blur(10px)',
        border: '1px solid #17191c',
        padding: '30px',
        paddingBottom: '0',
        borderRadius: '20px',
        borderBottomRadius: '0',
        overflow: 'auto',
        animation: `moveUp 0.4s`,
        maxHeight: 'calc(100% - 80px)',
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
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        })}
      >
        {filteredUsers({
          users,
          selectedTeamId,
          currentRound,
          selectedPosition,
        }).map((user) => (
          <Card
            key={user.id}
            name={user.name}
            position={user.position}
            selected={selectedUsers.includes(user.id)}
            onClick={() => toggleSelect(user)}
          />
        ))}
      </div>
    </div>
  );
};

//================================= PositionButton ======================================
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
