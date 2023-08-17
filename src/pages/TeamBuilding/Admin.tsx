import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';

import {
  useAdjustUser,
  useDeleteUser,
  useFinishTeamBuilding,
} from '@/apis/admin/mutations';
import { useGetTotalInfo } from '@/apis/team-building/queries';
import { ReactComponent as CheckWithoutCircleIcon } from '@/assets/icons/checkWithoutCircle.svg';
import { ReactComponent as Face } from '@/assets/icons/face.svg';
import { ReactComponent as Group } from '@/assets/icons/group.svg';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ChipWithUser } from '@/components/ChipWithUser';
import { LinearProgress } from '@/components/LinearProgress';
import { Step, Stepper } from '@/components/stepper';
import { useDisclosure } from '@/hooks/useDisclosure';
import { SelectTeamModal } from '@/modals/SelectTeamModal';
import { ShareSurveyModal } from '@/modals/ShareSurveyModal';
import { eventSourceAtom } from '@/store/atoms';
import { css } from '@/styled-system/css';
import { center, hstack, stack, vstack } from '@/styled-system/patterns';
import {
  AdjustUserEvent,
  ChangeRoundEvent,
  CreateUserEvent,
  DeleteUserEvent,
  PickUserEvent,
  Round,
  Team,
  User,
} from '@/types';
import { playSound } from '@/utils/sound';
import { toastWithSound } from '@/utils/toast';

const ROUNDS = [
  {
    label: '1지망',
    Icon: Face,
  },
  {
    label: '2지망',
    Icon: Face,
  },
  {
    label: '3지망',
    Icon: Face,
  },
  {
    label: '4지망',
    Icon: Face,
  },
  {
    label: '팀 구성 조정',
    Icon: Group,
  },
];

const roundIndexMap: Record<Round, number> = {
  FIRST_ROUND: 0,
  SECOND_ROUND: 1,
  THIRD_ROUND: 2,
  FORTH_ROUND: 3,
  ADJUSTED_ROUND: 4,
  COMPLETE: 5, // @note: 해당 값으로 넘어가면 stepper는 선택된게 없다.
};

export type AdminProps = {
  teamBuildingUuid: string;
};

export const Admin = ({ teamBuildingUuid }: AdminProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectTeamModalProps = useDisclosure();
  const shareSurveyModalProps = useDisclosure();
  const eventSource = useAtomValue(eventSourceAtom);

  const { data, refetch: refetchTotalInfo } = useGetTotalInfo(teamBuildingUuid);
  const { teamBuildingInfo, teamInfoList, userInfoList } = data ?? {};

  const { mutate: adjustUser } = useAdjustUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: finishTeamBuilding, isLoading: isLoadingToFinish } =
    useFinishTeamBuilding();

  const activeStep =
    roundIndexMap[teamBuildingInfo?.roundStatus ?? 'FIRST_ROUND'];
  const processValue = (teamInfoList ?? []).reduce(
    (acc, team) => (acc += team.selectDone ? 1 : 0),
    0,
  );
  const isFinishedTeamBuilding = teamBuildingInfo?.roundStatus === 'COMPLETE';
  const isDisabledFinishTeamBuildingButton = useMemo(() => {
    if (teamBuildingInfo?.roundStatus !== 'ADJUSTED_ROUND') return true;
    return userInfoList?.some((user) => user.joinedTeamUuid === null) ?? false;
  }, [teamBuildingInfo?.roundStatus, userInfoList]);

  const allMemberByTeam = useMemo(() => {
    const allMemberByTeam: Record<Team['uuid'], User[]> = {};

    teamInfoList?.forEach((team) => {
      allMemberByTeam[team.uuid] = [
        {
          uuid: 'pm',
          userName: team.pmName,
          position: team.pmPosition,
          choices: [],
          joinedTeamUuid: team.uuid,
          profileLink: '',
          selectedTeam: true,
        } as User,
        ...(userInfoList ?? []).filter(
          (user) => user.joinedTeamUuid === team.uuid,
        ),
      ];
    });

    allMemberByTeam['others'] = (userInfoList ?? []).filter(
      (user) => user.joinedTeamUuid === null,
    );

    return Object.entries(allMemberByTeam);
  }, [teamInfoList, userInfoList]);

  const handleCloseModal = () => {
    setSelectedUser(null);
    selectTeamModalProps.onClose();
  };

  const handleSelectTeam = (teamUuid: Team['uuid'] | null) => {
    if (!selectedUser) return;

    if (teamUuid === null) {
      return adjustUser(
        {
          teamBuildingUuid,
          userUuid: selectedUser.uuid,
          body: {
            teamUuid: null,
          },
        },
        {
          onSuccess: () => {
            // @todo: 쿼리 클라이언트 수정
            toastWithSound.success(
              `${selectedUser.userName}님의 팀 배정을 해제했습니다.`,
            );
          },
          onError: () => {
            toastWithSound.error(
              '팀 배정 해제에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        },
      );
    }

    const team = teamInfoList?.find((team) => team.uuid === teamUuid);
    if (team) {
      return adjustUser(
        {
          teamBuildingUuid,
          userUuid: selectedUser.uuid,
          body: {
            teamUuid: team.uuid,
          },
        },
        {
          onSuccess: () => {
            // @todo: 쿼리 클라이언트 수정
            toastWithSound.success(
              `${selectedUser.userName}님을 ${team.pmName}팀으로 배정했습니다.`,
            );
          },
          onError: () => {
            toastWithSound.error(
              '팀 배정에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        },
      );
    }
  };

  const handleClickShareSurvey = () => {
    shareSurveyModalProps.onOpen();
  };

  const handleClickShareLink = () => {
    navigator.clipboard.writeText(location.href);
    toastWithSound.success('참여 링크가 복사되었습니다');
  };

  const handleClickFinishTeamBuilding = () => {
    finishTeamBuilding(
      {
        teamBuildingUuid,
      },
      {
        onSuccess: () => {
          toast.success('팀 빌딩을 완료했습니다.');
          playSound('팀빌딩_완료');
        },
        onError: () => {
          toastWithSound.error(
            '팀 빌딩을 완료하는데 실패했습니다. 잠시 후 다시 시도해주세요.',
          );
        },
      },
    );
  };

  useLayoutEffect(() => {
    if (sessionStorage.getItem('showAdminGuide') === 'true') return;
    shareSurveyModalProps.onOpen();
    sessionStorage.setItem('showAdminGuide', 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!eventSource) return;

    const handlePickUser = (e: MessageEvent<string>) => {
      const data: PickUserEvent = JSON.parse(e.data);
      console.log('pick user', data);
      refetchTotalInfo();
    };

    const handleChangeRound = (e: MessageEvent<string>) => {
      const data = e.data as ChangeRoundEvent;
      console.log('change round', data);
      refetchTotalInfo();
    };

    const handleDeleteUser = (e: MessageEvent<string>) => {
      const data = e.data as DeleteUserEvent;
      console.log('delete user', data);
      refetchTotalInfo();
      // @todo: 쿼리 클라이언트 수정
    };

    const handleCreateUser = (e: MessageEvent<string>) => {
      const data: CreateUserEvent = JSON.parse(e.data);
      console.log('create user', data);
      refetchTotalInfo();
      // @todo: 쿼리 클라이언트 수정
    };

    const handleAdjustUser = (e: MessageEvent<string>) => {
      const data: AdjustUserEvent = JSON.parse(e.data);
      console.log('adjust user', data);
      refetchTotalInfo();
      // @todo: 쿼리 클라이언트 수정
    };

    eventSource.addEventListener('create-user', handleCreateUser);
    eventSource.addEventListener('pick-user', handlePickUser);
    eventSource.addEventListener('change-round', handleChangeRound);
    eventSource.addEventListener('delete-user', handleDeleteUser);
    eventSource.addEventListener('adjust-user', handleAdjustUser);

    return () => {
      eventSource.removeEventListener('create-user', handleCreateUser);
      eventSource.removeEventListener('pick-user', handlePickUser);
      eventSource.removeEventListener('change-round', handleChangeRound);
      eventSource.removeEventListener('delete-user', handleDeleteUser);
      eventSource.removeEventListener('adjust-user', handleAdjustUser);
    };
  }, [eventSource, refetchTotalInfo]);

  const renderTeamTitle = (teamUuid: Team['uuid']) => {
    const team = teamInfoList?.find((team) => team.uuid === teamUuid);
    const teamTitle = team
      ? `${team.pmName}팀 - ${team.teamName}`
      : '남은 인원';
    const showCheck = team?.selectDone ?? false;

    return (
      <div className={hstack()}>
        {teamTitle}
        {showCheck && (
          <div
            title="이번 라운드 팀원 선택을 완료했습니다."
            className={center({
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              flexShrink: 0,
              backgroundColor: 'green.70',
              '& svg': {
                width: '20px',
                height: '20px',
              },
            })}
          >
            <CheckWithoutCircleIcon />
          </div>
        )}
      </div>
    );
  };

  const renderUser = (selectUser: User) => {
    return (
      <ChipWithUser
        key={selectUser.uuid}
        user={selectUser}
        isShowButton={selectUser.uuid !== 'pm'}
        onClickReassign={() => {
          if (teamBuildingInfo?.roundStatus !== 'ADJUSTED_ROUND') {
            return toastWithSound.error(
              '팀 구성 조정 라운드에서만 팀 재배정이 가능합니다.',
            );
          }

          setSelectedUser(selectUser);
          selectTeamModalProps.onOpen();
          // 이후 로직은 handleSelectTeam에서 처리됨.
        }}
        onClickDelete={() => {
          if (teamBuildingInfo?.roundStatus !== 'FIRST_ROUND') {
            return toastWithSound.error(
              '1지망 라운드에서만 유저 정보를 삭제할 수 있습니다.\n배정 해제는 재배정 버튼을 눌러주세요.',
            );
          }

          if (confirm(`${selectUser.userName}님을 삭제하시겠습니까?`)) {
            deleteUser(
              { teamBuildingUuid, userUuid: selectUser.uuid },
              {
                onSuccess: () => {
                  toastWithSound.success(
                    `${selectUser.userName}님을 삭제했습니다.`,
                  );
                },
              },
            );
          }
        }}
      />
    );
  };

  return (
    <>
      <section
        className={vstack({
          flex: 1,
          width: '1280px',
          gap: '40px',
          color: 'gray.5',
          paddingBottom: '80px',
        })}
      >
        <nav
          className={stack({
            width: '100%',
            gap: '12px',
            justifyContent: 'space-between',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '0 0 20px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(50px)',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          })}
        >
          <header className={hstack()}>
            <h1 className={css({ flex: '1', textStyle: 'h1' })}>
              {teamBuildingInfo?.teamBuildingName}
            </h1>
            <div className={hstack({ gap: '12px' })}>
              <button
                className={css({
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.13)',
                  textStyle: 'h4',
                  color: 'gray.20',
                  cursor: 'pointer',
                })}
                onClick={handleClickShareSurvey}
              >
                설문 링크 복사하기
              </button>
              <button
                className={css({
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.13)',
                  textStyle: 'h4',
                  color: 'gray.20',
                  cursor: 'pointer',
                })}
                onClick={handleClickShareLink}
              >
                참여 링크 복사하기
              </button>
            </div>
          </header>

          <div className={hstack({ justifyContent: 'space-between' })}>
            <div className={hstack()}>
              <h3 className={css({ textStyle: 'h3' })}>현재 라운드</h3>
              <Stepper activeStep={activeStep}>
                {ROUNDS.map(({ label, Icon }, index) => (
                  <Step key={label} id={index}>
                    <Icon className={css({ marginRight: '8px' })} />
                    <span className={css({ textStyle: 'h3' })}>{label}</span>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className={hstack()}>
              <h3 className={css({ textStyle: 'h3' })}>현 라운드 완료율</h3>
              <LinearProgress
                value={processValue}
                total={teamInfoList?.length ?? 0}
              />
            </div>
          </div>
        </nav>

        <section
          className={vstack({
            width: '100%',
            padding: '60px',
            gap: '48px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(50px)',
            borderRadius: '20px',
          })}
        >
          <div
            className={hstack({
              width: '100%',
              gap: '24px',
            })}
          >
            <h2
              className={css({
                textStyle: 'h1',
              })}
            >
              팀 빌딩 현황
            </h2>

            <p
              className={css({
                textStyle: 'p1',
                color: 'gray.10',
              })}
            >
              팀원 이름을 마우스로 호버하면 팀 재배정하거나, 해당 인원을 팀에서
              제거할 수 있습니다.
            </p>
          </div>

          <section
            className={vstack({
              width: '100%',
              alignItems: 'flex-start',
              gap: '24px',
            })}
          >
            <div className={hstack({ gap: '16px' })}>
              <Chip visual="first" label="1 지망" />
              <Chip visual="second" label="2 지망" />
              <Chip visual="third" label="3 지망" />
              <Chip visual="fourth" label="4 지망" />
              <Chip visual="extra" label="임의배정" />
              <Chip visual="pm" label="PM" />
            </div>

            <div
              className={css({
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(12, 13, 14, 0.50)',
                backdropFilter: 'blur(50px)',
                borderRadius: '20px',
              })}
            >
              <table
                className={css({
                  width: '100%',
                  fontSize: '16px',
                  color: 'gray.20',
                  '& tr': {
                    height: '52px',
                    borderBottom: '1px solid token(colors.gray.30)',
                  },
                  '& tbody tr:last-child': {
                    borderBottom: 'none',
                  },
                  '& thead tr': {
                    fontWeight: 'bold',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.28)',
                  },
                  '& th': {
                    textAlign: 'left',
                    paddingLeft: '16px',
                  },
                  '& td': {
                    verticalAlign: 'top',
                  },
                  '& td:first-child': {
                    verticalAlign: 'middle',
                    paddingLeft: '16px',
                  },
                })}
              >
                <thead>
                  <tr>
                    <th>팀 이름</th>
                    <th className={css({ width: '160px' })}>디자이너</th>
                    <th className={css({ width: '160px' })}>프론트엔드</th>
                    <th className={css({ width: '160px' })}>백엔드</th>
                    <th className={css({ width: '160px' })}>iOS</th>
                    <th className={css({ width: '160px' })}>안드로이드</th>
                  </tr>
                </thead>
                <tbody>
                  {allMemberByTeam.map(([teamUuid, members]) => (
                    <tr key={teamUuid}>
                      <td>{renderTeamTitle(teamUuid)}</td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'DESIGNER')
                            .map(renderUser)}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'FRONT_END')
                            .map(renderUser)}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'BACK_END')
                            .map(renderUser)}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'IOS')
                            .map(renderUser)}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'ANDROID')
                            .map(renderUser)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={css({ width: '100%', textAlign: 'right' })}>
            <Button
              size="medium"
              color="primary"
              title={
                !isFinishedTeamBuilding && isDisabledFinishTeamBuildingButton
                  ? '팀 구성 조정 라운드에서 모든 팀에 인원 배정이 완료되어야 종료할 수 있습니다.'
                  : undefined
              }
              disabled={isLoadingToFinish || isDisabledFinishTeamBuildingButton}
              onClick={handleClickFinishTeamBuilding}
              className={css({
                width: '320px !important',
              })}
            >
              {isFinishedTeamBuilding
                ? '팀 빌딩이 완료되었습니다'
                : '팀 빌딩 마치기'}
            </Button>
          </section>
        </section>
      </section>

      <SelectTeamModal
        isOpen={selectTeamModalProps.isOpen}
        teams={teamInfoList ?? []}
        onClose={handleCloseModal}
        onSelect={handleSelectTeam}
      />
      <ShareSurveyModal
        teamBuildingUuid={teamBuildingUuid}
        isOpen={shareSurveyModalProps.isOpen}
        onClose={shareSurveyModalProps.onClose}
      />
    </>
  );
};
