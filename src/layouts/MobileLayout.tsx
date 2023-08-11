import { Outlet } from 'react-router-dom';

import MobileBackgroundImage from '@/assets/images/mobile.webp';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const MobileLayout = () => {
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
      <div
        className={css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
        })}
      >
        <img
          src={MobileBackgroundImage}
          className={css({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          })}
        />
      </div>

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

export default MobileLayout;
