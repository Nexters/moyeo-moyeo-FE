import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';

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
          width: '1060px',
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
              fontFamily: 'GmarketSansBold',
              fontSize: '48px',
              color: 'gray.5',
            })}
          >
            선택한 팀원을 확정하시겠어요?
          </span>
          <CloseIcon
            onClick={onClose}
            className={css({ width: '48px', cursor: 'pointer' })}
          />
        </div>
        <div className={css({ width: '100%' })}>
          <p className={css({ fontSize: '20px', color: 'gray.10' })}>
            본인의 아이디어에 필요한 직군을 포함한 팀이 적절히 구성되고 있는지
            확인해주세요
            <br />
            이번 라운드에 선택한 팀원은 운영진의 허가없이 선택을 취소 할 수
            없습니다
          </p>
          <div
            className={css({
              width: '320px',
              margin: '80px 0 0 auto',
            })}
          >
            <Button
              onClick={() => {
                selectionConfirm();
                onClose();
              }}
            >
              선택 확정하기
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default SelectConfirmModal;
