import { useEffect } from 'react';

import ExtraRound from '@/assets/icons/modalLogo/extraRound.svg?react';
import Finish from '@/assets/icons/modalLogo/finish.svg?react';
import FirstRound from '@/assets/icons/modalLogo/firstRound.svg?react';
import FourthRound from '@/assets/icons/modalLogo/fourthRound.svg?react';
import SecondRound from '@/assets/icons/modalLogo/secondRound.svg?react';
import ThirdRound from '@/assets/icons/modalLogo/thirdRound.svg?react';
import { Modal } from '@/components/Modal';

type RoundFinishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  round: number;
};

const DURATION = 3000;

const modalLogo = [
  <FirstRound />,
  <SecondRound />,
  <ThirdRound />,
  <FourthRound />,
  <ExtraRound />,
  <Finish />,
];

const RoundStartModal = ({ isOpen, onClose, round }: RoundFinishModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const delay = setTimeout(() => {
      onClose();
    }, DURATION);
    return () => clearTimeout(delay);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {modalLogo[round]}
    </Modal>
  );
};

export default RoundStartModal;
