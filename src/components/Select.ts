import tw, { styled } from 'twin.macro';

const Select = styled.select<{ variant?: 'outlined' | 'solid' }>`
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;

  ${tw`rounded pl-4 pr-10 py-2 text-base font-medium text-gray-800 appearance-none`}

  ${({ variant = 'outlined' }) =>
    variant === 'outlined'
      ? tw`border-2 border-gray-800 bg-white`
      : tw`border border-gray-200 bg-gray-100 hover:bg-gray-200 focus:bg-white`}
`;
export default Select;
