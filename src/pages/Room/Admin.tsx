import { useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import { useGetTotalInfo } from '@/apis/room';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ChipWithUser } from '@/components/ChipWithUser';
import { useDisclosure } from '@/hooks/useDisclosure';
import { mockTeams, mockUsers } from '@/mock/data';
import { SelectTeamModal } from '@/modals/SelectTeamModal';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { Round, Team, User } from '@/types.old';
import { shakeArray } from '@/utils/array';
import { delay } from '@/utils/time';

const rounds: Round[] = ['1지망', '2지망', '3지망', '4지망', '자유', '종료'];
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

export const Admin = () => {
  // @note: 유저 목록을 복사한 이유는 선택된 팀에 대한 정보를 반영하기 위함
  const [users, setUsers] = useState(mockUsers);
  const [selectedRound, setSelectedRound] = useState<Round>('1지망');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isRunning, setIsRunning] = useState(false);
  const query = useGetTotalInfo({ roomId: 'g8qzA4w79BgG4Nm2mBFKMQ' });

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
    onClose();
  };

  const handleClickMember = (selectUser: User) => () => {
    const isNotSelected = selectUser.joinedTeamId === null;
    if (isNotSelected) {
      setSelectedUser(selectUser);
      return onOpen();
    }

    if (confirm('배정 해제하겠습니까?')) {
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== selectUser.id) return user;
          return {
            ...user,
            joinedTeamId: null,
          };
        }),
      );
    }
  };

  const handleSelectTeam = (teamId: Team['id']) => {
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
  };

  const renderUser = (selectUser: User) => {
    return (
      <ChipWithUser
        key={selectUser.id}
        user={selectUser}
        onClickReassign={() => {
          setSelectedUser(selectUser);
          onOpen();
        }}
        onClickDelete={() => {
          if (confirm('배정 해제하겠습니까?')) {
            setUsers((prev) =>
              prev.map((user) => {
                if (user.id !== selectUser.id) return user;
                return {
                  ...user,
                  joinedTeamId: null,
                };
              }),
            );
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
          // @note: 일단 가변 너비로 안해봄
          // width: '100%',
          // maxWidth: '1280px',
          width: '1280px',
          gap: '40px',
          color: '#fff',
          paddingBottom: '80px',
        })}
      >
        <nav
          className={hstack({
            width: '100%',
            height: '142px',
            justifyContent: 'space-between',
            padding: '30px 24px',
            backgroundColor: '#0C0D0E',
            borderRadius: '0 0 40px 40px',
            // position: 'sticky',
            // top: '0',
            // zIndex: '2',
          })}
        >
          <div>
            <h2>{teamBuildingName}</h2>
            <div>stepper</div>
          </div>

          <div>
            <h3>선택 완료 현황</h3>
            <div>progress</div>
          </div>
        </nav>

        <section
          className={vstack({
            width: '100%',
            padding: '60px',
            gap: '80px',
            backgroundColor: '#0C0D0E',
            borderRadius: '40px',
          })}
        >
          <header
            className={vstack({
              width: '100%',
              alignItems: 'flex-start',
              gap: '20px',
            })}
          >
            <h1
              className={css({
                fontSize: '48px',
                fontFamily: 'GmarketSansBold',
                lineHeight: 1,
              })}
            >
              팀 빌딩 게임 진행현황
            </h1>

            <p
              className={css({
                fontSize: '20px',
                color: '#B9BDC5',
              })}
            >
              현재 진행 중인 [ {teamBuildingName} ] 의 현황입니다. <br />
              팀원 이름 태그에 마우스를 호버하여 팀 재배정 혹은 인원 제거를 할
              수 있습니다.
            </p>
          </header>

          <section
            className={vstack({
              width: '100%',
              alignItems: 'flex-start',
              gap: '40px',
            })}
          >
            <div className={hstack({ gap: '80px' })}>
              <h2 className={css({ fontSize: '28px', fontWeight: '800' })}>
                팀 지망 우선순위 표시
              </h2>

              <div className={hstack({ gap: '40px' })}>
                <Chip visual="first" label="1 지망" />
                <Chip visual="second" label="2 지망" />
                <Chip visual="third" label="3 지망" />
                <Chip visual="fourth" label="4 지망" />
                <Chip visual="extra" label="임의배정" />
                <Chip visual="pm" label="PM" />
              </div>
            </div>

            <div
              className={css({
                width: '100%',
                padding: '12px',
                backgroundColor: '#24222A',
                borderRadius: '20px',
              })}
            >
              <table
                className={css({
                  width: '100%',
                  fontSize: '16px',
                  color: '#D5D8DC',
                  '& tr': {
                    height: '52px',
                    borderBottom: '1px solid #2E3138',
                  },
                  // @temp
                  '& thead': {
                    position: 'sticky',
                    top: '0',
                    zIndex: '2',
                    backgroundColor: '#24222A',
                  },
                  '& tbody tr:last-child': {
                    borderBottom: 'none',
                  },
                  '& thead tr': {
                    fontWeight: 'bold',
                    borderBottom: '1px solid #5C6270',
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
                    <th className={css({ width: '164px' })}>디자이너</th>
                    <th className={css({ width: '164px' })}>프론트엔드</th>
                    <th className={css({ width: '164px' })}>백엔드</th>
                    <th className={css({ width: '164px' })}>iOS</th>
                    <th className={css({ width: '164px' })}>안드로이드</th>
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
                          })}
                        >
                          {members
                            .filter((user) => user.position === '프론트엔드')
                            .map((user) => (
                              <ChipWithUser key={user.id} user={user} />
                            ))}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === '백엔드')
                            .map((user) => (
                              <ChipWithUser key={user.id} user={user} />
                            ))}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === 'iOS')
                            .map((user) => (
                              <ChipWithUser key={user.id} user={user} />
                            ))}
                        </div>
                      </td>

                      <td>
                        <div
                          className={vstack({
                            alignItems: 'flex-start',
                            padding: '16px',
                          })}
                        >
                          {members
                            .filter((user) => user.position === '안드로이드')
                            .map((user) => (
                              <ChipWithUser key={user.id} user={user} />
                            ))}
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
                backgroundColor: '#7B5CFE',
                borderRadius: '20px',
                fontSize: '24px',
                fontFamily: 'GmarketSansBold',
                letterSpacing: '-0.48px',
                color: '#fff',
                cursor: 'pointer',
              })}
            >
              팀 빌딩 마치기
            </button>
          </section>
        </section>
      </section>

      <SelectTeamModal
        isOpen={isOpen}
        teams={mockTeams}
        onClose={handleCloseModal}
        onSelect={handleSelectTeam}
      />
    </>
  );
};
