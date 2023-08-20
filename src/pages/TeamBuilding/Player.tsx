import { useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';

import { useSelectUsers } from '@/apis/team-building/mutations';
import { useGetTotalInfo } from '@/apis/team-building/queries';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrowUp.svg';
import { ReactComponent as FaceIcon } from '@/assets/icons/face.svg';
import { ReactComponent as GroupIcon } from '@/assets/icons/group.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
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
  const { data, refetch, setTotalInfo } = useGetTotalInfo(teamBuildingUuid);
  const { teamBuildingInfo, teamInfoList, userInfoList } = data ?? {};
  const { mutateAsync: selectUsers } = useSelectUsers();
  const eventSource = useAtomValue(eventSourceAtom);

  const activeStep =
    ROUND_INDEX_MAP[teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'];
  const [selectedUsers, setSelectedUsers] = useState<User['uuid'][]>([]); // 현재 라운드에 PM이 선택한 사람

  const selectDoneList = useMemo(() => {
    return teamInfoList
      ?.filter((team) => team.selectDone)
      .map((team) => team.uuid);
  }, [teamInfoList]);

  const selectionCompleteButtonName = useMemo(() => {
    const roundStatus = teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND';
    if (teamBuildingInfo?.roundStatus === 'COMPLETE') return '팀 빌딩 완료';
    else if (selectDoneList?.includes(teamUuid) || activeStep > 3)
      return `${ROUND_LABEL_MAP[roundStatus]}\n대기중`;
    else return `${ROUND_LABEL_MAP[roundStatus]}\n선택 완료하기`;
  }, [selectDoneList, teamUuid, activeStep, teamBuildingInfo?.roundStatus]);

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

    if (teamBuildingInfo?.roundStatus === 'COMPLETE') playSound('팀빌딩_완료');
    else playSound('라운드_변경');

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

  const filteredSelectedUsers = useMemo(() => {
    // @note: 현재 PM 팀에 속해 있는 사람들과 이번 라운드에서 선택된 사람들을 보여준다.
    return userInfoList?.filter(
      (user) =>
        user.joinedTeamUuid === teamUuid || selectedUsers.includes(user.uuid),
    );
  }, [userInfoList, teamUuid, selectedUsers]);

  const filteredUsersByRound = useMemo(() => {
    // @note: 이번 라운드에서 선택할 수 있거나 이번 라운드에 선택된 사람들을 보여준다.
    return userInfoList?.filter((user) => {
      // @note: 조정 라운드라면 선택되지 못한 사람들을 전부 보여준다.
      if (teamBuildingInfo?.roundStatus === 'ADJUSTED_ROUND')
        return user.joinedTeamUuid === null;
      // @note: 1. 현재 라운드에서 선택할 수 있는 사람들
      // @note: 2. 이번 라운드에서 선택된 사람들
      else
        return (
          (user.choices[activeStep] === teamUuid &&
            user.joinedTeamUuid === null) ||
          (!!user.selectedRound &&
            ROUND_INDEX_MAP[user.selectedRound] === activeStep &&
            user.joinedTeamUuid === teamUuid)
        );
    });
  }, [activeStep, teamBuildingInfo?.roundStatus, teamUuid, userInfoList]);

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
        onSuccess: (data) => {
          playSound('팀원_확정');
          setSelectedUsers([]);
          // @note: SSE를 못받을 경우를 대비해 수정할 수 있는 데이터 반영
          setTotalInfo((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              userInfoList: data.userInfoList,
            };
          });
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
        >
          <div
            className={stack({
              width: '1030px',
              height: selectListModalProps.isOpen ? '650px' : '200px',
              background: selectListModalProps.isOpen
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
                {
                  ROUND_LABEL_MAP[
                    teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'
                  ]
                }{' '}
                리스트
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
                  onClick={() => {
                    playSound('버튼_클릭');
                    selectListModalProps.onToggle();
                  }}
                >
                  {selectListModalProps.isOpen ? '접기' : '펼치기'}
                  <ArrowUpIcon
                    className={css({
                      transform: selectListModalProps.isOpen
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
              className={css({ height: '100%', whiteSpace: 'pre-line' })}
              disabled={selectDoneList?.includes(teamUuid) || activeStep > 3}
              onClick={() => {
                playSound('버튼_클릭');
                selectConfirmModalProps.onOpen();
              }}
            >
              {selectionCompleteButtonName}
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
        onClose={overallModalProps.onClose}
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
