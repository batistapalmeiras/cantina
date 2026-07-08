// React
import { useEffect } from 'react';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
// Libs
import { TextInput, Typography, useModal } from 'bp-ui';
// Components
import { useClientSearch } from '../hooks';
import { CashierFormValues } from '../validators';
// Local
import { ClientRegisterDialog } from './ClientRegisterDialog';

interface Props {
  control: Control<CashierFormValues>;
  setValue: UseFormSetValue<CashierFormValues>;
}

export function ClientSearch({ control, setValue }: Props) {
  const phone = useWatch({ control, name: 'customerPhone' }) ?? '';
  const { state, markNewClient } = useClientSearch(phone);
  const { open, close, modal } = useModal();

  useEffect(() => {
    if (state.type === 'found') {
      setValue('customerName', state.client.name, { shouldValidate: true });
      setValue('clientId', state.client.id, { shouldValidate: true });
    } else if (state.type === 'not_found') {
      setValue('customerName', '', { shouldValidate: true });
      setValue('clientId', '', { shouldValidate: true });
      open(<ClientRegisterDialog close={close} onRegister={markNewClient} />);
    } else if (state.type === 'idle') {
      setValue('customerName', '', { shouldValidate: true });
      setValue('clientId', '', { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div>
      <TextInput
        control={control}
        name="customerPhone"
        mask="phone"
        label="Telefone"
        placeholder="(00) 90000-0000"
        inputMode="numeric"
      />

      {state.type === 'searching' && (
        <Typography type="caption" style={{ marginTop: 4 }}>Verificando...</Typography>
      )}
      {state.type === 'found' && (
        <Typography type="caption" style={{ marginTop: 4 }}>
          Cliente: <strong>{state.client.name}</strong>
        </Typography>
      )}

      {modal}
    </div>
  );
}
