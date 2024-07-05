import InfoIcon from '@/assets/icons/info.svg?react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { center, hstack, vstack } from '@/styled-system/patterns';
import { playSound } from '@/utils/sound';

type AgreementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
};

const AgreementModal = ({ isOpen, onClose, onAgree }: AgreementModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <section
        className={vstack({
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.07)',
          width: '1060px',
          gap: '0px',
          backdropFilter: 'blur(50px)',
        })}
      >
        <div className={hstack({ width: '100%' })}>
          <InfoIcon />
          <p className={css({ color: 'gray.5', textStyle: 'h1' })}>
            시작 전, 다음 안내와 유의사항을 확인한 후 동의해주세요
          </p>
        </div>
        <div
          className={css({
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.11)',
            width: '100%',
            padding: '24px',
            marginTop: '24px',
          })}
        >
          <h1 className={css({ textStyle: 'h2', color: 'gray.5' })}>
            팀 빌딩 안내
          </h1>
          <p
            className={css({
              color: 'gray.20',
              textStyle: 'p1',
              marginTop: '10px',
            })}
          >
            1지망부터 4지망까지 선택 라운드가 진행되며, 모든 선택이 끝난 후
            운영진이 최종 점검 및 수정을 진행합니다.
          </p>
        </div>
        <div
          className={css({
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.11)',
            width: '100%',
            padding: '24px',
            marginTop: '12px',
          })}
        >
          <h2 className={css({ textStyle: 'h2', color: 'gray.5' })}>
            유의 사항
          </h2>
          <ul
            className={css({
              color: 'gray.20',
              textStyle: 'p1',
              marginTop: '10px',
            })}
          >
            <li>
              1. 실수로 브라우저를 종료해도 전달받은 링크로 재접속할 수 있어요.
            </li>
            <li>
              2. 매 라운드마다 팀원 선택 완료 버튼을 누르면 선택을 수정할 수
              없어요.
            </li>
            <li>
              3. 특정 라운드에 원하는 팀원이 없을 경우, 지원자를 선택하지 않아도
              돼요.
            </li>
            <li>
              4. 팀 구성 조정 라운드에서는 운영진의 안내를 주의 깊게 들어주세요.
            </li>
          </ul>
        </div>
        <div className={css({ width: '100%' })}>
          <p
            className={css({
              textStyle: 'p2',
              color: 'gray.30',
              marginTop: '8px',
            })}
          >
            * 불가피하게 이미 선택한 팀원을 취소하고 싶을 경우, 운영진에게
            문의하세요. (팀 구성 조정 시 선택 우선권에 불이익이 있을 수 있어요)
            <br />* 유의사항을 지키지 않을 경우, 팀 빌딩에 불이익이 발생할 수
            있습니다.
          </p>
        </div>
        <div className={center({ width: '320px', marginTop: '36px' })}>
          <Button
            onClick={() => {
              playSound('버튼_클릭');
              onClose();
              onAgree();
            }}
          >
            동의하고 시작하기
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default AgreementModal;
