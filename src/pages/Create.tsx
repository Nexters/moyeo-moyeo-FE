import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import closeIcon from '@/assets/close.svg';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { useDisclosure } from '@/hooks/useDisclosure';
import { AddUserModal } from '@/modals/AddUserModal';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { Team, User } from '@/types';
import { compareUser, generateId } from '@/utils/user';

const Create = () => {
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  const cannotOpenAddUserModal = !users.length || !teams.length;
  const cannotSubmit = !roomName || cannotOpenAddUserModal;

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const { result } = reader;
      const [, ...content] = (result as string).split('\r\n');
      const users: User[] = [];
      const choiceSet = new Set<string>();

      // @note: tsv 파일에서 불필요한 공백과 따옴표를 제거합니다.
      const sanitize = (str: string) => {
        return str.trim().replace(/\s+/g, ' ').replace(/"/g, '');
      };

      // @note: `{팀 번호}. {팀 이름 = PM 이름 - 아이디어 이름}` 형식에서 팀 번호와 PM 및 아이디어 이름을 추출합니다.
      const getTeamNumberAndNames = (choice: string) => {
        const dotIndex = choice.indexOf('.');
        const num = choice.slice(0, dotIndex);
        const name = choice.slice(dotIndex + 1).trim();
        const dashIndex = name.indexOf('-');
        const pmName = name.slice(0, dashIndex).trim();
        const ideaName = name.slice(dashIndex + 1).trim();
        return {
          num: parseInt(num),
          pmName,
          ideaName,
        };
      };

      content.forEach((line) => {
        const [name, position, ...choices] = line.split('\t');
        const trimmedChoices = choices.map(sanitize);

        users.push({
          id: generateId(),
          name,
          position: sanitize(position),
          choices: trimmedChoices,
          joinedTeamId: null,
        });
        trimmedChoices.forEach((choice) => choiceSet.add(choice));
      });
      users.sort(compareUser);

      const teams = [...choiceSet]
        .map((choice) => ({
          id: choice,
          ...getTeamNumberAndNames(choice),
        }))
        .sort((a, b) => a.num - b.num);
      const positions = [...new Set(users.map((user) => user.position))].sort(
        (a, b) => a.localeCompare(b),
      );
      // const maxRound = users
      //   .map((user) => user.choices.length)
      //   .reduce((a, b) => Math.max(a, b), 0);

      setUsers(users);
      setTeams(teams);
      setPositions(positions);
    };
    reader.readAsText(file);
  };

  const showPmName = (teamId: Team['id']) => {
    // 번호. 이름 - 설명
    // 위와 같은 형식의 문자열에서 이름만 추출
    return teams.find((team) => team.id === teamId)?.pmName;
  };

  const onAddUser = ({
    name,
    choices,
    position,
  }: Pick<User, 'name' | 'position' | 'choices'>) => {
    setUsers((prev) => [
      {
        id: generateId(),
        name,
        choices,
        position,
        joinedTeamId: null,
      },
      ...prev,
    ]);
  };

  const submit = () => {
    // @todo: 서버 호출 후 /room-id 로 이동
    navigate('/fake-room-id');
  };

  return (
    <>
      <section
        className={vstack({
          alignItems: 'stretch',
          overflow: 'auto',
          width: '640px',
          height: '90%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(23, 25, 28, 0.6)',
          color: '#fff',
          gap: '20px',
          borderRadius: '20px',
          padding: '30px',
        })}
      >
        <header
          className={hstack({
            justifyContent: 'space-between',
            lineHeight: '80px',
          })}
        >
          <h1
            className={css({
              fontSize: '40px',
              fontWeight: '900',
              textAlign: 'left',
            })}
          >
            새로운 팀 빌딩 시작
          </h1>

          <button
            aria-label="홈으로 돌아가기"
            className={css({ cursor: 'pointer' })}
            onClick={() => navigate('/')}
          >
            <img
              className={css({ width: '40px', height: '40px' })}
              src={closeIcon}
            />
          </button>
        </header>

        <section className={vstack({ alignItems: 'flex-start' })}>
          <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>
            생성할 방 이름
          </h2>
          <Input
            type="text"
            value={roomName}
            placeholder="개최할 이벤트를 간단히 소개해주세요."
            onChange={(e) => setRoomName(e.target.value)}
          />
        </section>

        <section className={vstack({ alignItems: 'flex-start' })}>
          <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>
            참여자 목록 생성
          </h2>
          <div className={hstack({ width: '100%' })}>
            <Input
              type="file"
              placeholder="파일 업로드"
              accept=".tsv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                file && readFile(file);
              }}
            />
            <Button
              className={css({ width: '120px !important', flexShrink: '0' })}
              disabled={cannotOpenAddUserModal}
              onClick={onOpen}
            >
              사용자 추가
            </Button>
          </div>
        </section>

        <section className={vstack({ alignItems: 'flex-start' })}>
          <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>
            팀 구성
          </h2>
          <Table>
            <thead>
              <tr>
                <th>PM</th>
                <th>아이디어</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.pmName}</td>
                  <td>{team.ideaName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section className={vstack({ alignItems: 'flex-start' })}>
          <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>
            참여자 엔트리
          </h2>
          <Table>
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.position}</td>
                  <td>{showPmName(user.choices[0])}</td>
                  <td>{showPmName(user.choices[1])}</td>
                  <td>{showPmName(user.choices[2])}</td>
                  <td>{showPmName(user.choices[3])}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section>
          <Button size="large" disabled={cannotSubmit} onClick={submit}>
            전략적 팀 빌딩 시작
          </Button>
        </section>
      </section>

      <AddUserModal
        isOpen={isOpen}
        positions={positions}
        teams={teams}
        onAddUser={onAddUser}
        onClose={onClose}
      />
    </>
  );
};

export default Create;
