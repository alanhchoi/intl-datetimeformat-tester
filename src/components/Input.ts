import tw, { css, styled } from 'twin.macro';

const Input = styled.input<{ variant?: 'outlined' | 'solid' }>`
  ${tw`rounded px-4 py-2 text-base font-medium text-gray-800 min-w-0`}

  ${({ variant = 'outlined' }) =>
    variant === 'outlined'
      ? tw`border-2 border-gray-800 bg-white`
      : css`
          ${tw`border border-gray-200 bg-gray-100 hover:bg-gray-200`}

          &:focus:not([readonly]) {
            ${tw`bg-white`}
          }
        `}
`;
export default Input;
