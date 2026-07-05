// React
import { useForm } from 'react-hook-form';
// Libs
import { Button, ModalActions, ModalTitle, TextInput, Typography } from 'bp-ui';

interface IClientRegisterDialogProps {
  close: () => void;
  onRegister: (name: string) => void;
}

interface RegisterFormValues {
  name: string;
}

export function ClientRegisterDialog({ close, onRegister }: IClientRegisterDialogProps) {
  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    defaultValues: { name: '' },
  });

  const name = watch('name');

  const submit = handleSubmit((values) => {
    const trimmed = values.name.trim();
    if (!trimmed) return;
    onRegister(trimmed);
    close();
  });

  return (
    <form onSubmit={submit}>
      <ModalTitle>Novo cliente</ModalTitle>
      <Typography type="p" style={{ marginBottom: 12 }}>Informe o nome para cadastrar.</Typography>
      <TextInput control={control} name="name" label="Nome" placeholder="Nome do cliente" autoFocus />
      <ModalActions>
        <Button type="button" variant="secondary" size="md" onClick={close}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={!name.trim()}>
          Cadastrar e usar
        </Button>
      </ModalActions>
    </form>
  );
}
