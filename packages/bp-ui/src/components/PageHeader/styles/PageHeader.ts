// Libs
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Back = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  cursor: pointer;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:hover { color: ${({ theme }) => theme.colors.ink}; }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.base};
`;

export const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;
