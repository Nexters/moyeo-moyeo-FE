import { ChangeEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCreateTeamBuilding } from '@/apis/admin/mutations';
import closeIcon from '@/assets/icons/close.svg';
import TrashBinIcon from '@/assets/icons/trashbin.svg?react';
import { Button } from '@/components/Button';
import { css } from '@/styled-system/css';
import { center, hstack, vstack } from '@/styled-system/patterns';
import { Position } from '@/types';
import {
  MAX_LENGTH__TEAM_BUILDING_NAME,
  MAX_LENGTH__TEAM_NAME,
  MAX_LENGTH__USER_NAME,
  POSITION_LIST,
} from '@/utils/const';
import { playSound } from '@/utils/sound';
import { isTrulyEmptyString } from '@/utils/string';
import { toastWithSound } from '@/utils/toast';
import { keepScroll } from '@/utils/ui';
import { generateId } from '@/utils/user';

type TeamRow = {
  id: string;
  pmName: string;
  pmPosition: string;
  teamName: string;
};

const Create = () => {
  const [teamBuildingName, setTeamBuildingName] = useState('');
  const [teamRows, setTeamRows] = useState<TeamRow[]>([]);
  const [isClickedSubmit, setIsClickedSubmit] = useState(false);
  const mutation = useCreateTeamBuilding();
  const navigate = useNavigate();

  const handleAddTeamRow = () => {
    playSound('버튼_클릭');
    keepScroll(() => {
      const newTeam: TeamRow = {
        id: generateId(), // <- 임시. 서버에 보낼때는 제거해야함
        pmName: '',
        pmPosition: '',
        teamName: '',
      };
      setTeamRows((prev) => prev.concat(newTeam));
    });
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
    const row = teamRows.find((t) => t.id === id);
    const isEmptyRow = Object.entries(row ?? {}).every(([key, value]) => {
      if (key === 'id') return true;
      return isTrulyEmptyString(value);
    });

    if (isEmptyRow || confirm('입력한 값이 존재합니다.\n삭제하시겠습니까?')) {
      keepScroll(() => setTeamRows((prev) => prev.filter((t) => t.id !== id)));
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsClickedSubmit(true);

    if (isTrulyEmptyString(teamBuildingName)) {
      return toastWithSound.error('팀 빌딩 제목을 입력해주세요.');
    }
    if (teamRows.length === 0) {
      return toastWithSound.error('팀 리스트를 입력해주세요.');
    }
    if (teamRows.some((t) => isTrulyEmptyString(t.pmName))) {
      return toastWithSound.error('PM 이름을 입력해주세요.');
    }
    if (teamRows.some((t) => isTrulyEmptyString(t.pmPosition))) {
      return toastWithSound.error('PM 직군을 선택해주세요.');
    }
    if (teamRows.some((t) => isTrulyEmptyString(t.teamName))) {
      return toastWithSound.error('팀 이름을 입력해주세요.');
    }

    if (
      confirm(
        '입력된 정보를 토대로 생성되며, 이후 팀 정보 수정이 어렵습니다.\n팀 빌딩을 시작하시겠습니까?',
      )
    ) {
      // rest api 호출 후 /room-id 로 이동
      mutation.mutate(
        {
          body: {
            name: teamBuildingName,
            teams: teamRows.map((t) => ({
              name: t.teamName,
              pmName: t.pmName,
              pmPosition: t.pmPosition as Position,
            })),
          },
        },
        {
          onSuccess: ({ teamBuildingInfo }) => {
            navigate(`/${teamBuildingInfo.teamBuildingUrl}?role=admin`);
            playSound('페이지_전환');
          },
          onError: () => {
            toastWithSound.error(
              '팀 빌딩 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
          },
        },
      );
    }
  };

  return (
    <>
      <form
        className={vstack({
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '1280px',
          margin: '80px auto 160px',
          padding: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(50px)',
          borderRadius: '40px',
          gap: '80px',
          color: 'gray.5',
        })}
        onSubmit={handleSubmit}
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
              type="button"
              aria-label="홈으로 돌아가기"
              className={css({ cursor: 'pointer' })}
              onClick={() => {
                playSound('페이지_전환');
                navigate('/');
              }}
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
              color: 'gray.30',
            })}
          >
            이번 팀 빌딩의 제목과 진행되는 팀 목록을 모두 입력해주세요.
            <br />
            입력한 데이터로 팀 빌딩 설문지가 생성됩니다.
          </p>
        </header>

        <section>
          <h2 className={css({ textStyle: 'h1' })}>팀 빌딩 제목</h2>
          <input
            type="text"
            value={teamBuildingName}
            placeholder="ex) 넥스터즈 23기 팀 빌딩"
            maxLength={MAX_LENGTH__TEAM_BUILDING_NAME}
            autoComplete="off"
            className={css({
              width: '100%',
              maxWidth: '600px',
              padding: '16px',
              margin: '20px 0 8px',
              border:
                isClickedSubmit && isTrulyEmptyString(teamBuildingName)
                  ? '2px solid token(colors.red.60)'
                  : '2px solid transparent',
              borderRadius: '12px',
              backgroundColor: 'rgba(12, 13, 14, 0.50)',
              textStyle: 'p1',
              color: 'gray.5',
            })}
            onChange={(e) => setTeamBuildingName(e.target.value)}
          />
          <p
            className={css({
              textStyle: 'p3',
              padding: '0 8px',
              color:
                isClickedSubmit && isTrulyEmptyString(teamBuildingName)
                  ? 'red.60'
                  : undefined,
            })}
          >
            {isClickedSubmit && isTrulyEmptyString(teamBuildingName)
              ? '제목을 입력해주세요.'
              : '20자 이상의 제목은 입력이 불가능합니다.'}
          </p>
        </section>

        <section className={vstack({ alignItems: 'flex-start', gap: '20px' })}>
          <h2 className={css({ textStyle: 'h1' })}>팀 리스트</h2>
          <div
            className={vstack({
              width: '100%',
              padding: '16px',
              backgroundColor: 'rgba(12, 13, 14, 0.40)',
              borderRadius: '20px',
              gap: '40px',
            })}
          >
            <table
              className={css({
                width: '100%',
                fontSize: '16px',
                color: 'gray.20',
                '& tr': {
                  height: '52px',
                  borderBottom: '1px solid #FFFFFF47',
                },
                '& tbody tr:last-child': {
                  borderBottom: 'none',
                },
                '& thead tr': {
                  fontWeight: 'bold',
                  borderBottom: '1px solid token(colors.gray.30)',
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
                  <th>팀 이름</th>
                  <th className={css({ width: '56px' })}></th>
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
                        maxLength={MAX_LENGTH__USER_NAME}
                        autoComplete="off"
                        onChange={handleUpdateTeamRow(team.id)}
                        className={css({
                          width: '100%',
                          height: '56px',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: 'gray.5',
                          border:
                            isClickedSubmit && isTrulyEmptyString(team.pmName)
                              ? '2px solid token(colors.red.60)'
                              : '2px solid transparent',
                          borderRadius: '4px',
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
                          height: '56px',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: isTrulyEmptyString(team.pmPosition)
                            ? '#9ca3af'
                            : 'gray.5',
                          border:
                            isClickedSubmit &&
                            isTrulyEmptyString(team.pmPosition)
                              ? '2px solid token(colors.red.60)'
                              : '2px solid transparent',
                          borderRadius: '4px',
                          '& option': {
                            backgroundColor: 'rgba(12, 13, 14, 0.50)',
                            color: 'gray.5',
                          },
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
                        name="teamName"
                        placeholder="팀 이름을 입력해주세요"
                        value={team.teamName}
                        maxLength={MAX_LENGTH__TEAM_NAME}
                        autoComplete="off"
                        onChange={handleUpdateTeamRow(team.id)}
                        className={css({
                          width: '100%',
                          height: '56px',
                          padding: '16px 0',
                          backgroundColor: 'transparent',
                          color: 'gray.5',
                          border:
                            isClickedSubmit && isTrulyEmptyString(team.teamName)
                              ? '2px solid token(colors.red.60)'
                              : '2px solid transparent',
                          borderRadius: '4px',
                        })}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={center({
                          width: '56px',
                          height: '56px',
                          cursor: 'pointer',
                          '& svg path': {
                            fill: '#FFFFFF29',
                          },
                        })}
                        onClick={handleDeleteTeamRow(team.id)}
                      >
                        <TrashBinIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className={css({
                width: '100%',
                height: '80px',
                borderRadius: '20px',
                backgroundColor: 'rgba(12, 13, 14, 0.50)',
                color: 'gray.5',
                textStyle: 'h2',
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
          <Button
            type="submit"
            color="primary"
            size="medium"
            disabled={mutation.isPending}
            className={css({
              width: '320px !important',
            })}
          >
            {mutation.isPending ? '팀 빌딩 생성 중...' : '팀 빌딩 시작하기'}
          </Button>
        </section>
      </form>
    </>
  );
};

export default Create;
