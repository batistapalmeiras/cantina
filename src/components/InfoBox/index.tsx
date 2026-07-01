// React
import React from 'react';
// Libs
import { AlertTriangle, Info } from 'lucide-react';
// Local
import { Box } from './styles';

type Variant = 'info' | 'warning';

interface Props {
  variant?: Variant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function InfoBox({ variant = 'info', children, style }: Props) {
  return (
    <Box $variant={variant} style={style}>
      {variant === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
      <div>{children}</div>
    </Box>
  );
}
