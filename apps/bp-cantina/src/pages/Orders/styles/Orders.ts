// Libs
import styled from 'styled-components';
import { StatsGrid } from 'bp-kit';

export const OrderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// StatsGrid (bp-kit) empilha em 1 coluna abaixo de 480px; aqui mantemos os
// 3 cards lado a lado mesmo no celular.
export const StatsGridInline = styled(StatsGrid)`
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;
