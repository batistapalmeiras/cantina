// Libs
import styled, { keyframes } from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};
  display: flex;
  flex-direction: column;
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
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.base} 0;
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

export const BrandSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 1px;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const SuccessCard = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};
  animation: ${fadeIn} 0.3s ease;
`;

export const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.rounded.full};
  background: #f0faf5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7a4a;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
