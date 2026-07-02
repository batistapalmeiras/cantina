// Libs
import styled from 'styled-components';
// Components
import { fadeUp } from 'bp-ui';

export const Page = styled.div`
  min-height: 100vh;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Brand = styled.div`
  flex: 0 0 420px;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    flex: 0 0 340px;
  }

  @media (max-width: 768px) {
    flex: none;
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.base};
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const BrandMark = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.rounded.xl};
  background: ${({ theme }) => theme.colors.onPrimary};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  position: relative;
  z-index: 1;

  img {
    width: 52px;
    height: 52px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;

    img { width: 38px; height: 38px; }
  }
`;

export const BrandText = styled.div`
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 1;
`;

export const BrandName = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.2;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const BrandSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  opacity: 0.75;
  line-height: 1.4;
`;

export const BrandQuote = styled.blockquote`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 260px;
  line-height: 1.5;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FormPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.canvas};

  @media (max-width: 768px) {
  justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.base};
  }
`;

export const FormBox = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeUp} 0.35s ease;
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const FormTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: -0.3px;
  margin-bottom: 6px;
`;

export const FormSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ErrorMsg = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.primaryErrorText};
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${({ theme }) => theme.rounded.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  text-align: center;
`;
