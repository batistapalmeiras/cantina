// React
import { useForm } from 'react-hook-form';
// Libs
import { Brand, Button, PageHeader, TextInput } from 'bp-ui';
// Components
import icon from '../../assets/icon.png';
// Local
import { useIdentify } from './hooks';
import { BackLink, Container, Header, Page } from './styles';

interface IdentifyFormValues {
  phone: string;
  name: string;
}

export function IdentifyPage() {
  const { phase, checking, registering, handleCheckPhone, handleRegister, handleBack } = useIdentify();
  const { control, handleSubmit, watch } = useForm<IdentifyFormValues>({
    defaultValues: { phone: '', name: '' },
  });

  const phone = watch('phone');
  const name = watch('name');

  return (
    <Page>
      <Container>
        <Header>
          <Brand
            icon={icon}
            alt="Cantina Batista Palmeiras"
            name="Cantina Batista Palmeiras"
          />
        </Header>

        {phase === 'phone' ? (
          <form onSubmit={handleSubmit((values) => handleCheckPhone(values.phone))}>
            <PageHeader title="Identificação" subtitle="Digite seu telefone para continuar." />
            <TextInput
              control={control}
              name="phone"
              mask="phone"
              label="Telefone (WhatsApp)"
              placeholder="(31) 99999-0000"
              inputMode="numeric"
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={checking || !phone.trim()}
              style={{ marginTop: 20 }}
            >
              {checking ? 'Verificando...' : 'Continuar'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit((values) => handleRegister(values.name, values.phone))}>
            <PageHeader title="Novo cadastro" subtitle="Como podemos te chamar?" />
            <TextInput
              control={control}
              name="name"
              label="Nome completo"
              placeholder="Seu nome"
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={registering || !name.trim() || !phone.trim()}
              style={{ marginTop: 20 }}
            >
              {registering ? 'Salvando...' : 'Criar cadastro'}
            </Button>
            <BackLink type="button" onClick={handleBack}>
              ← Trocar telefone
            </BackLink>
          </form>
        )}
      </Container>
    </Page>
  );
}
