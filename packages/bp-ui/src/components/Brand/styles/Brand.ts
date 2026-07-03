// React
import { Link } from 'react-router-dom';
// Libs
import styled, { css, type DefaultTheme, type StyledComponent } from 'styled-components';

const brandLayout = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

export const BrandLink: StyledComponent<typeof Link, DefaultTheme> = styled(Link)`
  ${brandLayout}
  text-decoration: none;
`;

export const BrandWrapper = styled.div`
  ${brandLayout}
`;

export const BrandLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

export const BrandName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 480px) {
    display: none;
  }
`;
