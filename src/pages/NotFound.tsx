import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';

// @fixme: 임의로 수정한 디자인이므로, 추후에 수정해야 함.
const NotFound = () => {
  return (
    <div
      className={stack({
        color: '#fff',
        padding: '30px',
      })}
    >
      <h1 className={css({ fontSize: '40px', fontFamily: 'GmarketSansBold' })}>
        404 Error
      </h1>
      <p>
        페이지를 찾을 수 없습니다.
        <br />
        입력하신 페이지의 주소가 정확한지 다시 한번 확인해주세요.
      </p>
    </div>
  );
};

export default NotFound;
