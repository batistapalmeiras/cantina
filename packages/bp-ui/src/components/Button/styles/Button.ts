// Libs
import styled from 'styled-components';
// Components
import { buttonBaseCss, sizeStyles, variantStyles } from '../../_shared/buttonBase';
import { Size, Variant } from '../types';

export const StyledButton = styled.button<{ $variant: Variant; $size: Size; $fullWidth: boolean }>`
  ${buttonBaseCss}
  ${({ $size }: { $size: Size }) => sizeStyles[$size]}
  ${({ $variant }: { $variant: Variant }) => variantStyles[$variant]}
`;
