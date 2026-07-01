import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from './hooks/useLogin';
import { loginSchema, LoginFormValues } from './validators/schema';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/Inputs';
import icon from '../../assets/icon.png';
import {
  Page,
  Brand,
  BrandMark,
  BrandText,
  BrandName,
  BrandSub,
  BrandQuote,
  FormPanel,
  FormBox,
  FormHeader,
  FormTitle,
  FormSubtitle,
  Form,
  ErrorMsg,
} from './styles';

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
