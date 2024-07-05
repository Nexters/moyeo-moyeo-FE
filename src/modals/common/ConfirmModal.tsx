import { ReactNode } from 'react';

import closeIcon from '@/assets/icons/close.svg';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';
import { playSound } from '@/utils/sound';

export type ConfirmModalProps = {
  title: string;
  content: ReactNode;
  confirmButtonText: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  title,
  content,
  confirmButtonText,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  const onCloseWithSound = () => {
    playSound('버튼_클릭');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseWithSound}>
      <section
        className={css({
          width: '640px',
          padding: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(50px)',
          color: 'gray.5',
        })}
      >
        <header className={hstack({ justifyContent: 'space-between' })}>
          <h1
            className={css({ textStyle: 'h1', fontFamily: 'GmarketSansBold' })}
          >
            {title}
          </h1>

          <button
            type="button"
            aria-label="홈으로 돌아가기"
            className={css({ cursor: 'pointer' })}
            onClick={onCloseWithSound}
          >
            <img
              className={css({ width: '48px', height: '48px' })}
              src={closeIcon}
            />
          </button>
        </header>

        <p className={css({ textStyle: 'p1', margin: '20px 0 80px' })}>
          {content}
        </p>

        <Button color="primary" size="medium" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </section>
    </Modal>
  );
};
