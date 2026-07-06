// React
import { type ComponentType } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
// Libs
import styled, { css } from 'styled-components';

const brandLayout = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

// Explicit annotation keeps the emitted .d.ts portable — the inferred
// styled(Link) type otherwise references a non-nameable react-router internal.
export const BrandLink: ComponentType<LinkProps> = styled(Link)`
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
