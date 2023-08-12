import { useEffect } from 'react';

import modalLogo from '@/assets/icons/modalLogo.svg';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

type RoundFinishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  round: number;
};

const RoundFinishModal = ({
  isOpen,
  onClose,
  round,
}: RoundFinishModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const delay = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(delay);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={vstack()}>
        {/* FIXME: 이미지 변경될 예정 */}
        <img
          src={modalLogo}
          alt="모여모여 로고"
          className={css({
            left: '27px',
            position: 'relative',
          })}
        />
        <div
          className={css({
            position: 'relative',
            top: '-15px',
            fontFamily: 'GmarketSansBold',
            color: 'de.light',
            fontSize: '48px',
            fontWeight: '500',
            background: 'be.dark',
            padding: '83px 77px 70px 77px',
            borderRadius: '20px',
          })}
        >
          {round}지망 라운드 종료
        </div>
      </div>
    </Modal>
  );
};

export default RoundFinishModal;
