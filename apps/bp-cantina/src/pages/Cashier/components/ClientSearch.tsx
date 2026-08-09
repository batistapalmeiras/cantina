// React
import { useEffect } from 'react';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
// Libs
import styled from 'styled-components';
import { TextInput, Typography } from 'bp-kit';
import { useModal } from 'bp-ui';
// Components
import { useClientSearch } from '../hooks';
import { CashierFormValues } from '../validators';
// Local
import { ClientRegisterDialog } from './ClientRegisterDialog';

interface Props {
  control: Control<CashierFormValues>;
  setValue: UseFormSetValue<CashierFormValues>;
}

const ResultsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  overflow: hidden;
`;

const ResultRow = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.base};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  background: ${({ theme }) => theme.colors.canvas};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSoft};
  }
`;

const ResultPhone = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const SelectedCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.base};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  background: ${({ theme }) => theme.colors.successSurface};
  border-radius: ${({ theme }) => theme.rounded.md};
`;

const SelectedInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const SelectedLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

const SelectedName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function ClientSearch({ control, setValue }: Props) {
  const phone = useWatch({ control, name: 'customerPhone' }) ?? '';
  const { state, selectClient, markNewClient } = useClientSearch(phone);
  const { open, close } = useModal();

  useEffect(() => {
    if (state.type === 'selected') {
      setValue('customerName', state.client.name, { shouldValidate: true });
      setValue('clientId', state.client.id, { shouldValidate: true });
      if (state.client.phone !== phone) setValue('customerPhone', state.client.phone, { shouldValidate: true });
    } else {
      setValue('customerName', '', { shouldValidate: true });
      setValue('clientId', '', { shouldValidate: true });
    }
  }, [state]);

  useEffect(() => {
    if (state.type === 'not_found') {
      open(<ClientRegisterDialog close={close} onRegister={markNewClient} />);
    }
  }, [state.type]);

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

      {state.type === 'loading' && (
        <Typography type="caption" style={{ marginTop: 4 }}>Carregando clientes...</Typography>
      )}

      {state.type === 'results' && state.clients.length > 0 && (
        <ResultsList>
          {state.clients.map((c) => (
            <ResultRow key={c.id} type="button" onClick={() => selectClient(c)}>
              <strong>{c.name}</strong> · <ResultPhone>{c.phone}</ResultPhone>
            </ResultRow>
          ))}
        </ResultsList>
      )}

      {state.type === 'selected' && (
        <SelectedCard>
          <SelectedInfo>
            <SelectedLabel>Cliente selecionado</SelectedLabel>
            <SelectedName>{state.client.name}</SelectedName>
          </SelectedInfo>
        </SelectedCard>
      )}
    </div>
  );
}
