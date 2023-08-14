import ReactModal, { Props } from 'react-modal';

ReactModal.setAppElement('#root');

export type ModalProps = Props & {
  onClose?: () => void;
};

export const Modal = ({ isOpen, onClose, children, ...rest }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.80)',
          zIndex: 100,
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
          backgroundColor: 'transparent',
          zIndex: 100,
        },
      }}
      {...rest}
    >
      {children}
    </ReactModal>
  );
};
