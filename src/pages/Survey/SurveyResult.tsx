import { css } from '@/styled-system/css';
import { hstack, stack } from '@/styled-system/patterns';
import { SurveyFormResult } from '@/types';

export type SurveyResultProps = {
  formResult: SurveyFormResult;
};

export const SurveyResult = ({ formResult }: SurveyResultProps) => {
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
        제출완료
      </h1>

      <p
        className={css({
          textStyle: 'p2',
          marginBottom: '50px',
        })}
      >
        설문 응답이 정상적으로 제출되었습니다.
        <br />
        운영진의 안내를 확인해주세요.
      </p>

      <section
        className={stack({
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.09)',
          borderRadius: '20px',
          gap: '12px',
        })}
      >
        {formResult.map(({ field, value }) => (
          <Row
            key={field}
            field={field}
            value={value}
            hasLineClamp={field.includes('지망')}
          />
        ))}
      </section>
    </div>
  );
};

type RowProps = {
  field: string;
  value: string;
  hasLineClamp?: boolean;
};
const Row = ({ field, value, hasLineClamp = false }: RowProps) => {
  return (
    <div
      className={hstack({
        gap: '4px',
        alignItems: 'flex-start',
        fontVariantNumeric: 'tabular-nums',
      })}
    >
      <span
        className={css({ textStyle: 'h4', flexShrink: '0' })}
      >{`${field} :`}</span>
      <span
        className={css({
          textStyle: 'h4',
          color: 'gray.20',
          wordBreak: 'break-all',
          lineClamp: hasLineClamp ? 1 : undefined,
        })}
      >
        {value}
      </span>
    </div>
  );
};
