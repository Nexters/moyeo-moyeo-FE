import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { mockTeams } from '@/mock/data';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';
import { Team } from '@/types.old';

type EntryProps = {
  setRole: (role: 'admin' | 'player') => void;
  teamId?: Team['id'] | null;
  setTeamId: (teamId: Team['id']) => void;
};

const ROOM_NAME = 'NEXTERS 23기 팀 빌딩 - 방 제목';

export const Entry = ({ setRole, teamId, setTeamId }: EntryProps) => {
  return (
    <section
      className={vstack({
        gap: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: '20px',
        padding: '80px 40px',
        backdropFilter: 'blur(50px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'GmarketSansBold',
          fontSize: '48px',
          fontWeight: '400',
          textAlign: 'center',
          lineHeight: '1',
          color: 'gray.5',
        })}
      >
        {ROOM_NAME}
      </h1>
      <span
        className={css({
          textStyle: 'p1',
          color: 'gray.10',
          marginTop: '120px',
        })}
      >
        자신에게 해당하는 아이디어를 선택해주세요
      </span>
      <div
        className={vstack({
          width: '330px',
          margin: '0 auto',
          gap: '0',
        })}
      >
        <div className={css({ width: '100%', marginTop: '12px' })}>
          <Select
            placeholder="본인의 아이디어를 선택해주세요"
            options={mockTeams.map((team) => ({
              value: team.id,
              label: team.id,
            }))}
            onChange={(e) => {
              setTeamId(e?.value || '');
            }}
          />
        </div>
        <Button
          disabled={!teamId}
          size="medium"
          onClick={() => setRole('player')}
          className={css({ marginTop: '80px' })}
        >
          PM으로 입장하기
        </Button>
        <button
          type="button"
          onClick={() => setRole('admin')}
          className={css({
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '12px',
            marginTop: '12px',
          })}
        >
          운영진으로 참여하기
        </button>
      </div>
    </section>
  );
};
