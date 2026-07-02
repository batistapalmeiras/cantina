// React
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { ArrowLeft } from 'lucide-react';
// Local
import { Back, Row, Subtitle, Title, Titles, Wrapper } from './styles';

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, back, action }: Props) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      {back && (
        <Back onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          Voltar
        </Back>
      )}
      <Row>
        <Titles>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Titles>
        {action && <div>{action}</div>}
      </Row>
    </Wrapper>
  );
}
