import { useMemo, useState } from 'react';

import arrowUp from '@/assets/icons/arrowUp.svg';
import { ReactComponent as FaceIcon } from '@/assets/icons/face.svg';
import { ReactComponent as GroupIcon } from '@/assets/icons/group.svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LinearProgress } from '@/components/LinearProgress';
import { Step, Stepper } from '@/components/stepper';
import { mockUsers } from '@/mock/data';
import { css } from '@/styled-system/css';
import { grid, hstack, stack, vstack } from '@/styled-system/patterns';
import { Choice } from '@/types';
import { Team, User } from '@/types.old';

type PlayerProps = {
  teamId: Team['id'];
};

type PlayerState = 'selecting' | 'selected' | 'finish';

const ChoiceMap: Record<number, Choice> = {
  0: '1지망',
  1: '2지망',
  2: '3지망',
  3: '4지망',
};

const ROUNDS = [
  {
    label: '1지망',
    Icon: FaceIcon,
  },
  {
    label: '2지망',
    Icon: FaceIcon,
  },
  {
    label: '3지망',
    Icon: FaceIcon,
  },
  {
    label: '4지망',
    Icon: FaceIcon,
  },
  {
    label: '팀 구성 조정',
    Icon: GroupIcon,
  },
];

const TOTAL_TEAM_COUNT = 10;

export const Player = ({ teamId }: PlayerProps) => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<User['id'][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedTeamCount, setSelectedTeamCount] = useState(0);
  const [isOpenSelectList, setIsOpenSelectList] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>('selecting');

  const filteredSelectedUsers = useMemo(() => {
    return users.filter((user) => user.joinedTeamId === teamId);
  }, [users, teamId]);

  const filteredUsersByRound = useMemo(() => {
    return users.filter(
      (user) =>
        user.choices[currentRound] === teamId && user.joinedTeamId === null,
    );
  }, [currentRound, teamId, users]);

  const toggleSelectList = () => {
    setIsOpenSelectList((prev) => !prev);
  };

  const toggleCard = (selectUser: User) => {
    if (playerState !== 'selecting') return alert('선택할 수 없는 상태입니다.');

    const isSelected = !!selectedUsers.find((id) => id === selectUser.id);
    if (isSelected ? confirm(isSelected && '선택해제 하시겠습니까?') : true) {
      setSelectedUsers((prev) =>
        isSelected
          ? prev.filter((id) => id !== selectUser.id)
          : [...prev, selectUser.id],
      );
    }
  };

  const handleTeamSelectionComplete = () => {
    setPlayerState('selected');
    setTimeout(() => {
      if (currentRound === ROUNDS.length - 1) return;
      setCurrentRound((prev) => prev + 1);
      setPlayerState('selecting');
      setSelectedTeamCount(0);

      // users에서 해당 라운드에 선택된 유저들 currentTeamId를 selectedTeamId로 변경
      setUsers((prev) =>
        prev.map((user) => {
          if (selectedUsers.includes(user.id)) {
            return {
              ...user,
              joinedTeamId: teamId,
            };
          }
          return user;
        }),
      );
      setSelectedUsers([]);
    }, 3000);
  };

  return (
    <div
      className={vstack({
        height: '100vh',
        gap: '20px',
        margin: '0 80px',
        position: 'relative',
      })}
    >
      <section
        className={vstack({
          width: '1280px',
          background: 'rgba(0, 0, 0, 0.07)',
          backdropFilter: 'blur(50px)',
          gap: '20px',
          padding: '20px 30px',
          borderRadius: '0 0 20px 20px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
        })}
      >
        <div
          className={hstack({ width: '100%', justifyContent: 'space-between' })}
        >
          <h1
            className={css({
              textStyle: 'h2',
              color: 'gray.5',
            })}
          >
            Nexters23기 팀빌딩입니다
          </h1>
          <div className={hstack({ gap: '15px' })}>
            <span className={css({ textStyle: 'h3', color: 'gray.5' })}>
              선택 완료 상황
            </span>
            <span
              className={css({
                textStyle: 'h4',
                color: 'gray.5',
                marginLeft: '5px',
                width: '50px',
                textAlign: 'center',
              })}
            >
              {selectedTeamCount} / {TOTAL_TEAM_COUNT}
            </span>
            <LinearProgress
              value={selectedTeamCount}
              total={TOTAL_TEAM_COUNT}
            />
          </div>
        </div>
        <div
          className={hstack({ width: '100%', justifyContent: 'space-between' })}
        >
          <button
            className={css({
              padding: '10px 16px',
              textStyle: 'h3',
              color: 'gray.5',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.36)',
              background: 'rgba(255, 255, 255, 0.28)',
              cursor: 'pointer',
            })}
          >
            전체 현황 보기
          </button>
          <Stepper activeStep={currentRound}>
            {ROUNDS.map(({ label, Icon }, index) => (
              <Step key={label} id={index}>
                <Icon className={css({ marginRight: '10px' })} />
                <span className={css({ textStyle: 'h3' })}>{label}</span>
              </Step>
            ))}
          </Stepper>
        </div>
      </section>
      <section
        className={css({
          width: '1280px',
          background: 'rgba(0, 0, 0, 0.07)',
          backdropFilter: 'blur(50px)',
          padding: '40px 30px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          borderRadius: '20px',
          flex: 1,
          overflow: 'auto',
        })}
      >
        <h2 className={css({ textStyle: 'h1', color: 'gray.5' })}>
          팀 구성 현황
        </h2>
        <div
          className={grid({
            columns: 5,
            marginTop: '30px',
            gap: '16px',
            overflow: 'auto',
            maxHeight: 'calc(100% - 72px)',
            _scrollbarThumb: {
              background: 'rgba(255, 255, 255, 0.50)',
              borderRadius: '99px',
            },
            _scrollbar: {
              width: '10px',
            },
          })}
        >
          {filteredSelectedUsers.map((user, index) => (
            <Card
              key={index}
              className={css({
                cursor: 'default',
              })}
              name={user.name}
              position={user.position}
              choice={
                ChoiceMap[user.choices.findIndex((choice) => choice === teamId)]
              }
              link="temp"
              selected={false}
            />
          ))}
        </div>
      </section>
      <section
        className={css({
          width: '1280px',
          height: '280px',
          _after: {
            content: '""',
            position: 'fixed',
            top: '0',
            left: '0',
            width: isOpenSelectList ? '100%' : '0',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
          },
        })}
      >
        <div
          className={stack({
            width: '1030px',
            height: isOpenSelectList ? '650px' : '280px',
            background: isOpenSelectList
              ? 'rgba(255, 255, 255, 0.07)'
              : 'rgba(0, 0, 0, 0.07)',
            backdropFilter: 'blur(50px)',
            padding: '30px 30px 0 30px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '20px 20px 0 0',
            overflow: 'auto',
            position: 'absolute',
            bottom: '0',
            gap: '0',
            transition: 'all 0.3s ease-in-out',
            zIndex: '1',
          })}
        >
          <div className={hstack({ justifyContent: 'space-between' })}>
            <h2
              className={css({
                textStyle: 'h1',
                color: 'gray.5',
              })}
            >
              {ROUNDS[currentRound].label} 리스트
            </h2>
            <div className={css({ width: '123px', height: '44px' })}>
              <Button
                visual="blue"
                className={hstack({
                  whiteSpace: 'nowrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '20px',
                  gap: '15px',
                  background: 'blue.60',
                })}
                onClick={toggleSelectList}
              >
                {isOpenSelectList ? '접기' : '펼치기'}
                <img src={arrowUp} />
              </Button>
            </div>
          </div>
          <div
            className={grid({
              columns: 4,
              marginTop: '30px',
              gap: '16px',
              overflow: 'auto',
              _scrollbarThumb: {
                background: 'rgba(255, 255, 255, 0.50)',
                borderRadius: '99px',
              },
              _scrollbar: {
                width: '10px',
              },
            })}
          >
            {filteredUsersByRound.map((user, index) => (
              <Card
                className={css({
                  _hover: {
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  },
                })}
                key={user.id}
                name={user.name}
                position={user.position}
                link="temp"
                choice={ChoiceMap[currentRound]}
                selected={selectedUsers.includes(user.id)}
                onClick={() => toggleCard(user)}
              />
            ))}
          </div>
        </div>
        <div
          className={css({
            width: '230px',
            height: '180px',
            position: 'absolute',
            right: '0',
          })}
        >
          <Button
            visual="primary"
            size="large"
            className={css({ height: '100%' })}
            disabled={playerState !== 'selecting'}
            onClick={handleTeamSelectionComplete}
          >
            {ROUNDS[currentRound].label}
            <br />
            팀원 선택 완료
          </Button>
        </div>
      </section>
    </div>
  );
};
