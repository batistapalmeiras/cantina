// Libs
import styled, { css } from 'styled-components';
// Components
import { TypographyType } from '../types';

export const styleMap: Record<TypographyType, ReturnType<typeof css>> = {
  h1: css`font-size: ${({ theme }) => theme.typography.displayXl.fontSize}; font-weight: ${({ theme }) => theme.typography.displayXl.fontWeight}; line-height: ${({ theme }) => theme.typography.displayXl.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  h2: css`font-size: ${({ theme }) => theme.typography.displayMd.fontSize}; font-weight: ${({ theme }) => theme.typography.displayMd.fontWeight}; line-height: ${({ theme }) => theme.typography.displayMd.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  h3: css`font-size: ${({ theme }) => theme.typography.displaySm.fontSize}; font-weight: ${({ theme }) => theme.typography.displaySm.fontWeight}; line-height: ${({ theme }) => theme.typography.displaySm.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  h4: css`font-size: ${({ theme }) => theme.typography.titleMd.fontSize}; font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight}; line-height: ${({ theme }) => theme.typography.titleMd.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  h5: css`font-size: ${({ theme }) => theme.typography.titleSm.fontSize}; font-weight: ${({ theme }) => theme.typography.titleSm.fontWeight}; line-height: ${({ theme }) => theme.typography.titleSm.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  h6: css`font-size: ${({ theme }) => theme.typography.bodySm.fontSize}; font-weight: 600; line-height: ${({ theme }) => theme.typography.bodySm.lineHeight}; color: ${({ theme }) => theme.colors.ink};`,
  p: css`font-size: ${({ theme }) => theme.typography.bodyMd.fontSize}; font-weight: ${({ theme }) => theme.typography.bodyMd.fontWeight}; line-height: ${({ theme }) => theme.typography.bodyMd.lineHeight}; color: ${({ theme }) => theme.colors.body};`,
  span: css`font-size: ${({ theme }) => theme.typography.bodyMd.fontSize}; font-weight: ${({ theme }) => theme.typography.bodyMd.fontWeight}; line-height: ${({ theme }) => theme.typography.bodyMd.lineHeight}; color: ${({ theme }) => theme.colors.body};`,
  label: css`font-size: ${({ theme }) => theme.typography.caption.fontSize}; font-weight: ${({ theme }) => theme.typography.caption.fontWeight}; line-height: ${({ theme }) => theme.typography.caption.lineHeight}; color: ${({ theme }) => theme.colors.muted}; text-transform: uppercase; letter-spacing: 0.5px;`,
  caption: css`font-size: ${({ theme }) => theme.typography.captionSm.fontSize}; font-weight: ${({ theme }) => theme.typography.captionSm.fontWeight}; line-height: ${({ theme }) => theme.typography.captionSm.lineHeight}; color: ${({ theme }) => theme.colors.muted};`,
  error: css`font-size: ${({ theme }) => theme.typography.bodySm.fontSize}; font-weight: ${({ theme }) => theme.typography.bodySm.fontWeight}; color: ${({ theme }) => theme.colors.primaryErrorText};`,
  micro: css`font-size: ${({ theme }) => theme.typography.microLabel.fontSize}; font-weight: ${({ theme }) => theme.typography.microLabel.fontWeight}; line-height: ${({ theme }) => theme.typography.microLabel.lineHeight}; color: ${({ theme }) => theme.colors.muted}; text-transform: uppercase; letter-spacing: 0.5px;`,
};

export const defaultTagMap = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  p: 'p', span: 'span',
  label: 'p', caption: 'p', error: 'p', micro: 'p',
} as const;

export const StyledText = styled.p<{ $type: TypographyType }>`
  ${({ $type }: { $type: TypographyType }) => styleMap[$type]}
`;
