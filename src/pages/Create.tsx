import { ChangeEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import closeIcon from '@/assets/icons/close.svg';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { POSITION_LIST } from '@/utils/const';
import { generateId } from '@/utils/user';

type TeamRow = {
  id: string;
  pmName: string;
  pmPosition: string;
  ideaName: string;
};

const Create = () => {
  const [teamBuildingName, setTeamBuildingName] = useState('');
  const [teamRows, setTeamRows] = useState<TeamRow[]>([]);
  const navigate = useNavigate();

  const handleAddTeamRow = () => {
    const newTeam: TeamRow = {
      id: generateId(), // <- 임시. 서버에 보낼때는 제거해야함
      pmName: '',
      pmPosition: '',
      ideaName: '',
    };
    setTeamRows((prev) => prev.concat(newTeam));
  };
  const handleUpdateTeamRow =
    (id: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTeamRows((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              [name]: value,
            };
          }
          return t;
        }),
      );
    };
  const handleDeleteTeamRow = (id: string) => () => {
    if (confirm('삭제하시겠습니까?')) {
      setTeamRows((prev) => prev.filter((t) => t.id !== id));
    }
  };
  const handleSubmit = () => {
    if (teamBuildingName === '') {
      return alert('팀 빌딩 제목을 입력해주세요.');
    }
    if (teamRows.length === 0) {
      return alert('팀 리스트를 입력해주세요.');
    }
    if (teamRows.some((t) => t.pmName === '')) {
      return alert('PM 이름을 입력해주세요.');
    }
    if (teamRows.some((t) => t.pmPosition === '')) {
      return alert('PM 직군을 선택해주세요.');
    }
    if (teamRows.some((t) => t.ideaName === '')) {
      return alert('아이디어 제목을 입력해주세요.');
    }

    if (
      confirm(
        '입력된 정보를 토대로 생성되며, 이후 팀 정보 수정이 어렵습니다.\n팀 빌딩을 시작하시겠습니까?',
      )
    ) {
      console.log(teamBuildingName, teamRows);
      // @todo: rest api 호출 후 /room-id 로 이동
      // navigate('/room?role=admin');
    }
  };

  return (
    <>
      <section
        className={vstack({
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '1280px',
          margin: '80px auto 160px',
          padding: '60px',
          backgroundColor: '#0C0D0E',
          borderRadius: '40px',
          gap: '80px',
          color: '#fff',
        })}
      >
        <header className={vstack({ alignItems: 'flex-start', gap: '20px' })}>
          <div
            className={hstack({
              width: '100%',
              justifyContent: 'space-between',
            })}
          >
            <h1
              className={css({
                fontSize: '48px',
                fontFamily: 'GmarketSansBold',
                textAlign: 'left',
                lineHeight: '1',
                letterSpacing: '-0.96px',
              })}
            >
              새로운 팀 빌딩 준비하기
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
          </div>

          <p
            className={css({
              width: '100%',
              fontSize: '20px',
              color: '#B9BDC5',
            })}
          >
            이번 팀 빌딩의 제목과 진행되는 팀 목록을 모두 입력해주세요.
            <br />
            입력한 데이터로 팀 빌딩 설문지가 생성됩니다.
          </p>
        </header>

        <section>
          <h2 className={css({ fontSize: '28px', fontWeight: 800 })}>
            팀 빌딩 제목
          </h2>
          <input
            type="text"
            value={teamBuildingName}
            placeholder="ex) 넥스터즈 23기 팀 빌딩"
            className={css({
              width: '100%',
              maxWidth: '600px',
              padding: '16px',
              margin: '20px 0 12px',
              borderRadius: '12px',
              border: '1px solid #000',
              backgroundColor: '#22252A',
              color: '#fff',
            })}
            onChange={(e) => setTeamBuildingName(e.target.value)}
          />
          {/* <p className={css({ fontSize: '14px' })}>
            20자 이상의 제목은 입력이 불가능합니다.
          </p> */}
        </section>

        <section className={vstack({ alignItems: 'flex-start', gap: '20px' })}>
          <h2 className={css({ fontSize: '28px', fontWeight: 800 })}>
            팀 리스트
          </h2>
          <div
            className={vstack({
              width: '100%',
              padding: '16px',
              backgroundColor: '#22252A',
              borderRadius: '28px',
              gap: '40px',
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
                '& tbody tr:last-child': {
                  borderBottom: 'none',
                },
                '& thead tr': {
                  fontWeight: 'bold',
                  borderBottom: '1px solid #5C6270',
                },
                '& th, & td': {
                  textAlign: 'left',
                  paddingLeft: '16px',
                },
              })}
            >
              <thead>
                <tr>
                  <th className={css({ width: '200px' })}>PM 이름</th>
                  <th className={css({ width: '200px' })}>PM 직군</th>
                  <th>아이디어 제목</th>
                  <th className={css({ width: '80px' })}></th>
                </tr>
              </thead>
              <tbody>
                {teamRows.map((team) => (
                  <tr key={team.id}>
                    <td>
                      <input
                        name="pmName"
                        placeholder="PM 이름을 입력해주세요"
                        value={team.pmName}
                        onChange={handleUpdateTeamRow(team.id)}
                        className={css({
                          width: '100%',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: '#fff',
                        })}
                      />
                    </td>
                    <td>
                      <select
                        name="pmPosition"
                        value={team.pmPosition}
                        onChange={handleUpdateTeamRow(team.id)}
                        className={css({
                          width: '100%',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: team.pmPosition === '' ? '#9ca3af' : '#fff',
                        })}
                      >
                        <option value="" disabled>
                          직군을 선택해주세요.
                        </option>
                        {POSITION_LIST.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        name="ideaName"
                        placeholder="아이디어 제목을 입력해주세요"
                        value={team.ideaName}
                        onChange={handleUpdateTeamRow(team.id)}
                        className={css({
                          width: '100%',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: '#fff',
                        })}
                      />
                    </td>
                    <td>
                      <button
                        className={css({
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#17191C',
                          color: '#fff',
                          fontSize: '24px',
                          fontWeight: 600,
                          userSelect: 'none',
                          cursor: 'pointer',
                        })}
                        onClick={handleDeleteTeamRow(team.id)}
                      >
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className={css({
                width: '100%',
                height: '80px',
                borderRadius: '20px',
                backgroundColor: '#17191C',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 600,
                userSelect: 'none',
                cursor: 'pointer',
              })}
              onClick={handleAddTeamRow}
            >
              + 팀 추가하기
            </button>
          </div>
        </section>

        <section className={css({ textAlign: 'right' })}>
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
            onClick={handleSubmit}
          >
            팀 빌딩 시작하기
          </button>
        </section>
      </section>

      <section className=""></section>
    </>
  );
};

export default Create;
