// Libs
import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.base};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.base} 0;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export const BrandName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

export const Input = styled.input`
  height: 48px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.canvas};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.hairlineSoft};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.mutedSoft}; }
`;

export const BackLink = styled.button`
  display: block;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  text-align: center;
  &:hover { color: ${({ theme }) => theme.colors.ink}; text-decoration: underline; }
`;
