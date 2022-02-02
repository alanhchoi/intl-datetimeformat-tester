import copy from 'copy-to-clipboard';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import Button from './Button';

const SuccessTooltip = styled(motion.div)`
  ${tw`absolute text-white bg-black rounded py-1 px-2 pointer-events-none top-0 left-1/2`}
  transform: translate(-50%, 0);

  &::before {
    ${tw`absolute bg-black block left-1/2 bottom-0`}
    position: abolute;
    transform: translate(-50%, 50%) rotate(45deg);
    width: 10px;
    height: 10px;
    content: '';
  }
`;

export default function CopyButton({
  children,
  contentToCopy,
}: {
  children: ReactNode;
  contentToCopy: string;
}) {
  const [isTooltipVisible, toggleIsTooltipVisible] = useState(false);

  useEffect(() => {
    if (isTooltipVisible) {
      const timeoutId = setTimeout(() => {
        toggleIsTooltipVisible(false);
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTooltipVisible]);

  function handleClick() {
    copy(contentToCopy);
    toggleIsTooltipVisible(true);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      css={tw`relative`}
    >
      {children}
      <AnimatePresence>
        {isTooltipVisible && (
          <SuccessTooltip
            initial={{ opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, x: '-50%', y: '-110%' }}
            exit={{ opacity: 0, x: '-50%' }}
            role="alert"
          >
            Copied!
          </SuccessTooltip>
        )}
      </AnimatePresence>
    </Button>
  );
}
