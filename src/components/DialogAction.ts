import tw, { styled, theme } from 'twin.macro';
import Button from './Button';

const DialogAction = styled.div`
  ${tw`space-x-2 flex justify-end mt-8`}

  ${Button} {
    min-width: ${theme`width.24`};
  }
`;

export default DialogAction;
