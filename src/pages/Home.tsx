import { useLayoutEffect } from 'react';

import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import HomeLogo from '@/assets/icons/homeLogo.svg';
import { Button } from '@/components/Button';
import { isShowLottieBackgroundState } from '@/store/atoms';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';
import { playSound } from '@/utils/sound';

const Home = () => {
  const navigate = useNavigate();
  const setIsShowLottieBackground = useSetAtom(isShowLottieBackgroundState);

  const handleCreateButton = () => {
    navigate('/create');
    playSound('페이지_전환');
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

      <Button
        color="secondary"
        size="medium"
        className={css({
          width: '320px !important',
        })}
        onClick={handleCreateButton}
      >
        팀 빌딩 준비하기
      </Button>
    </section>
  );
};

export default Home;
