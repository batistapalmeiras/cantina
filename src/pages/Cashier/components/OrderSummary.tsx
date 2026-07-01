// React
import { Control, Controller } from 'react-hook-form';
// Libs
import styled from 'styled-components';
// Components
import { Button } from '../../../components/Button';
import { PaymentToggle } from '../../../components/PaymentToggle';
import { TicketItem } from '../../../types';
import { CashierFormValues } from '../validators';

interface Props {
  control: Control<CashierFormValues>;
  tickets: TicketItem[];
  total: number;
  onConfirm: () => void;
}

const DesktopOnly = styled.div`
  @media (max-width: 900px) { display: none; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
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


export function OrderSummary({ control, tickets, total, onConfirm }: Props) {
  return (
    <Card>
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

      <DesktopOnly>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <PaymentToggle label="Forma de pagamento" value={field.value} onChange={field.onChange} />
          )}
        />
      </DesktopOnly>

      <Button variant="primary" size="lg" fullWidth onClick={onConfirm} disabled={tickets.length === 0}>
        Confirmar venda
      </Button>
    </Card>
  );
}
