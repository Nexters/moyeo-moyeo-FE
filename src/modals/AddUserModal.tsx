import { ChangeEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Table } from '@/components/Table';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';
import { Team, User } from '@/typesOld';

export type AddUserModalProps = {
  isOpen: boolean;
  positions: string[];
  teams: Team[];
  onClose: () => void;
  onAddUser: (user: Pick<User, 'name' | 'position' | 'choices'>) => void;
};

const defaultInputs = {
  name: '',
  position: '',
  team1: '',
  team2: '',
  team3: '',
  team4: '',
};

export const AddUserModal = ({
  isOpen,
  positions,
  teams,
  onAddUser,
  onClose,
}: AddUserModalProps) => {
  const [inputs, setInputs] = useState(defaultInputs);
  const { name, position, team1, team2, team3, team4 } = inputs;

  const handleChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value.trimStart() }));
  };
  const handleClickAddUser = () => {
    const choices = [team1, team2, team3, team4];
    const isAllEmpty = choices.every((c) => c === '');
    const isAllFull = choices.every((c) => c !== '');

    if (!name) return alert('이름을 입력해주세요.');
    if (!position) return alert('포지션을 선택해주세요.');
    if (!isAllEmpty && !isAllFull)
      return alert('팀을 모두 선택하거나 모두 선택 해제하세요.');

    onAddUser({
      name,
      position,
      choices: isAllEmpty ? [] : choices,
    });
    setInputs(defaultInputs);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section
        className={vstack({
          padding: '30px',
          alignItems: 'flex-start',
          backgroundColor: '#0c0d0e',
          color: '#fff',
          gap: '20px',
        })}
      >
        <h2 className={css({ fontSize: '17px', fontWeight: '800' })}>
          엔트리 등록
        </h2>
        <Table className={css({ backgroundColor: 'transparent' })}>
          <thead>
            <tr>
              <th>이름</th>
              <th>포지션</th>
              <th>1지망</th>
              <th>2지망</th>
              <th>3지망</th>
              <th>4지망</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className={inputClassName}
                  name="name"
                  value={name}
                  placeholder="직접 입력"
                  onChange={handleChangeInput}
                />
              </td>
              <td>
                <select
                  name="position"
                  className={selectClassName}
                  value={position}
                  onChange={handleChangeInput}
                >
                  <option value="">포지션 선택</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="team1"
                  className={selectClassName}
                  value={team1}
                  onChange={handleChangeInput}
                >
                  <option value="">팀 선택</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.pmName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="team2"
                  className={selectClassName}
                  value={team2}
                  onChange={handleChangeInput}
                >
                  <option value="">팀 선택</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.pmName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="team3"
                  className={selectClassName}
                  value={team3}
                  onChange={handleChangeInput}
                >
                  <option value="">팀 선택</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.pmName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="team4"
                  className={selectClassName}
                  value={team4}
                  onChange={handleChangeInput}
                >
                  <option value="">팀 선택</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.pmName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </Table>

        <Button onClick={handleClickAddUser}>참여자 추가</Button>
      </section>
    </Modal>
  );
};
const inputClassName = css({
  width: '80px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#fff',
});

const selectClassName = css({
  width: '120px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#fff',
});
