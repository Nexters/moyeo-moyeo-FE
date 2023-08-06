import { useNavigate } from 'react-router-dom';

import HomeLogo from '@/assets/icons/homeLogo.svg';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateButton = () => {
    navigate('/create');
  };

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
        팀빌딩 준비하기
      </button>
    </section>
  );
};

export default Home;
