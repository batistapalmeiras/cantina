// Libs
import styled from 'styled-components';

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;
