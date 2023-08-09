import { useState } from 'react';

import arrowUp from '@/assets/icons/arrowUp.svg';
import { ReactComponent as Face } from '@/assets/icons/face.svg';
import { ReactComponent as Group } from '@/assets/icons/group.svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Step, Stepper } from '@/components/stepper';
import { css } from '@/styled-system/css';
import { grid, hstack, stack, vstack } from '@/styled-system/patterns';
import { Team } from '@/types.old';

type PlayerProps = {
  teamId: Team['id'];
};

const steps = [
  {
    label: '1지망',
    Icon: Face,
  },
  {
    label: '2지망',
    Icon: Face,
  },
  {
    label: '3지망',
    Icon: Face,
  },
  {
    label: '4지망',
    Icon: Face,
  },
  {
    label: '팀 구성 조정',
    Icon: Group,
  },
];

export const Player = ({ teamId }: PlayerProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) return;
    setActiveStep((prev) => prev + 1);
  };

  console.log(teamId);

  return (
    <div
      className={vstack({
        height: '100vh',
        gap: '20px',
        padding: '0 80px',
      })}
    >
      <section
        className={vstack({
          width: '1280px',
          background: 'rgba(0, 0, 0, 0.07)',
          backdropFilter: 'blur(50px)',
          gap: '20px',
          padding: '20px 30px',
          borderRadius: '0 0 20px 20px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
        })}
      >
        <div
          className={hstack({ width: '100%', justifyContent: 'space-between' })}
        >
          <h1
            className={css({
              textStyle: 'h2',
              color: 'gray.5',
            })}
          >
            Nexters23기 팀빌딩입니다
          </h1>
          <div className={hstack()}>
            <span className={css({ textStyle: 'h3', color: 'gray.5' })}>
              선택 완료 상황
            </span>
            <span className={css({ textStyle: 'h4', color: 'gray.5' })}>
              1 / 10
            </span>
            <div className={css({ w: '138px', h: '30px' })}>
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
                  fillOpacity="0.23"
                />
                <rect width="93" height="30" rx="10" fill="#45B134" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className={hstack({ width: '100%', justifyContent: 'space-between' })}
        >
          <button
            onClick={handleNext}
            className={css({
              padding: '10.5px 25px',
              textStyle: 'h3',
              color: 'gray.5',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.36)',
              background: 'rgba(255, 255, 255, 0.28)',
              cursor: 'pointer',
            })}
          >
            전체 현황 보기
          </button>
          <Stepper activeStep={activeStep}>
            {steps.map(({ label, Icon }, index) => (
              <Step key={label} id={index}>
                <Icon className={css({ marginRight: '10px' })} />
                <span className={css({ textStyle: 'h3' })}>{label}</span>
              </Step>
            ))}
          </Stepper>
        </div>
      </section>
      <section
        className={css({
          width: '1280px',
          background: 'rgba(0, 0, 0, 0.07)',
          backdropFilter: 'blur(50px)',
          padding: '40px 40px 0 40px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          borderRadius: '20px',
          flex: 1,
          overflow: 'auto',
        })}
      >
        <h2 className={css({ textStyle: 'h1', color: 'gray.5' })}>
          팀 구성 현황
        </h2>
        <div
          className={grid({
            columns: 4,
            marginTop: '30px',
            gap: '20px',
            overflow: 'auto',
            maxHeight: 'calc(100% - 72px)',
            _scrollbarThumb: {
              background: 'rgba(255, 255, 255, 0.50)',
              borderRadius: '99px',
            },
            _scrollbar: {
              width: '10px',
            },
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
          width: '1280px',
          gap: '40px',
          alignItems: 'flex-start',
        })}
      >
        <div
          className={stack({
            flex: 1,
            background: 'rgba(0, 0, 0, 0.07)',
            backdropFilter: 'blur(50px)',
            padding: '40px 40px 0 40px',
            border: '1px solid rgba(255, 255, 255, 0.11)',
            borderRadius: '20px 20px 0 0',
            overflow: 'auto',
            height: '280px',
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
                  background: 'blue.60',
                })}
              >
                펼치기
                <img src={arrowUp} />
              </Button>
            </div>
          </div>
          <div
            className={grid({
              columns: 3,
              marginTop: '30px',
              gap: '20px',
              overflow: 'auto',
              _scrollbarThumb: {
                background: 'rgba(255, 255, 255, 0.50)',
                borderRadius: '99px',
              },
              _scrollbar: {
                width: '10px',
              },
            })}
          >
            {Array.from({ length: 11 }).map((_, index) => (
              <Card
                key={index}
                name="홍길동"
                position="Frontend"
                selected={false}
              />
            ))}
          </div>
        </div>
        <div className={css({ width: '255px', height: '180px' })}>
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
