import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { css } from '@/styled-system/css';
import { container, hstack, stack } from '@/styled-system/patterns';
import { isValidRoomId } from '@/utils/room';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const handleEntranceButton = () => {
    navigate(`/${roomId}`);
  };

  const handleCreateButton = () => {
    navigate('/create');
  };

  return (
    <section
      className={container({
        width: '400px',
        backgroundColor: 'rgba(12, 13, 14, 0.6)',
        borderRadius: '40px',
        color: 'white',
        padding: '30px',
      })}
    >
      <div
        className={hstack({
          width: '100%',
          justify: 'space-between',
          fontWeight: '900',
        })}
      >
        <h1 className={css({ fontSize: '40px' })}>모여모여</h1>
        {/* TODO: add logo */}
      </div>
      <div
        className={stack({
          width: '100%',
          marginTop: '80px',
        })}
      >
        <h2 className={css({ fontSize: '17px', fontWeight: '700' })}>
          초대 링크를 받았다면
        </h2>
        <Input
          className={css({ width: '100%', marginTop: '10px' })}
          placeholder="링크 붙여넣기"
          onChange={handleInput}
          value={roomId}
        />
        <Button
          disabled={!isValidRoomId(roomId)}
          onClick={handleEntranceButton}
        >
          입장하기
        </Button>
      </div>
      <div
        className={stack({
          width: '100%',
          gap: '20px',
          marginTop: '60px',
        })}
      >
        <h2 className={css({ fontSize: '17px', fontWeight: '700' })}>
          이벤트를 만들고 싶다면
        </h2>
        <Button size="large" onClick={handleCreateButton}>
          전략적 팀 빌딩 개최
        </Button>
      </div>
    </section>
  );
};

export default Home;
