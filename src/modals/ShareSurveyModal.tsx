import closeIcon from '@/assets/icons/close.svg';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';
import { toastWithSound } from '@/utils/toast';

export type ShareSurveyModalProps = {
  teamBuildingUuid: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ShareSurveyModal = ({
  teamBuildingUuid,
  isOpen,
  onClose,
}: ShareSurveyModalProps) => {
  const surveyUrl = `${location.origin}/forms/${teamBuildingUuid}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
    toastWithSound.success('설문 링크가 복사되었습니다');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section
        className={css({
          width: '1060px',
          padding: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(50px)',
          color: 'gray.5',
        })}
      >
        <header className={hstack({ justifyContent: 'space-between' })}>
          <h1
            className={css({ fontSize: '48px', fontFamily: 'GmarketSansBold' })}
          >
            팀 빌딩 설문지를 공유해주세요
          </h1>

          <button
            type="button"
            aria-label="홈으로 돌아가기"
            className={css({ cursor: 'pointer' })}
            onClick={onClose}
          >
            <img
              className={css({ width: '48px', height: '48px' })}
              src={closeIcon}
            />
          </button>
        </header>

        <p className={css({ textStyle: 'p1', margin: '20px 0 80px' })}>
          설문지 응답이 제출될 때마다 어드민 페이지에 실시간으로 반영됩니다.
          <br />
          모든 인원이 설문에 응답한 후 팀 빌딩을 시작해야 원활한 진행이
          가능합니다.
        </p>

        <div
          className={hstack({
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          })}
        >
          <div>
            <h2 className={css({ textStyle: 'h1' })}>설문지 주소</h2>
            <p
              className={css({
                padding: '16px',
                backgroundColor: 'rgba(12, 13, 14, 0.50)',
                borderRadius: '12px',
                textStyle: 'p2',
                color: 'rgba(255, 255, 255, 0.59)',
              })}
            >
              {surveyUrl}
            </p>
          </div>

          <button
            className={css({
              width: '320px',
              height: '80px',
              padding: '24px',
              background: 'linear-gradient(180deg, #8060FF 0%, #5818DF 100%)',
              boxShadow:
                '4px 4px 8px 0px rgba(255, 255, 255, 0.25) inset, -4px -4px 8px 0px #441FE2 inset',
              borderRadius: '20px',
              fontSize: '24px',
              fontFamily: 'GmarketSansBold',
              color: 'gray.5',
              cursor: 'pointer',
            })}
            onClick={copyToClipboard}
          >
            설문 링크 복사하기
          </button>
        </div>
      </section>
    </Modal>
  );
};
