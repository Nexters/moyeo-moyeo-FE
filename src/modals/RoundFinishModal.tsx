import { useEffect } from 'react';

import { ReactComponent as ExtraRound } from '@/assets/icons/modalLogo/extraRound.svg';
import { ReactComponent as FirstRound } from '@/assets/icons/modalLogo/firstRound.svg';
import { ReactComponent as FourthRound } from '@/assets/icons/modalLogo/fourthRound.svg';
import { ReactComponent as SecondRound } from '@/assets/icons/modalLogo/secondRound.svg';
import { ReactComponent as ThirdRound } from '@/assets/icons/modalLogo/thirdRound.svg';
import { Modal } from '@/components/Modal';

type RoundFinishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  round: number;
};

const modalLogo = [
  <FirstRound />,
  <SecondRound />,
  <ThirdRound />,
  <FourthRound />,
  <ExtraRound />,
];

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
      {modalLogo[round]}
    </Modal>
  );
};

export default RoundFinishModal;
