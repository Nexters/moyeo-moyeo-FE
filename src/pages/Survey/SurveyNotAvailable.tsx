import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';

export const SurveyNotAvailable = () => {
  return (
    <div
      className={stack({
        flex: '1',
        width: '100%',
        maxWidth: '520px',
        padding: '120px 20px',
        color: 'gray.5',
        wordBreak: 'keep-all',
        gap: '0',
      })}
    >
      <h1
        className={css({
          textStyle: 'h1',
          marginBottom: '8px',
        })}
      >
        더 이상 설문을 제출할 수 없습니다.
      </h1>

      <p
        className={css({
          textStyle: 'p2',
          marginBottom: '50px',
        })}
      >
        팀 빌딩이 시작되어 설문을 제출할 수 없습니다.
        <br />
        추가 문의사항은 운영진에게 연락해주세요.
      </p>
    </div>
  );
};
