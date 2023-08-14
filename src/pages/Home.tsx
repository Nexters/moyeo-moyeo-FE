import { useLayoutEffect } from 'react';

import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import HomeLogo from '@/assets/icons/homeLogo.svg';
import { isShowLottieBackgroundState } from '@/store/atoms';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const Home = () => {
  const navigate = useNavigate();
  const setIsShowLottieBackground = useSetAtom(isShowLottieBackgroundState);

  const handleCreateButton = () => {
    navigate('/create');
  };

  useLayoutEffect(() => {
    // @note: 이 페이지에서 lottie background를 보여줘야해서 이렇게 씀
    setIsShowLottieBackground(true);
    return () => setIsShowLottieBackground(false);
  }, [setIsShowLottieBackground]);

  return (
    <section
      className={vstack({
        width: '660px',
        gap: '64px',
      })}
    >
      <img
        width="600px"
        height="400px"
        src={HomeLogo}
        alt="모여모여 서비스 로고"
      />

      <button
        className={css({
          width: '320px',
          padding: '24px',
          fontSize: '24px',
          lineHeight: '1',
          fontFamily: 'GmarketSansBold',
          color: '#FFFFFF',
          borderRadius: '36px',
          backgroundColor: '#FF7A01',
          boxShadow:
            '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px #B84200 inset',
          cursor: 'pointer',
        })}
        onClick={handleCreateButton}
      >
        팀 빌딩 준비하기
      </button>
    </section>
  );
};

export default Home;
