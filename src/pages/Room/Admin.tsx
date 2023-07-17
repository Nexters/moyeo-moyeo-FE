import { Button } from '@/components/Button';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';

export const Admin = () => {
  return (
    <>
      <section
        className={hstack({
          width: '100%',
          height: '100%',
          overflow: 'auto',
          alignItems: 'stretch',
          padding: '36px 40px',
          gap: '20px',
          color: '#fff',
        })}
      >
        <nav
          className={vstack({
            flexShrink: 0,
            width: '200px',
            alignItems: 'flex-start',
            backgroundColor: '#0c0d0e99',
            backdropFilter: 'blur(10px)',
            border: '1px solid #17191c',
            padding: '20px',
            borderRadius: '20px',
            gap: '40px',
          })}
        >
          <section>
            <img
              className={css({
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '10px',
              })}
              src="https://framerusercontent.com/images/TeoNhQyEXaPnI8mt5Zquak7mZI0.jpg"
            />
          </section>

          <section className={vstack({ width: '100%', gap: '15px' })}>
            <Button visual="secondary">전체 현황 보기</Button>
            <Button visual="secondary">결과 이미지 저장</Button>
            <Button visual="secondary">참여자 추가</Button>
            <Button visual="secondary">초대코드 공유</Button>
            <Button visual="red">전략적 팀 빌딩 종료</Button>
          </section>

          <section>현재 라운드 1지망</section>
        </nav>

        <section className={vstack({ flex: 1, alignItems: 'flex-start' })}>
          <h1
            className={css({
              padding: '20px',
              fontSize: '25px',
              fontWeight: 900,
            })}
          >
            NEXTERS 23기 팀 빌딩
          </h1>
          <section
            className={hstack({
              flex: 1,
              flexWrap: 'wrap',
              gap: '24px',
              width: '880px',
              alignItems: 'flex-start',
              backgroundColor: '#0c0d0e99',
              backdropFilter: 'blur(10px)',
              border: '1px solid #17191c',
              padding: '30px',
              borderRadius: '20px',
              overflow: 'auto',
            })}
          >
            {new Array(80).fill(0).map((_, i) => (
              <Card key={i} />
            ))}
          </section>
        </section>
      </section>

      <section
        className={css({ position: 'fixed', top: 0, right: 0, bottom: 0 })}
      >
        <ul>
          <li>팀 빌딩</li>
          <li>팀 빌딩 결과</li>
          <li>팀 빌딩</li>
        </ul>
      </section>
    </>
  );
};

const Card = () => {
  return (
    <div
      className={vstack({
        width: '144px',
        padding: '16px',
        backgroundColor: 'rgb(23, 25, 28)',
        gap: '10px',
        borderRadius: '20px',
      })}
    >
      <img
        className={css({
          width: '100%',
          aspectRatio: '1',
          objectFit: 'cover',
          borderRadius: '10px',
        })}
        src="https://framerusercontent.com/images/Z4glq7zJ6NXvB7eJvuZ8iewrbDs.png"
      />

      <div className={vstack()}>
        <p className={css({ fontSize: '14px', fontWeight: 'bold' })}>Design</p>
        <p className={css({ fontSize: '18px', fontWeight: '900' })}>홍길동</p>
      </div>
    </div>
  );
};
