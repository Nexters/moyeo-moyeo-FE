import { Outlet } from 'react-router-dom';

import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

import { Background } from './Background';

const HomeLayout = () => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#290C60',
      })}
    >
      <Background src="images/home-bg.svg" />

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

export default HomeLayout;
