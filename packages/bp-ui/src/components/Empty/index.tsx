// Components
import { Typography } from '../Typography';
// Local
import { Wrapper } from './styles';

export interface IEmptyProps {
  title: string;
  description: string;
}

export function Empty({ title, description }: IEmptyProps) {
  return (
    <Wrapper>
      <Typography type="h3">{title}</Typography>
      <Typography type="p">{description}</Typography>
    </Wrapper>
  );
}
