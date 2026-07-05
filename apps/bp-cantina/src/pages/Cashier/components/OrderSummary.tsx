// Libs
import { TicketItem } from 'bp-core';
import { Button, Card } from 'bp-ui';
import styled from 'styled-components';

interface Props {
  tickets: TicketItem[];
  total: number;
  onConfirm: () => void;
}

const CardWrapper = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EmptyMsg = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.mutedSoft};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const TicketLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const TicketName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
`;

const TicketPrice = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  white-space: nowrap;
  flex-shrink: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.hairline};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

const TotalValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;


export function OrderSummary({ tickets, total, onConfirm }: Props) {
  return (
    <CardWrapper>
      <SectionLabel>Resumo</SectionLabel>

      {tickets.length === 0 ? (
        <EmptyMsg>Nenhum item selecionado</EmptyMsg>
      ) : (
        <div>
          {Object.values(
            tickets.reduce<Record<string, { name: string; qty: number; subtotal: number }>>((acc, t) => {
              const key = t.dishName;
              if (!acc[key]) acc[key] = { name: t.dishName, qty: 0, subtotal: 0 };
              acc[key].qty++;
              acc[key].subtotal += t.totalPrice;
              return acc;
            }, {})
          ).map((group) => (
            <TicketLine key={group.name}>
              <TicketName>{group.qty}× {group.name}</TicketName>
              <TicketPrice>R$ {group.subtotal.toFixed(2)}</TicketPrice>
            </TicketLine>
          ))}
        </div>
      )}

      <Divider />

      <TotalLine>
        <TotalLabel>Total</TotalLabel>
        <TotalValue>R$ {total.toFixed(2)}</TotalValue>
      </TotalLine>

      <Button variant="primary" size="lg" fullWidth onClick={onConfirm} disabled={tickets.length === 0}>
        Confirmar venda
      </Button>
    </CardWrapper>
  );
}
