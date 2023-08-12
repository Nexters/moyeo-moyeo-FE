import { useEffect, useMemo, useState } from 'react';

import { toast } from 'react-hot-toast';

import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrowUp.svg';
import { ReactComponent as FaceIcon } from '@/assets/icons/face.svg';
import { ReactComponent as GroupIcon } from '@/assets/icons/group.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LinearProgress } from '@/components/LinearProgress';
import { Step, Stepper } from '@/components/stepper';
import { useDisclosure } from '@/hooks/useDisclosure';
import { mockUsers } from '@/mock/data';
import AgreementModal from '@/modals/AgreementModal';
import RoundFinishModal from '@/modals/RoundStartModal';
import SelectConfirmModal from '@/modals/SelectConfirmModal';
import { css } from '@/styled-system/css';
import { grid, hstack, stack, vstack } from '@/styled-system/patterns';
import { Choice } from '@/types';
import { Team, User } from '@/types.old';

type PlayerProps = {
  teamId: Team['id'];
};

type PlayerState = 'selecting' | 'selected' | 'wait';

const ChoiceMap: Record<number, Choice> = {
  0: '1지망',
  1: '2지망',
  2: '3지망',
  3: '4지망',
  4: '팀 구성 조정',
};

const PlayerStateMap: Record<PlayerState, string> = {
  selecting: '선택',
  selected: '선택 완료',
  wait: '대기중',
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
  const { isOpen: isOpenSelectList, onToggle: setIsOpenSelectList } =
    useDisclosure();
  const roundStartModalProps = useDisclosure();
  const selectConfirmModalProps = useDisclosure();
  const agreementModalProps = useDisclosure();
  const [playerState, setPlayerState] = useState<PlayerState>('wait');

  useEffect(() => {
    agreementModalProps.onOpen();
  }, []);

  useEffect(() => {
    // FIXME: SSE로 라운드 시작 이벤트를 받아서 처리
    if (playerState !== 'selecting') return;
    roundStartModalProps.onOpen();
    const delay = setTimeout(() => {
      roundStartModalProps.onClose();
    }, 5000);

    return () => clearTimeout(delay);
  }, [currentRound, playerState]);

  const filteredSelectedUsers = useMemo(() => {
    // @note: 현재 PM 팀에 속해 있는 사람들과 이번 라운드에서 선택된 사람들을 보여준다.
    return users.filter(
      (user) => user.joinedTeamId === teamId || selectedUsers.includes(user.id),
    );
  }, [users, teamId, selectedUsers]);

  const filteredUsersByRound = useMemo(() => {
    // @note: 이번 라운드에서 선택할 수 있는 사람들을 보여준다.
    return users.filter((user) => {
      if (currentRound === 4) return true;
      else
        return (
          user.choices[currentRound] === teamId && user.joinedTeamId === null
        );
    });
  }, [currentRound, teamId, users]);

  const toggleSelectList = () => {
    setIsOpenSelectList();
  };

  const toggleCard = (selectUser: User) => {
    if (playerState !== 'selecting')
      return toast.error('선택할 수 없는 상태입니다.');

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
      setCurrentRound((prev) => prev + 1);
      if (currentRound === ROUNDS.length - 2) {
        setPlayerState('wait');
      } else setPlayerState('selecting');
      setSelectedTeamCount(0);

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

  const onClickAgreement = () => {
    setPlayerState('selecting');
  };

  return (
    <>
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
            gap: '12px',
            padding: '30px',
            borderRadius: '0 0 20px 20px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
          })}
        >
          <div
            className={hstack({
              width: '100%',
              justifyContent: 'space-between',
              gap: '12px',
            })}
          >
            <h1
              className={css({
                textStyle: 'h1',
                color: 'gray.5',
              })}
            >
              Nexters23기 팀빌딩입니다
            </h1>
            <button
              className={css({
                padding: '10px 25.5px',
                textStyle: 'h4',
                color: 'gray.5',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.13)',
                cursor: 'pointer',
              })}
            >
              전체 현황 보기
            </button>
          </div>
          <div
            className={hstack({
              width: '100%',
              justifyContent: 'space-between',
            })}
          >
            <div className={hstack({ gap: '12px' })}>
              <span className={css({ textStyle: 'h3', color: 'gray.5' })}>
                현재 라운드
              </span>
              <Stepper activeStep={currentRound}>
                {ROUNDS.map(({ label, Icon }, index) => (
                  <Step key={label} id={index}>
                    <Icon className={css({ marginRight: '8px' })} />
                    <span className={css({ textStyle: 'h3' })}>{label}</span>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className={hstack({ gap: '12px' })}>
              <span className={css({ textStyle: 'h3', color: 'gray.5' })}>
                현 라운드 완료율
              </span>
              <LinearProgress
                value={selectedTeamCount}
                total={TOTAL_TEAM_COUNT}
              />
            </div>
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
            {filteredSelectedUsers.map((user) => (
              <Card
                key={user.id}
                name={user.name}
                border={selectedUsers.includes(user.id) ? 'yellow' : 'default'}
                position={user.position}
                choice={
                  ChoiceMap[
                    user.choices.findIndex((choice) => choice === teamId)
                  ]
                }
                link="temp"
                selected={false}
              />
            ))}
          </div>
          {filteredSelectedUsers.length === 0 && (
            <span
              className={hstack({
                width: '384px',
                padding: '16px 24px',
                gap: '16px',
                border: '1px solid rgba(255, 255, 255, 0.11)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.07)',
                whiteSpace: 'nowrap',
                textStyle: 'h2',
                color: 'gray.5',
              })}
            >
              <InfoIcon />
              선택이 확정된 팀원이 없습니다
            </span>
          )}
        </section>
        <section
          className={css({
            width: '1280px',
            height: '332px',
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
              height: isOpenSelectList ? '650px' : '332px',
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
              transition: 'height 0.3s ease-in-out',
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
                  size="small"
                  color="secondary"
                  className={hstack({
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 'none',
                    gap: '15px',
                  })}
                  onClick={toggleSelectList}
                >
                  {isOpenSelectList ? '접기' : '펼치기'}
                  <ArrowUpIcon
                    className={css({
                      transform: isOpenSelectList
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    })}
                  />
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
              {filteredUsersByRound.map((user) => (
                <Card
                  className={css({
                    cursor: 'pointer',
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
            {filteredUsersByRound.length === 0 && (
              <span
                className={hstack({
                  width: '425px',
                  padding: '16px 24px',
                  gap: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.11)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  whiteSpace: 'nowrap',
                  textStyle: 'h2',
                  color: 'gray.5',
                })}
              >
                <InfoIcon />
                이번 라운드에는 지망자가 없습니다
              </span>
            )}
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
              color="secondary"
              size="large"
              className={css({ height: '100%' })}
              disabled={playerState !== 'selecting'}
              onClick={selectConfirmModalProps.onOpen}
            >
              {ROUNDS[currentRound].label}
              <br />
              {PlayerStateMap[playerState]}
            </Button>
          </div>
        </section>
      </div>
      <RoundFinishModal
        isOpen={roundStartModalProps.isOpen}
        onClose={roundStartModalProps.onClose}
        round={currentRound}
      />
      <SelectConfirmModal
        isOpen={selectConfirmModalProps.isOpen}
        onClose={selectConfirmModalProps.onClose}
        selectionConfirm={handleTeamSelectionComplete}
      />
      <AgreementModal
        isOpen={agreementModalProps.isOpen}
        onClose={agreementModalProps.onClose}
        onAgree={onClickAgreement}
      />
    </>
  );
};
