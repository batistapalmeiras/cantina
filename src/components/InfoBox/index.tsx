import React from 'react';
import styled from 'styled-components';
import { Info, AlertTriangle } from 'lucide-react';

type Variant = 'info' | 'warning';

interface Props {
  variant?: Variant;
  children: React.ReactNode;
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

export function InfoBox({ variant = 'info', children }: Props) {
  return (
    <Box $variant={variant}>
      {variant === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
      <div>{children}</div>
    </Box>
  );
}
