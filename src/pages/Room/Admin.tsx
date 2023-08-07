import { useMemo, useState } from 'react';

import toast from 'react-hot-toast';

import warningIcon from '@/assets/icons/warning.svg';
import { Button } from '@/components/Button';
import { CardInAdmin } from '@/components/CardInAdmin';
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

  const allMemberByTeam = useMemo(() => {
    const allMemberByTeam: Record<Team['pmName'], User[]> = {};

    mockTeams.forEach((team) => {
      allMemberByTeam[team.pmName] = users.filter(
        (user) => user.joinedTeamId === team.id,
      );
    });
    allMemberByTeam['남은 인원'] = users.filter(
      (user) => user.joinedTeamId === null,
    );

    return Object.entries(allMemberByTeam);
  }, [users]);

  const helperText = useMemo(() => {
    if (selectedRound === '종료')
      return '최종확정 라운드가 끝나면 \n"전략적 팀 빌딩 종료" \n버튼을 눌러주세요.';
    if (selectedRound === '자유')
      return '자유배정 라운드에서는 \n아직 선택받지 못한 인원을 \n적절하게 분배해주세요.';
    return '관리자 권한으로 팀원을 \n임의 배정할 수 있습니다.';
  }, [selectedRound]);

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
        className={hstack({
          width: '100%',
          height: '100%',
          overflow: 'auto',
          alignItems: 'stretch',
          padding: '36px 40px 0',
          gap: '20px',
          color: '#fff',
        })}
      >
        <section
          className={vstack({
            flexShrink: 0,
            width: '200px',
            gap: '20px',
          })}
        >
          <aside
            className={vstack({
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '20px',
              borderRadius: '20px',
              gap: '40px',
              overflow: 'auto',
            })}
          >
            <section>
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
            </section>

            <section className={vstack({ width: '100%', gap: '15px' })}>
              <Button visual="secondary" className={css({ textAlign: 'left' })}>
                현황 한눈에 보기
              </Button>
              <Button visual="secondary" className={css({ textAlign: 'left' })}>
                결과 이미지 저장
              </Button>
              <Button visual="secondary" className={css({ textAlign: 'left' })}>
                참여자 추가
              </Button>
              <Button visual="secondary" className={css({ textAlign: 'left' })}>
                초대 링크 공유
              </Button>
              <Button
                visual="red"
                className={css({ textAlign: 'left' })}
                disabled={users.some((user) => user.joinedTeamId === null)}
                onClick={() =>
                  alert(
                    '팀 빌딩이 종료되었습니다. (이후 뭐가 나오면 좋을지 고민 중)',
                  )
                }
              >
                전략적 팀 빌딩 종료
              </Button>
            </section>

            <section
              className={vstack({
                width: '100%',
                gap: '15px',
                alignItems: 'flex-start',
              })}
            >
              <h2 className={css({ fontSize: '15px', fontWeight: 900 })}>
                진행중인 라운드
              </h2>

              <select
                name="round"
                value={selectedRound}
                className={css({
                  width: '100%',
                  height: '50px',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: 'rgba(23, 25, 28, 0.8)',
                  borderRadius: '10px',
                  color: '#fff',
                })}
                onChange={(e) => setSelectedRound(e.target.value as Round)}
              >
                {/* <option value="">라운드 선택</option> */}
                {rounds.map((round) => (
                  <option key={round} value={round}>
                    {round}
                  </option>
                ))}
              </select>
            </section>
          </aside>

          <section
            className={vstack({
              width: '100%',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '20px',
              borderRadius: '20px',
              gap: '15px',
            })}
          >
            <img width="30px" height="30px" src={warningIcon} />
            <p
              className={css({
                fontSize: '15px',
                lineHeight: '1.2',
                fontWeight: 900,
                whiteSpace: 'pre-line',
              })}
            >
              {helperText}
            </p>
          </section>
        </section>

        <section
          className={vstack({
            flex: 1,
            alignItems: 'flex-start',
            paddingBottom: '36px',
          })}
        >
          <h1
            className={css({
              padding: '20px',
              fontSize: '25px',
              fontWeight: 900,
            })}
          >
            NEXTERS 23기 팀 빌딩
          </h1>

          <section
            className={css({
              flex: 1,
              // width: '980px',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '30px',
              borderRadius: '20px',
              overflow: 'auto',
            })}
          >
            <table
              className={css({
                width: '100%',
                '& thead': {
                  fontSize: '25px',
                  fontWeight: 800,
                  textAlign: 'left',
                },
                '& tbody': {
                  fontSize: '18px',
                  fontWeight: 600,
                  textAlign: 'left',
                },
                '& tbody tr': {
                  borderTop: '1px solid #fff',
                },
                '& thead th:first-child': {
                  width: '140px',
                },
                '& thead th:last-child': {
                  width: '200px',
                },
                '& th, & td': {
                  paddingLeft: '20px',
                  lineHeight: '55px',
                  verticalAlign: 'baseline',
                },
              })}
            >
              <thead>
                <tr>
                  <th>PM</th>
                  <th>멤버</th>
                  <th>인원 (총 {users.length}명)</th>
                </tr>
              </thead>
              <tbody>
                {allMemberByTeam.map(([pmName, members]) => (
                  <tr key={pmName}>
                    <td>{pmName}</td>
                    <td
                      className={hstack({
                        flexWrap: 'wrap',
                        padding: '10px',
                        gap: '10px',
                      })}
                    >
                      {members.map((m) => (
                        <CardInAdmin
                          key={m.id}
                          name={m.name}
                          position={m.position}
                          selectedRound={m.choices.findIndex((c) =>
                            c.includes(pmName),
                          )}
                          selected={m.joinedTeamId !== null}
                          onClick={handleClickMember(m)}
                        />
                      ))}
                    </td>
                    <td>{members.length}명</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
