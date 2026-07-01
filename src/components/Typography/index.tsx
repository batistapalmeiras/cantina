// React
import { ElementType, HTMLAttributes } from 'react';
// Local
import { defaultTagMap, StyledText } from './styles';

type TypographyType =
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

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  type: TypographyType;
  as?: ElementType;
}

export function Typography({ type, as, children, ...rest }: TypographyProps) {
  const tag = as ?? defaultTagMap[type];
  return (
    <StyledText as={tag as ElementType} $type={type} {...rest}>
      {children}
    </StyledText>
  );
}
