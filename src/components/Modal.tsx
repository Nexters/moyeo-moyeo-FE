import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

export type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: '#000000e6',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          borderRadius: '20px',
          padding: '0',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};
