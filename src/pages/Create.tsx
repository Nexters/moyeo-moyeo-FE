import { useState } from 'react';

import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';
import { Team, User } from '@/types';

const Create = () => {
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const { result } = reader;
      const [, ...content] = (result as string).split('\r\n');
      const users: User[] = [];
      const choiceSet = new Set<string>();

      const sanitize = (str: string) => {
        return str.trim().replace(/\s+/g, ' ').replace(/"/g, '');
      };
      const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
      };
      const compareUser = (a: User, b: User) => {
        if (a.position === b.position) {
          return a.name.localeCompare(b.name);
        }
        return a.position.localeCompare(b.position);
      };

      content.forEach((line) => {
        const [name, position, ...choices] = line.split('\t');
        const trimmedChoices = choices.map(sanitize);

        users.push({
          id: generateId(),
          name,
          position: sanitize(position),
          choices: trimmedChoices,
          joined_team_id: null,
        });
        trimmedChoices.forEach((choice) => choiceSet.add(choice));
      });
      users.sort(compareUser);

      const teams = [...choiceSet]
        .sort((a, b) => a.localeCompare(b))
        .map((choice) => ({
          id: generateId(),
          name: choice,
        }));
      // const positions = [...new Set(users.map((user) => user.position))].sort(
      //   (a, b) => a.localeCompare(b),
      // );
      // const maxRound = users
      //   .map((user) => user.choices.length)
      //   .reduce((a, b) => Math.max(a, b), 0);

      setUsers(users);
      setTeams(teams);
    };
    reader.readAsText(file);
  };

  const showPmName = (teamName: Team['name']) => {
    // 번호. 이름 - 설명
    // 위와 같은 형식의 문자열에서 이름만 추출
    return teamName.split('.')[1].split('-')[0].trim();
  };

  const addUser = () => {
    // @todo: 사용자 추가 모달 열기
  };

  const submit = () => {
    // @todo: 서버 호출
  };

  return (
    <main
      className={vstack({
        width: '100vw',
        height: '100vh',
        bg: 'ivory',
        position: 'relative',
        alignItems: 'center',
      })}
    >
      <section
        className={vstack({
          alignItems: 'stretch',
          position: 'absolute',
          top: '36px',
          bottom: '36px',
          overflow: 'auto',
          width: '640px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(23, 25, 28, 0.6)',
          color: '#fff',
          gap: '20px',
          borderRadius: '20px',
          padding: '30px',
        })}
      >
        <h1
          className={css({
            fontSize: '40px',
            fontWeight: '900',
            textAlign: 'left',
            lineHeight: '80px',
          })}
        >
          새로운 팀 빌딩 시작
        </h1>

        <section className={vstack({ alignItems: 'flex-start' })}>
          <h2>생성할 방 이름</h2>
          <input
            type="text"
            value={roomName}
            placeholder="방 이름"
            className={css({ width: '100%' })}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </section>

        <section>
          <h2>참여자 목록 생성</h2>
          <div>
            <input
              type="file"
              placeholder="파일 업로드"
              onChange={(e) => {
                const file = e.target.files?.[0];
                file && readFile(file);
              }}
            />
            <button onClick={addUser}>사용자 추가</button>
          </div>
        </section>

        <h2>팀 구성</h2>
        {/* 팀 목록 */}
        <table>
          <thead>
            <tr>
              <th>ID (총 {teams.length}팀)</th>
              <th>팀 이름</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className={css({
                  '& td': {
                    padding: '0.5rem',
                  },
                })}
              >
                <td>{team.id}</td>
                <td>{team.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 유저 목록 */}
        <h2>참여자 엔트리</h2>
        <table>
          <thead>
            <tr>
              <th>ID (총 {users.length}명)</th>
              <th>이름</th>
              <th>포지션</th>
              <th>1순위</th>
              <th>2순위</th>
              <th>3순위</th>
              <th>4순위</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={css({
                  '& td': {
                    padding: '0.5rem',
                  },
                })}
              >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.position}</td>
                <td>{showPmName(user.choices[0])}</td>
                <td>{showPmName(user.choices[1])}</td>
                <td>{showPmName(user.choices[2])}</td>
                <td>{showPmName(user.choices[3])}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section>
          <button onClick={submit}>전략적 팀 빌딩 시작</button>
        </section>
      </section>
    </main>
  );
};

export default Create;
