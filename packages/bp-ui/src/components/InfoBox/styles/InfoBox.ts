// Libs
import styled from 'styled-components';

type Variant = 'info' | 'warning';

export const Box = styled.div<{ $variant: Variant }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyMd.lineHeight};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme, $variant }) => ($variant === 'warning' ? theme.colors.warningSurface : theme.colors.infoSurface)};
  border: 1px solid ${({ theme, $variant }) => ($variant === 'warning' ? theme.colors.warningBorder : theme.colors.infoBorder)};

  svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: ${({ theme, $variant }) => ($variant === 'warning' ? theme.colors.warning : theme.colors.info)};
  }
`;
