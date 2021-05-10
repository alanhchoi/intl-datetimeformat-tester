import styled from 'styled-components';
import tw from 'twin.macro';

const styles = {
  outline: tw`bg-white border-2 border-gray-800`,
  filled: tw`bg-gray-100 hover:bg-gray-200 border-0`,
  cta: tw`text-white font-semibold bg-purple-500 hover:bg-purple-600 border-0`,
  ghost: tw`hover:bg-gray-100 border-0`,
};

const sizes = {
  base: tw`px-4 h-11 text-base`,
  sm: tw`px-3 h-9 text-sm`,
};

const Button = styled.button<{
  variant?: 'outline' | 'filled' | 'ghost' | 'cta';
  size?: 'base' | 'sm';
}>`
  ${tw`box-border rounded font-medium text-gray-800 flex-none disabled:(opacity-50 cursor-default)`}
  ${({ variant = 'outline' }) => styles[variant]}
  ${({ size = 'base' }) => sizes[size]}
`;

export default Button;
