// React
import { Control, Controller } from 'react-hook-form';
// Libs
import styled from 'styled-components';
// Components
import { SegmentedControl } from 'bp-ui';
import { PAYMENT_METHOD_LABEL, PaymentMethod } from 'bp-core';
import { CashierFormValues } from '../validators';

interface Props {
  control: Control<CashierFormValues>;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export function PaymentSection({ control }: Props) {
  return (
    <Container>
      <Controller
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <SegmentedControl
            label="Forma de pagamento"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: PaymentMethod.Cash, label: PAYMENT_METHOD_LABEL[PaymentMethod.Cash] },
              { value: PaymentMethod.Pix, label: PAYMENT_METHOD_LABEL[PaymentMethod.Pix] },
            ]}
          />
        )}
      />

      <Controller
        control={control}
        name="stayForMeal"
        render={({ field }) => (
          <SegmentedControl
            label="Consumo"
            tone="primary"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: false, label: 'Para viagem' },
              { value: true, label: 'Espaço de Convivência' },
            ]}
          />
        )}
      />
    </Container>
  );
}
