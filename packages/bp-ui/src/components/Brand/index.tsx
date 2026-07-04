// Local
import { BrandLink, BrandLogo, BrandName, BrandWrapper } from './styles';

interface Props {
  icon: string;
  alt: string;
  name: string;
  to?: string;
}

export function Brand({ icon, alt, name, to }: Props) {
  const content = (
    <>
      <BrandLogo src={icon} alt={alt} />
      <BrandName>{name}</BrandName>
    </>
  );

  if (to) {
    return <BrandLink to={to}>{content}</BrandLink>;
  }

  return <BrandWrapper>{content}</BrandWrapper>;
}
