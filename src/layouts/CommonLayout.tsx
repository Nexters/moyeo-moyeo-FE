import { Outlet, useLocation } from 'react-router-dom';

import BlurBackgroundImage from '@/assets/images/blur.webp';
import HomeBackgroundImage from '@/assets/images/home.webp';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const CommonLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
