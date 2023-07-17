import { type ChangeEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { mockTeams } from '@/mock/data';
import { css } from '@/styled-system/css';
import { container, vstack } from '@/styled-system/patterns';

type EntryProps = {
  handleRole: (role: 'admin' | 'player') => void;
};

const ROOM_NAME = 'NEXTERS 23기 팀 빌딩 - 방 제목';

export const Entry = ({ handleRole }: EntryProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const teams = mockTeams.reduce((acc, cur) => {
    acc.push(cur.pmName);
    return acc;
  }, [] as string[]);

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedTeam(e.target.value);
  };

  return (
    <section
      className={container({
        width: '400px',
        backgroundColor: 'rgba(12, 13, 14, 0.6)',
        borderRadius: '40px',
        color: 'white',
        padding: '30px',
      })}
    >
      <div>
        <h1 className={css({ fontSize: '40px', fontWeight: '900' })}>
          전략적 팀 빌딩 참가
        </h1>
        <div
          className={css({
            fontSize: '17px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.8)',
          })}
        >
          {ROOM_NAME}
        </div>
      </div>
      <div
        className={css({
          width: '100%',
          marginTop: '80px',
        })}
      >
        <h2 className={css({ fontSize: '17px', fontWeight: '800' })}>
          자신의 팀을 선택해주세요
        </h2>
        <select
          onChange={handleChangeSelect}
          className={selectClassName}
          value={selectedTeam}
        >
          <option value="">팀 선택</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <div
        className={vstack({
          width: '100%',
          gap: '20px',
          marginTop: '60px',
        })}
      >
        <span
          onClick={() => handleRole('admin')}
          className={css({
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
          })}
        >
          관리자로 참여
        </span>
        <Button
          disabled={!selectedTeam}
          size="large"
          onClick={() => handleRole('player')}
        >
          전략적 팀 빌딩 시작
        </Button>
      </div>
    </section>
  );
};

const selectClassName = css({
  fontSize: '23px',
  padding: '26px',
  background: '#17191C',
  color: 'white',
  borderRadius: '20px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  width: '100%',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  fontWeight: '900',
  marginTop: '20px',
  _hover: {
    border: '2px solid #0F83F7',
  },
});
