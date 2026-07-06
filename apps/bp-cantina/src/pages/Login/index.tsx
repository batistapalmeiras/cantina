// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// Libs
import { Button, TextInput } from 'bp-ui';
// Local
import icon from '../../assets/icon.png';
import { useLogin } from './hooks';
import {
  Brand,
  BrandMark,
  BrandName,
  BrandQuote,
  BrandSub,
  BrandText,
  ErrorMsg,
  Form,
  FormBox,
  FormHeader,
  FormPanel,
  FormSubtitle,
  FormTitle,
  Page,
} from './styles';
import { LoginFormValues,loginSchema } from './validators';

export function LoginPage() {
  const { error, submitting, handleLogin } = useLogin();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Page>
      <Brand>
        <BrandMark>
          <img src={icon} alt="Cantina Batista Palmeiras" />
        </BrandMark>
        <BrandText>
          <BrandName>Cantina Batista Palmeiras</BrandName>
          <BrandSub>Igreja Batista de Palmeiras</BrandSub>
        </BrandText>
        <BrandQuote>"Mais que uma Igreja, uma Família!"</BrandQuote>
      </Brand>

      <FormPanel>
        <FormBox>
          <FormHeader>
            <FormTitle>Bem-vindo</FormTitle>
            <FormSubtitle>Entre com suas credenciais para continuar</FormSubtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit(handleLogin)}>
            <TextInput
              label="E-mail"
              control={control}
              name="email"
              type="email"
              autoFocus
              placeholder="seu@email.com"
            />
            <TextInput
              label="Senha"
              control={control}
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </Form>
        </FormBox>
      </FormPanel>
    </Page>
  );
}
