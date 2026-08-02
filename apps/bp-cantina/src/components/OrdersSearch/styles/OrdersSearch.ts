// Libs
import styled from 'styled-components';

export const SearchWrap = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.base} 0 36px;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  background: ${({ theme }) => theme.colors.canvas};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: ${({ theme }) => theme.colors.muted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;
