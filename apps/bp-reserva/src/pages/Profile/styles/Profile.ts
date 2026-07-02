// Libs
import styled from 'styled-components';

export const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

export const EditFieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EditInput = styled.input`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.canvas};
  outline: none;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.hairlineSoft};
  }
`;
