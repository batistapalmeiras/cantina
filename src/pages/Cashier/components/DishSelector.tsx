// React
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
// Libs
import styled from 'styled-components';
// Components
import { DishQuantity,DishSelector } from '../../../components/Inputs/DishSelector';
import { PaymentToggle } from '../../../components/PaymentToggle';
import { Dish } from '../../../types';
import { CashierFormValues } from '../validators';
// Local
import { ClientSearch } from './ClientSearch';

interface Props {
  control: Control<CashierFormValues>;
  setValue: UseFormSetValue<CashierFormValues>;
  dishes: Dish[];
  quantities: Record<string, DishQuantity>;
  onIncrement: (dish: Dish) => void;
  onDecrement: (dishId: string) => void;
  onSetAddonCount: (dishId: string, addonId: string, count: number) => void;
}

const SectionLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.lg};
  }
`;

export function CashierDishSelector({ control, setValue, dishes, quantities, onIncrement, onDecrement, onSetAddonCount }: Props) {
  return (
    <div>
      <SectionLabel>Cliente</SectionLabel>
      <div style={{ marginBottom: 24 }}>
        <ClientSearch
          onSelect={(client) => {
            setValue('customerName', client.name, { shouldValidate: true });
            setValue('customerPhone', client.phone, { shouldValidate: true });
            setValue('clientId', client.id, { shouldValidate: true });
          }}
          onClear={() => {
            setValue('customerName', '');
            setValue('customerPhone', '');
            setValue('clientId', '');
          }}
        />
      </div>

      <SectionLabel>Fichinhas</SectionLabel>
      <DishSelector
        dishes={dishes}
        quantities={quantities}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onSetAddonCount={onSetAddonCount}
      />

      <MobileOnly>
        <SectionLabel>Pagamento</SectionLabel>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <PaymentToggle label="Forma de pagamento" value={field.value} onChange={field.onChange} />
          )}
        />
      </MobileOnly>
    </div>
  );
}
