// React
import { ElementType } from 'react';
// Local
import { defaultTagMap, StyledText } from './styles';
import { TypographyProps } from './types';

export function Typography({ type, as, children, ...rest }: TypographyProps) {
  const tag = as ?? defaultTagMap[type];
  return (
    <StyledText as={tag as ElementType} $type={type} {...rest}>
      {children}
    </StyledText>
  );
}
