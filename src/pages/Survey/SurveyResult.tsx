import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';

export const SurveyResult = () => {
  return (
    <div
      className={stack({
        flex: '1',
        width: '100%',
        maxWidth: '520px',
        padding: '70px 30px 130px',
        color: '#fff',
        wordBreak: 'keep-all',
      })}
    >
      <h1
        className={css({
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '8px',
        })}
      >
        제출완료
      </h1>

      <p
        className={css({
          fontSize: '16px',
          fontWeight: '400',
          marginBottom: '50px',
        })}
      >
        설문 응답이 정상적으로 제출되었습니다.
        <br />
        운영진의 안내를 확인해주세요.
      </p>
    </div>
  );
};
