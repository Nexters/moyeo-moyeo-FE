import { useState } from 'react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { Team, User } from '@/types';

const Create = () => {
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const cannotAddUser = !users.length || !teams.length;
  const cannotSubmit = !roomName || cannotAddUser;

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
      const getTeamNumberAndName = (choice: string) => {
        const [number, name] = choice.split('. ');
        return {
          num: parseInt(number),
          name,
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
          joined_team_id: null,
        });
        trimmedChoices.forEach((choice) => choiceSet.add(choice));
      });
      users.sort(compareUser);

      const teams = [...choiceSet]
        .map((choice) => ({
          id: choice,
          ...getTeamNumberAndName(choice),
        }))
        .sort((a, b) => a.num - b.num);
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
            disabled={cannotAddUser}
            onClick={addUser}
          >
            사용자 추가
          </Button>
        </div>
      </section>

      <section className={vstack({ alignItems: 'flex-start' })}>
        <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>팀 구성</h2>
        <table
          className={css({
            width: '100%',
            padding: '10px 0',
            backgroundColor: '#17191c99',
            borderRadius: '20px',
            '& thead': {
              fontWeight: 'bold',
              borderBottom: '1px solid #fff9',
            },
            '& tr': {
              height: '50px',
            },
            '& th, & td': {
              textAlign: 'left',
              paddingLeft: '16px',
            },
          })}
        >
          <thead>
            <tr>
              <th>팀 번호</th>
              <th>팀 이름</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.num}</td>
                <td>{team.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={vstack({ alignItems: 'flex-start' })}>
        <h2 className={css({ fontSize: '17px', fontWeight: 800 })}>
          참여자 엔트리
        </h2>
        <table
          className={css({
            width: '100%',
            padding: '10px 0',
            backgroundColor: '#17191c99',
            borderRadius: '20px',
            fontSize: '15px',
            '& thead': {
              fontWeight: 'bold',
              borderBottom: '1px solid #fff9',
            },
            '& tr': {
              height: '50px',
            },
            '& th, & td': {
              textAlign: 'left',
              paddingLeft: '16px',
            },
          })}
        >
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
        </table>
      </section>

      <section>
        <Button size="large" disabled={cannotSubmit} onClick={submit}>
          전략적 팀 빌딩 시작
        </Button>
      </section>
    </section>
  );
};

export default Create;
