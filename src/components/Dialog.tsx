import { FC, ReactNode } from 'react';
import ReactModal from 'react-modal';
import { theme } from 'twin.macro';

type Props = {
  isOpen: boolean;
  title: ReactNode;
  close: () => void;
  width?: string;
};

ReactModal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    position: 'absolute',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: theme`borderRadius.lg`,
    boxShadow: theme`boxShadow.xl`,
    outline: 'none',
    padding: '20px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};

const Dialog: FC<Props> = ({
  isOpen,
  title,
  close,
  children,
  width = '40rem',
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      aria={{ labelledby: 'dialog-title' }}
    >
      <div
        tw="p-4"
        css={`
          width: ${width};
        `}
      >
        <h2 id="dialog-title" tw="text-3xl font-bold pb-8">
          {title}
        </h2>
        {children}
      </div>
    </ReactModal>
  );
};

export default Dialog;
