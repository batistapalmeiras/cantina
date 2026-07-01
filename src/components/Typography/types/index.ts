// React
import { ElementType, HTMLAttributes } from 'react';

export type TypographyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'caption'
  | 'error'
  | 'micro';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  type: TypographyType;
  as?: ElementType;
}
