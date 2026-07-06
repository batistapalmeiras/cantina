// Libs
import styled, { css } from 'styled-components';
// Components
import { buttonBaseCss, sizeStyles, variantStyles } from '../../_shared/buttonBase';
import { Size, Variant } from '../types';

export const iconBoxSize: Record<Size, number> = { xs: 14, sm: 16, md: 18, lg: 20 };

export const IconWrap = styled.span<{ $size: Size }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }: { $size: Size }) => iconBoxSize[$size]}px;
  height: ${({ $size }: { $size: Size }) => iconBoxSize[$size]}px;
  flex-shrink: 0;

  svg { display: block; width: 100%; height: 100%; }
`;

export const StyledButton = styled.button<{ $variant: Variant; $size: Size; $fullWidth: boolean; $iconOnly: boolean }>`
  ${buttonBaseCss}
  ${({ $size }: { $size: Size }) => sizeStyles[$size]}
  ${({ $variant }: { $variant: Variant }) => variantStyles[$variant]}
  ${({ $iconOnly }: { $iconOnly: boolean }) => $iconOnly && css`padding: 0; aspect-ratio: 1 / 1;`}
`;
