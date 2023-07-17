import { useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { mockTeams, mockUsers } from '@/mocks/data';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { Team } from '@/types';

type Round = '1지망' | '2지망' | '3지망' | '4지망' | '자유';
const rounds: Round[] = ['1지망', '2지망', '3지망', '4지망', '자유'];
const roundIndexMap = {
  '1지망': 0,
  '2지망': 1,
  '3지망': 2,
  '4지망': 3,
};

export const Admin = () => {
  // @note: 유저 목록을 복사한 이유는 선택된 팀에 대한 정보를 반영하기 위함
  const [users, setUsers] = useState(mockUsers);
  const [selectedTeamId, setSelectedTeamId] = useState<Team['id'] | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round>('1지망');

  const selectedTeamMembers = useMemo(() => {
    return users.filter((user) => {
      // 아무 팀도 선택하지 않으면 모두 보여준다.
      if (selectedTeamId === null) return true;

      // 멤버 = 해당 팀에 배정된 유저
      const isSelectedTeamMember = user.joinedTeamId === selectedTeamId;
      if (selectedRound === '자유') {
        // 자유: 아직 선택되지 않은 유저와 해당 팀 멤버만 보여준다.

        return user.joinedTeamId === null || isSelectedTeamMember;
      } else {
        // 1순위 ~ 4순위 라운드: 팀에 선택된 유저와 아직 배정되지 않은 유저만 보여준다.
        if (user.joinedTeamId !== null) return isSelectedTeamMember;
        return user.choices[roundIndexMap[selectedRound]] === selectedTeamId;
      }
    });
  }, [users, selectedRound, selectedTeamId]);

  const toggleSelect = (userId: string) => {
    if (selectedTeamId === null)
      return alert('팀 지정 되지 않은 상태에선 선택할 수 없습니다.');

    setUsers((prev) => {
      return prev.map((user) => {
        if (user.id !== userId) return user;
        return {
          ...user,
          joinedTeamId:
            user.joinedTeamId === selectedTeamId ? null : selectedTeamId,
        };
      });
    });
  };

  return (
    <>
      <section
        className={hstack({
          width: '100%',
          height: '100%',
          overflow: 'auto',
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
            alignItems: 'flex-start',
            backgroundColor: '#0c0d0e99',
            backdropFilter: 'blur(10px)',
            border: '1px solid #17191c',
            padding: '20px',
            borderRadius: '20px',
            gap: '40px',
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
            <Button visual="secondary">전체 현황 보기</Button>
            <Button visual="secondary">결과 이미지 저장</Button>
            <Button visual="secondary">참여자 추가</Button>
            <Button visual="secondary">초대코드 공유</Button>
            <Button visual="red">전략적 팀 빌딩 종료</Button>
          </section>

          <section className={css({ width: '100%' })}>
            <h2>
              현재 라운드는 <b>{selectedRound}</b>
            </h2>

            <select
              name="round"
              value={selectedRound}
              className={css({
                width: '100%',
                padding: '10px',
                border: 'none',
                backgroundColor: '#fff',
                borderRadius: '10px',
                color: '#222',
              })}
              onChange={(e) => setSelectedRound(e.target.value as Round)}
            >
              <option value="">라운드 선택</option>
              {rounds.map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </section>
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
          <section
            className={css({
              flex: 1,
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridGap: '25px',
              width: '880px',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '30px',
              borderRadius: '20px',
              overflow: 'auto',
            })}
          >
            {selectedTeamMembers.map((user) => (
              <Card
                key={user.id}
                name={user.name}
                position={user.position}
                selected={
                  selectedTeamId !== null
                    ? user.joinedTeamId === selectedTeamId
                    : user.joinedTeamId !== null
                }
                onClick={() => toggleSelect(user.id)}
              />
            ))}
          </section>
        </section>
      </section>

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
                backgroundColor: '#0c0d0e99',
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
              {team.name}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
