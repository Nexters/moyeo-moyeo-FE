import StartRound from '@/assets/icons/modalLogo/startRound.svg?react';
import { Modal } from '@/components/Modal';

type OnlyStartRoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const OnlyStartRoundModal = ({ isOpen, onClose }: OnlyStartRoundModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false}>
      <StartRound />
    </Modal>
  );
};

export default OnlyStartRoundModal;
