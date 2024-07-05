import { useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';

import { useSelectUsers } from '@/apis/team-building/mutations';
import { useGetTotalInfo } from '@/apis/team-building/queries';
import ArrowUpIcon from '@/assets/icons/arrowUp.svg?react';
import FaceIcon from '@/assets/icons/face.svg?react';
import GroupIcon from '@/assets/icons/group.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LinearProgress } from '@/components/LinearProgress';
import { Step, Stepper } from '@/components/stepper';
import { useDisclosure } from '@/hooks/useDisclosure';
import AgreementModal from '@/modals/AgreementModal';
import { OverallStatusModal } from '@/modals/OverallStatusModal';
import RoundStartModal from '@/modals/RoundStartModal';
import SelectConfirmModal from '@/modals/SelectConfirmModal';
import { eventSourceAtom } from '@/store/atoms';
import { css } from '@/styled-system/css';
import { grid, hstack, stack, vstack } from '@/styled-system/patterns';
import { AdjustUserEvent, DeleteUserEvent, Round, Team, User } from '@/types';
import { ROUND_INDEX_MAP, ROUND_LABEL_MAP } from '@/utils/const';
import { playSound } from '@/utils/sound';
import { toastWithSound } from '@/utils/toast';
import { comparePosition } from '@/utils/user';

type PlayerProps = {
  teamUuid: Team['uuid'];
  teamBuildingUuid: string;
};

type PickUserEvent = {
  teamUuid: Team['uuid'];
  teamName: string;
  pickUserUuids: string[];
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

export const Player = ({ teamUuid, teamBuildingUuid }: PlayerProps) => {
  const { data, refetch, setTotalInfo } = useGetTotalInfo(
    teamBuildingUuid,
    true,
  );
  const { teamBuildingInfo, teamInfoList, userInfoList } = data ?? {};
  const { mutateAsync: selectUsers } = useSelectUsers();
  const eventSource = useAtomValue(eventSourceAtom);

  const [selectedUsers, setSelectedUsers] = useState<User['uuid'][]>([]); // 현재 라운드에 PM이 선택한 사람

  const pmName = useMemo(() => {
    return teamInfoList?.find((team) => team.uuid === teamUuid)?.pmName;
  }, [teamInfoList, teamUuid]);

  const activeStep = useMemo(() => {
    return ROUND_INDEX_MAP[teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'];
  }, [teamBuildingInfo?.roundStatus]);

  const currentRoundLabel = useMemo(() => {
    return ROUND_LABEL_MAP[teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'];
  }, [teamBuildingInfo?.roundStatus]);

  const selectDoneList = useMemo(() => {
    return teamInfoList
      ?.filter((team) => team.selectDone)
      .map((team) => team.uuid);
  }, [teamInfoList]);

  const selectionCompleteButtonName = useMemo<{
    firstLine: string;
    secondLine?: string;
  }>(() => {
    if (teamBuildingInfo?.roundStatus === 'START')
      return { firstLine: '팀 빌딩', secondLine: '시작 대기 중' };
    if (teamBuildingInfo?.roundStatus === 'COMPLETE')
      return { firstLine: '팀 빌딩 완료' };
    else if (selectDoneList?.includes(teamUuid) || activeStep > 3)
      return { firstLine: currentRoundLabel, secondLine: '대기중' };
    else
      return {
        firstLine: currentRoundLabel,
        secondLine: '선택 완료하기',
      };
  }, [selectDoneList, teamUuid, activeStep, teamBuildingInfo?.roundStatus]);

  const isDisabledSelectionCompleteButton = useMemo(() => {
    // @note: 시작 라운드에는 버튼 클릭 불가능
    if (teamBuildingInfo?.roundStatus === 'START') return true;
    return selectDoneList?.includes(teamUuid) || activeStep > 3;
  }, []);

  const selectListModalProps = useDisclosure();
  const roundStartModalProps = useDisclosure(); // 라운드 시작 모달
  const selectConfirmModalProps = useDisclosure(); // 선택 확인용 모달
  const agreementModalProps = useDisclosure(); // 동의서 모달
  const overallModalProps = useDisclosure(); // 전체 현황보기 모달

  useEffect(() => {
    if (localStorage.getItem('agreement') === 'true') return;
    agreementModalProps.onOpen();
  }, []);

  useEffect(() => {
    // @note: 라운드 변경에 대한 이벤트 감지가 안되는 경우, 토스트가 안뜰 수 있어
    // 별도의 effect 훅으로 토스트를 띄운다.
    if (!localStorage.getItem('agreement')) return;

    // @note: 조정라운드와 완료라운드는 전체 현황보기 모달이 자동으로 열린다.
    // 첫번째 라운드에서는 선택 리스트 모달이 자동으로 열린다.
    if (teamBuildingInfo?.roundStatus === 'COMPLETE') {
      overallModalProps.onOpen();
      playSound('팀빌딩_완료');
    } else if (teamBuildingInfo?.roundStatus === 'ADJUSTED_ROUND') {
      overallModalProps.onOpen();
      playSound('라운드_변경');
    } else {
      if (teamBuildingInfo?.roundStatus === 'FIRST_ROUND') {
        selectListModalProps.onOpen();
      }
      playSound('라운드_변경');
    }

    roundStartModalProps.onOpen();
  }, [teamBuildingInfo?.roundStatus]);

  useEffect(() => {
    if (!eventSource) return;
    console.log('ADD EVENT LISTENER');

    const handlePickUser = (e: MessageEvent<string>) => {
      const data: PickUserEvent = JSON.parse(e.data);
      console.log('PICK USER: ', data);

      refetch();
    };

    const handleChangeRound = (e: MessageEvent<Round>) => {
      console.log('CHANGE ROUND: ', e.data);
      refetch();
    };

    const handleDeleteUser = (e: MessageEvent<string>) => {
      const deletedUserUuid = e.data as DeleteUserEvent;
      console.log('DELETE USER: ', deletedUserUuid);
      refetch();
    };

    const handleAdjustUser = (e: MessageEvent<string>) => {
      const data: AdjustUserEvent = JSON.parse(e.data);
      console.log('ADJUST USER: ', data);
      if (data.joinedTeamUuid === teamUuid)
        toastWithSound.success(`${data.userName}님이 팀에 배정되었습니다.`);
      refetch();
    };

    eventSource?.addEventListener('pick-user', handlePickUser);
    eventSource?.addEventListener('change-round', handleChangeRound);
    eventSource.addEventListener('delete-user', handleDeleteUser);
    eventSource.addEventListener('adjust-user', handleAdjustUser);
    return () => {
      console.log('REMOVE EVENT LISTENER');
      eventSource?.removeEventListener('pick-user', handlePickUser);
      eventSource?.removeEventListener('change-round', handleChangeRound);
      eventSource?.removeEventListener('delete-user', handleDeleteUser);
      eventSource?.removeEventListener('adjust-user', handleAdjustUser);
    };
  }, [eventSource, refetch, setTotalInfo]);

  // @note: 포지션 순서대로 정렬된 유저 리스트
  const sortedUserInfoList = useMemo(() => {
    return userInfoList?.sort((a, b) =>
      comparePosition(a.position, b.position),
    );
  }, [userInfoList]);

  const filteredSelectedUsers = useMemo(() => {
    // @note: 현재 PM 팀에 속해 있는 사람들과 이번 라운드에서 선택된 사람들을 보여준다.
    return sortedUserInfoList?.filter(
      (user) =>
        user.joinedTeamUuid === teamUuid || selectedUsers.includes(user.uuid),
    );
  }, [sortedUserInfoList, teamUuid, selectedUsers]);

  const filteredUsersByRound = useMemo(() => {
    // @note: 이번 라운드에서 선택할 수 있거나 이번 라운드에 선택된 사람들을 보여준다.
    return sortedUserInfoList?.filter((user) => {
      // @note: 조정 라운드라면 선택되지 못한 사람들을 전부 보여준다.
      if (teamBuildingInfo?.roundStatus === 'ADJUSTED_ROUND')
        return user.joinedTeamUuid === null;
      // @note: 1. 현재 라운드에서 선택할 수 있는 사람들
      // @note: 2. 이번 라운드에서 선택된 사람들
      else
        return (
          (user.choices[activeStep] === teamUuid &&
            user.joinedTeamUuid === null) ||
          (user.selectedRound === teamBuildingInfo?.roundStatus &&
            user.joinedTeamUuid === teamUuid)
        );
    });
  }, [activeStep, teamBuildingInfo?.roundStatus, teamUuid, sortedUserInfoList]);

  const toggleCard = (selectUser: User) => {
    // @note: 이미 선택 완료 버튼을 눌렀다면 선택할 수 없다.
    if (selectDoneList?.includes(teamUuid))
      return toastWithSound.error('선택할 수 없는 상태입니다.');
    // @note: 조정 라운드에서는 PM이 선택할 수 없다.
    if (teamBuildingInfo?.roundStatus === 'ADJUSTED_ROUND')
      return toastWithSound.error('선택할 수 없는 상태입니다.');

    playSound('팀원_선택');
    const isSelected = !!selectedUsers.find((id) => id === selectUser.uuid);
    if (isSelected ? confirm(isSelected && '선택해제 하시겠습니까?') : true) {
      setSelectedUsers((prev) =>
        isSelected
          ? prev.filter((id) => id !== selectUser.uuid)
          : [...prev, selectUser.uuid],
      );
    }
  };

  const handleSelectionComplete = () => {
    selectUsers(
      {
        teamBuildingUuid,
        teamUuid,
        body: {
          userUuids: selectedUsers,
        },
      },
      {
        onSuccess: () => {
          playSound('팀원_확정');
          setSelectedUsers([]);
          refetch();
        },
        onError: () => {
          toastWithSound.error(
            '문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        },
      },
    );
  };

  const onClickAgreement = () => {
    localStorage.setItem('agreement', 'true');
    roundStartModalProps.onOpen();
  };

  const onClickOverallStatusModalClose = () => {
    // @note: 팀 빌딩이 끝났으면 못닫게 막기
    if (teamBuildingInfo?.roundStatus === 'COMPLETE') return;
    playSound('버튼_클릭');
    overallModalProps.onClose();
  };

  return (
    <>
      <div
        className={vstack({
          height: '100vh',
          gap: '20px',
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
              {teamBuildingInfo?.teamBuildingName}
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
              onClick={() => {
                playSound('버튼_클릭');
                overallModalProps.onOpen();
              }}
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
              <Stepper activeStep={activeStep}>
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
                value={selectDoneList?.length ?? 0}
                total={teamInfoList?.length ?? 0}
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
            {pmName}님 팀 구성 현황
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
            {filteredSelectedUsers?.map((user) => (
              <Card
                key={user.uuid}
                name={user.userName}
                border={
                  selectedUsers?.includes(user.uuid) ? 'yellow' : 'default'
                }
                position={user.position}
                choice={user.selectedRound ?? teamBuildingInfo?.roundStatus}
                link={user.profileLink}
                selected={false}
              />
            ))}
          </div>
          {filteredSelectedUsers?.length === 0 && (
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
            height: '200px',
            position: 'relative',
            _after: {
              content: '""',
              position: 'fixed',
              top: '0',
              left: '0',
              width: selectListModalProps.isOpen ? '100%' : '0',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.8)',
            },
          })}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              selectListModalProps.onClose();
            }
          }}
        >
          <div
            onClick={() => {
              if (!selectListModalProps.isOpen) {
                selectListModalProps.onOpen();
              }
            }}
            className={stack({
              width: '1030px',
              height: '650px',
              background: selectListModalProps.isOpen
                ? 'rgba(255, 255, 255, 0.07)'
                : 'rgba(0, 0, 0, 0.07)',
              backdropFilter: 'blur(50px)',
              padding: '30px 0 0 30px',
              border: '1px solid rgba(255, 255, 255, 0.11)',
              borderRadius: '20px 20px 0 0',
              overflow: 'auto',
              position: 'absolute',
              top: selectListModalProps.isOpen ? '-450px' : '0', // -450px = 650px(전체 높이) - 200px(부모 높이)
              left: '0',
              gap: '0',
              transition: 'top 0.3s ease-in-out',
              willChange: 'top',
              zIndex: '1',

              _hover: {
                _before: {
                  content: selectListModalProps.isOpen ? undefined : '""',
                  cursor: selectConfirmModalProps.isOpen
                    ? 'default'
                    : 'pointer',
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.07)',
                  zIndex: '1',
                },
                // 위로 살짝 올라가는 효과
                top: selectListModalProps.isOpen ? '-450px' : '-70px',
              },
            })}
          >
            <div
              className={hstack({
                justifyContent: 'space-between',
                paddingRight: '30px',
              })}
            >
              <h2
                className={css({
                  textStyle: 'h1',
                  color: 'gray.5',
                })}
              >
                {teamBuildingInfo?.roundStatus === 'START'
                  ? // @note: 팀 빌딩 시작 전에는 1지망 리스트라고 표시함
                    '1지망 리스트'
                  : `${currentRoundLabel} 리스트`}
              </h2>
              <div
                className={css({
                  width: '123px',
                  height: '44px',
                })}
              >
                <button
                  className={hstack({
                    width: '130px',
                    padding: '10px 26px',
                    textStyle: 'h3',
                    color: 'gray.5',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap',
                  })}
                  onClick={() => {
                    playSound('버튼_클릭');
                    selectListModalProps.onToggle();
                  }}
                >
                  {selectListModalProps.isOpen ? '접기' : '펼치기'}
                  <ArrowUpIcon
                    className={css({
                      transition: 'transform 0.4s ease-in-out',
                      transform: selectListModalProps.isOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    })}
                  />
                </button>
              </div>
            </div>
            <div
              className={grid({
                columns: 4,
                marginTop: '30px',
                marginRight: '20px',
                paddingRight: '10px',
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
              {filteredUsersByRound?.map((user) => (
                <Card
                  className={css({
                    cursor: 'pointer',
                    _hover: {
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                    },
                  })}
                  key={user.uuid}
                  name={user.userName}
                  position={user.position}
                  link={user.profileLink}
                  choice={teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'}
                  selected={
                    selectedUsers.includes(user.uuid) ||
                    (user.choices[activeStep] === teamUuid &&
                      user.joinedTeamUuid === teamUuid)
                  }
                  onClick={() => toggleCard(user)}
                />
              ))}
              {/* 하단 패딩 대체용 */}
              {filteredUsersByRound?.length !== 0 && (
                <div className={css({ width: '100%', height: '56px' })} />
              )}
            </div>
            {filteredUsersByRound?.length === 0 && (
              <span
                className={hstack({
                  width: 'fit-content',
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
                {activeStep > 3
                  ? '남은 인원이 없습니다'
                  : '이번 라운드에는 지망자가 없습니다'}
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
              className={vstack({
                height: '100%',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
              })}
              disabled={isDisabledSelectionCompleteButton}
              onClick={() => {
                playSound('버튼_클릭');
                selectConfirmModalProps.onOpen();
              }}
            >
              <span>{selectionCompleteButtonName.firstLine}</span>
              {selectionCompleteButtonName.secondLine && (
                <span className={css({ textStyle: 'h2' })}>
                  {selectionCompleteButtonName.secondLine}
                </span>
              )}
            </Button>
          </div>
        </section>
      </div>
      <SelectConfirmModal
        isOpen={selectConfirmModalProps.isOpen}
        onClose={selectConfirmModalProps.onClose}
        selectionConfirm={handleSelectionComplete}
      />
      <AgreementModal
        isOpen={agreementModalProps.isOpen}
        onClose={agreementModalProps.onClose}
        onAgree={onClickAgreement}
      />
      <OverallStatusModal
        isOpen={overallModalProps.isOpen}
        onClose={onClickOverallStatusModalClose}
        hiddenCloseButton={teamBuildingInfo?.roundStatus === 'COMPLETE'}
        teamBuildingUuid={teamBuildingUuid}
      />
      <RoundStartModal
        isOpen={roundStartModalProps.isOpen}
        onClose={roundStartModalProps.onClose}
        round={activeStep}
      />
    </>
  );
};
