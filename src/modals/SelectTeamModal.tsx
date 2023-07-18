import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { Team } from '@/types';

export type AddUserModalProps = {
  isOpen: boolean;
  teams: Team[];
  onClose: () => void;
  onSelect: (teamId: Team['id']) => void;
};

export const SelectTeamModal = ({
  isOpen,
  teams,
  onClose,
  onSelect,
}: AddUserModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section>
        <select
          className={css({
            width: '360px',
            height: '80px',
            padding: '0 30px',
            fontSize: '23px',
            fontWeight: 900,
            backgroundColor: 'rgb(23, 25, 28)',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            '& option': {
              fontSize: '12px',
            },
          })}
          onChange={(e) => {
            const teamId = e.target.value as Team['id'];
            if (!teamId) return;

            onSelect?.(teamId);
            onClose();
          }}
        >
          <option value="">팀 선택</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.pmName} 팀
            </option>
          ))}
        </select>
      </section>
    </Modal>
  );
};
