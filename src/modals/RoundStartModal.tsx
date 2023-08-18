import { useEffect } from 'react';

import { ReactComponent as ExtraRound } from '@/assets/icons/modalLogo/extraRound.svg';
import { ReactComponent as Finish } from '@/assets/icons/modalLogo/finish.svg';
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
