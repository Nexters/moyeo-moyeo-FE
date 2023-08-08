import { useMemo, useState } from 'react';

import arrowUp from '@/assets/icons/arrowUp.svg';
import face from '@/assets/icons/face.svg';
import group from '@/assets/icons/group.svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { mockUsers } from '@/mock/data';
import { css } from '@/styled-system/css';
import { grid, hstack, stack, vstack } from '@/styled-system/patterns';
import { Round, Team, User } from '@/types.old';

type PlayerProps = {
  teamId: Team['id'];
};
export const Player = ({ teamId }: PlayerProps) => {
  const [users, setUsers] = useState(mockUsers);

  const filteredSelectedUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.joinedTeamId !== teamId) return false;
      return true;
    });
  }, [teamId, users]);
  return (
    <div
      className={vstack({
        width: '100%',
        height: '100vh',
        minWidth: '1920px',
        gap: '30px',
        padding: '0 100px',
      })}
    >
      <section
        className={hstack({
          width: '100%',
          gap: '80px',
        })}
      >
        <div
          className={stack({
            flex: 1,
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(50px)',
            padding: '25px 30px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '0 0 40px 40px',
          })}
        >
          <h1
            className={css({
              textStyle: 'h1',
              color: 'gray.5',
            })}
          >
            Nexters23기 팀빌딩입니다
          </h1>
          <div className={hstack()}>
            <div
              className={hstack({
                flex: 1,
              })}
            >
              <span
                className={hstack({
                  color: 'gray.5',
                  border: '1px solid rgba(255, 255, 255, 0.53)',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  textStyle: 'h3',
                })}
              >
                <img src={face} />
                1지망
              </span>
              <span
                className={css({
                  width: '20px',
                  height: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.19)',
                  borderRadius: '5px',
                })}
              />
              <span
                className={hstack({
                  color: 'gray.5',
                  border: '1px solid rgba(255, 255, 255, 0.53)',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  textStyle: 'h3',
                })}
              >
                <img src={face} />
                2지망
              </span>
              <span
                className={css({
                  width: '20px',
                  height: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.19)',
                  borderRadius: '5px',
                })}
              />
              <span
                className={hstack({
                  color: 'gray.5',
                  border: '1px solid rgba(255, 255, 255, 0.53)',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  textStyle: 'h3',
                })}
              >
                <img src={face} />
                3지망
              </span>
              <span
                className={css({
                  width: '20px',
                  height: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.19)',
                  borderRadius: '5px',
                })}
              />
              <span
                className={hstack({
                  color: 'gray.5',
                  border: '1px solid rgba(255, 255, 255, 0.53)',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  textStyle: 'h3',
                })}
              >
                <img src={face} />
                4지망
              </span>
              <span
                className={css({
                  width: '20px',
                  height: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.19)',
                  borderRadius: '5px',
                })}
              />
              <span
                className={hstack({
                  color: 'gray.5',
                  border: '1px solid rgba(255, 255, 255, 0.53)',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  textStyle: 'h3',
                })}
              >
                <img src={group} />팀 구성 조정
              </span>
            </div>
            <button
              className={css({
                padding: '15px 20px',
                textStyle: 'h3',
                color: 'gray.5',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.36)',
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                cursor: 'pointer',
              })}
            >
              전체 현황 보기
            </button>
          </div>
        </div>
        <div
          className={vstack({
            height: '100%',
            alignItems: 'start',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(50px)',
            padding: '25px 30px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '0 0 40px 40px',
          })}
        >
          <span className={css({ textStyle: 'h3', color: 'gray.5' })}>
            선택 완료 현황
          </span>
          <div className={hstack({ gap: '15px' })}>
            <div className={css({ width: '138px', height: '30px' })}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="138"
                height="30"
                viewBox="0 0 138 30"
                fill="none"
              >
                <rect
                  width="138"
                  height="30"
                  rx="10"
                  fill="white"
                  fill-opacity="0.23"
                />
                <rect width="93" height="30" rx="10" fill="#45B134" />
              </svg>
            </div>
            <span className={css({ textStyle: 'h4', color: 'gray.5' })}>
              1 / 10
            </span>
          </div>
        </div>
      </section>
      <section
        className={css({
          width: '100%',
          background: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(50px)',
          padding: '40px 40px 0 40px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          borderRadius: '40px',
          flex: 1,
          overflow: 'auto',
        })}
      >
        <h2 className={css({ textStyle: 'h1', color: 'gray.5' })}>
          팀 구성 현황
        </h2>
        <div
          className={grid({
            columns: 5,
            marginTop: '30px',
            gap: '30px',
            overflow: 'auto',
            maxHeight: 'calc(100% - 72px)',
          })}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <Card
              key={index}
              name="홍길동"
              position="Frontend"
              selected={false}
            />
          ))}
        </div>
      </section>
      <section
        className={hstack({
          width: '100%',
          gap: '85px',
        })}
      >
        <div
          className={stack({
            flex: 1,
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(50px)',
            padding: '40px 40px 0 40px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '40px 40px 0 0',
            overflow: 'auto',
            height: '220px',
            gap: '0',
          })}
        >
          <div className={hstack({ justifyContent: 'space-between' })}>
            <h2
              className={css({
                textStyle: 'h1',
                color: 'gray.5',
              })}
            >
              1지망생 리스트
            </h2>
            <div className={css({ width: '123px', height: '44px' })}>
              <Button
                visual="blue"
                className={hstack({
                  whiteSpace: 'nowrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '20px',
                  gap: '15px',
                })}
              >
                펼치기
                <img src={arrowUp} />
              </Button>
            </div>
          </div>
          <div
            className={grid({
              columns: 4,
              marginTop: '30px',
              gap: '30px',
              overflow: 'auto',
              maxHeight: 'calc(100% - 72px)',
            })}
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <Card
                key={index}
                name="홍길동"
                position="Frontend"
                selected={false}
              />
            ))}
          </div>
        </div>
        <div className={css({ width: '250px', height: '200px' })}>
          <Button
            visual="primary"
            size="large"
            className={css({ height: '100%' })}
          >
            1지망
            <br />
            팀원 선택 완료
          </Button>
        </div>
      </section>
    </div>
  );
};
