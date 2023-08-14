import { useEffect, useState } from 'react';

import { Player } from '@lottiefiles/react-lottie-player';
import { Outlet, useLocation } from 'react-router-dom';

import BlurBackgroundImage from '@/assets/images/blur.webp';
import HomeBackgroundImage from '@/assets/images/home2.webp';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const CommonLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [lottieSize, setLottieSize] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const handleResize = () => {
      // @note: lottie 비율이 16:9.
      // 화면에 꽉차게(= object-fit: cover)와 같은 효과를 주기 위해 아래 라인을 추가함
      if (window.innerWidth / window.innerHeight > 16 / 9) {
        setLottieSize({
          width: window.innerWidth,
          height: window.innerWidth * (9 / 16),
        });
      } else {
        setLottieSize({
          width: window.innerHeight * (16 / 9),
          height: window.innerHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        minWidth: 'fit-content',
        position: 'relative',
        backgroundColor: '#290C60',
      })}
    >
      {/* @note: 두 이미지를 가져오는 이유는 페이지 전환시 깜빡이는 느낌을 제거하기 위함 */}
      <img
        src={HomeBackgroundImage}
        className={css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isHome ? 1 : 0,
        })}
      />
      {isHome && (
        <Player
          autoplay
          loop
          src="/lottie/star-background.json"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: lottieSize.width,
            height: lottieSize.height,
          }}
        />
      )}
      <img
        src={BlurBackgroundImage}
        className={css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isHome ? 0 : 1,
        })}
      />

      <main
        className={vstack({
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        })}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default CommonLayout;
