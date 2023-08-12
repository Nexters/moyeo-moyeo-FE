import { useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import { useGetTotalInfo } from '@/apis/room';
import { ReactComponent as Face } from '@/assets/icons/face.svg';
import { ReactComponent as Group } from '@/assets/icons/group.svg';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ChipWithUser } from '@/components/ChipWithUser';
import { LinearProgress } from '@/components/LinearProgress';
import { Step, Stepper } from '@/components/stepper';
import { useDisclosure } from '@/hooks/useDisclosure';
import { mockTeams, mockUsers } from '@/mock/data';
import { SelectTeamModal } from '@/modals/SelectTeamModal';
import { ShareSurveyModal } from '@/modals/ShareSurveyModal';
import { css } from '@/styled-system/css';
import { hstack, stack, vstack } from '@/styled-system/patterns';
import { Round, Team, User } from '@/types.old';
import { shakeArray } from '@/utils/array';
import { delay } from '@/utils/time';

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

const roundIndexMap: Record<string, number> = {
  '1지망': 0,
  '2지망': 1,
  '3지망': 2,
  '4지망': 3,
};
const nextRoundMap: Record<Round, Round> = {
  '1지망': '2지망',
  '2지망': '3지망',
  '3지망': '4지망',
  '4지망': '자유',
  자유: '종료',
  종료: '종료',
};

export type AdminProps = {
  roomId: string;
};

export const Admin = ({ roomId }: AdminProps) => {
  // @note: 유저 목록을 복사한 이유는 선택된 팀에 대한 정보를 반영하기 위함
  const [users, setUsers] = useState(mockUsers);
  const [selectedRound, setSelectedRound] = useState<Round>('1지망');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectTeamModalProps = useDisclosure();
  const shareSurveyModalProps = useDisclosure();

  const [isRunning, setIsRunning] = useState(false);
  // const query = useGetTotalInfo({ roomId: 'g8qzA4w79BgG4Nm2mBFKMQ' });

  const allMemberByTeam = useMemo(() => {
    const allMemberByTeam: Record<Team['pmName'], User[]> = {};

    mockTeams.forEach((team) => {
      allMemberByTeam[team.pmName] = [
        {
          id: 'pm',
          name: team.pmName,
          position: '프론트엔드',
          choices: [],
          joinedTeamId: team.id,
        },
      ];
      allMemberByTeam[team.pmName] = allMemberByTeam[team.pmName].concat(
        users.filter((user) => user.joinedTeamId === team.id),
      );
    });
    allMemberByTeam['남은 인원'] = users.filter(
      (user) => user.joinedTeamId === null,
    );

    return Object.entries(allMemberByTeam);
  }, [users]);

  // @note: UT를 위해 라운드에 맞게 임의 배정
  const select = async () => {
    setIsRunning(true);

    // 현재 팀 + 포지션별 인원수를 체크한다
    const countByTeamPosition: Record<string, number> = {};
    users.forEach((user) => {
      if (user.joinedTeamId === null) return;

      const key = `${user.joinedTeamId}-${user.position}`;
      countByTeamPosition[key] = (countByTeamPosition[key] ?? 0) + 1;
    });

    for (const team of shakeArray(mockTeams)) {
      // 특정 팀마다 임의 인원 배정
      users.forEach((user) => {
        if (user.joinedTeamId !== null) return;
        // 현재 라운드가 1지망~4지망이면, 희망하는 팀인지 확인
        // 현재 라운드가 자유면, 배정되지 않았는지만 확인
        if (
          selectedRound !== '자유' &&
          user.choices[roundIndexMap[selectedRound]] !== team.id
        )
          return;

        const key = `${team.id}-${user.position}`;
        const currentPositionCount = countByTeamPosition[key] ?? 0;

        if (currentPositionCount >= 2) return;
        countByTeamPosition[key] = currentPositionCount + 1;
        user.joinedTeamId = team.id;
      });

      setUsers(users.slice());

      await delay(1000);
    }

    const nextRound = nextRoundMap[selectedRound];
    setSelectedRound(nextRound);
    toast.success(`${nextRound} 라운드로 변경되었습니다.`);

    await delay(1000);

    setIsRunning(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    selectTeamModalProps.onClose();
  };

  const handleSelectTeam = (teamId: Team['id'] | null) => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== selectedUser.id) return user;
        return {
          ...user,
          joinedTeamId: teamId,
        };
      }),
    );
    toast.success(
      teamId !== null
        ? `${selectedUser.name}님을 ${teamId}팀으로 배정했습니다.`
        : `${selectedUser.name}님의 팀 배정을 해제했습니다.`,
    );
  };

  const renderUser = (selectUser: User) => {
    return (
      <ChipWithUser
        key={selectUser.id}
        user={selectUser}
        onClickReassign={() => {
          setSelectedUser(selectUser);
          selectTeamModalProps.onOpen();
          // 이후 로직은 handleSelectTeam에서 처리됨.
        }}
        onClickDelete={() => {
          if (confirm(`${selectUser.name}님을 삭제하시겠습니까?`)) {
            // @todo: api 호출
            // 아래는 임시 로직
            setUsers((prev) =>
              prev.filter((user) => user.id !== selectUser.id),
            );
            toast.success(`${selectUser.name}님을 삭제했습니다.`);
          }
        }}
      />
    );
  };

  const teamBuildingName = 'NEXTERS 23기 팀 빌딩';

  return (
    <>
      <section
        className={css({
          position: 'fixed',
          top: 0,
          right: 0,
        })}
      >
        <Button disabled={isRunning} onClick={select}>
          (임)배치 로직 실행(시)
        </Button>
      </section>

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
              {teamBuildingName}
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
                onClick={shareSurveyModalProps.onOpen}
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
              >
                참여 링크 복사하기
              </button>
            </div>
          </header>

          <div className={hstack({ justifyContent: 'space-between' })}>
            <div className={hstack()}>
              <h3 className={css({ textStyle: 'h3' })}>현재 라운드</h3>
              <Stepper activeStep={1}>
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
              <LinearProgress value={1} total={10} />
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
                  {allMemberByTeam.map(([teamName, members]) => (
                    <tr key={teamName}>
                      <td>{teamName}</td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                            gap: '8px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === '디자이너')
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
                            .filter((user) => user.position === '프론트엔드')
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
                            .filter((user) => user.position === '백엔드')
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
                            .filter((user) => user.position === 'iOS')
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
                            .filter((user) => user.position === '안드로이드')
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
            <button
              className={css({
                width: '320px',
                height: '80px',
                padding: '24px',
                background: 'linear-gradient(180deg, #8060FF 0%, #5818DF 100%)',
                boxShadow:
                  '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px #441FE2 inset',
                borderRadius: '20px',
                fontSize: '24px',
                fontFamily: 'GmarketSansBold',
                color: 'gray.5',
                cursor: 'pointer',
              })}
            >
              팀 빌딩 마치기
            </button>
          </section>
        </section>
      </section>

      <SelectTeamModal
        isOpen={selectTeamModalProps.isOpen}
        teams={mockTeams}
        onClose={handleCloseModal}
        onSelect={handleSelectTeam}
      />
      <ShareSurveyModal
        roomId={roomId}
        isOpen={shareSurveyModalProps.isOpen}
        onClose={shareSurveyModalProps.onClose}
      />
    </>
  );
};
