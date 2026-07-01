// React
import React from 'react';
// Libs
import { AlertTriangle,Info } from 'lucide-react';
import styled from 'styled-components';

type Variant = 'info' | 'warning';

interface Props {
  variant?: Variant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Box = styled.div<{ $variant: Variant }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyMd.lineHeight};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ $variant }) => ($variant === 'warning' ? '#fffbeb' : '#eff6ff')};
  border: 1px solid ${({ $variant }) => ($variant === 'warning' ? '#fde68a' : '#bfdbfe')};

  svg { flex-shrink: 0; margin-top: 1px; color: ${({ $variant }) => ($variant === 'warning' ? '#d97706' : '#3b82f6')}; }
`;

export function InfoBox({ variant = 'info', children, style }: Props) {
  return (
    <Box $variant={variant} style={style}>
      {variant === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
      <div>{children}</div>
    </Box>
  );
}
