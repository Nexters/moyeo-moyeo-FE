import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { playSound } from '@/utils/sound';

type SelectConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectionConfirm: () => void;
};

const SelectConfirmModal = ({
  isOpen,
  onClose,
  selectionConfirm,
}: SelectConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section
        className={vstack({
          padding: '60px',
          gap: '20px',
          background: 'rgba(255, 255, 255, 0.07)',
          width: '640px',
          backdropFilter: 'blur(50px)',
        })}
      >
        <div
          className={hstack({
            justifyContent: 'space-between',
            width: '100%',
          })}
        >
          <span
            className={css({
              textStyle: 'h1',
              color: 'gray.5',
            })}
          >
            이번 라운드 팀원 선택을 마칠까요?
          </span>
          <CloseIcon
            onClick={() => {
              playSound('버튼_클릭');
              onClose();
            }}
            className={css({ width: '48px', cursor: 'pointer' })}
          />
        </div>
        <div className={css({ width: '100%' })}>
          <p className={css({ textStyle: 'p1', color: 'gray.10' })}>
            본인 아이디어에 필요한 팀원인지 확인해주세요.
            <br />
            1~4지망 라운드에서 선택 확정하면 취소할 수 없어요.
          </p>
          <div
            className={css({
              width: '100%',
              margin: '80px 0 0 auto',
            })}
          >
            <Button
              onClick={() => {
                selectionConfirm();
                onClose();
              }}
            >
              선택 완료하기
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default SelectConfirmModal;
