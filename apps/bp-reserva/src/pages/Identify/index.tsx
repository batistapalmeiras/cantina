// Libs
import { Button, Typography } from 'bp-ui';
import { maskPhone } from 'bp-ui';
// Components
import icon from '../../assets/icon.png';
// Local
import { useIdentify } from './hooks';
import { BackLink, BrandLogo, BrandName, BrandRow, Container, FieldWrap, Header, Input, Label, Page } from './styles';

export function IdentifyPage() {
  const { phase, phone, setPhone, name, setName, checking, registering, handleCheckPhone, handleRegister, handleBack } =
    useIdentify();

  return (
    <Page>
      <Container>
        <Header>
          <BrandRow>
            <BrandLogo src={icon} alt="Cantina IBC" />
            <div>
              <BrandName>Cantina IBC</BrandName>
            </div>
          </BrandRow>
        </Header>

        {phase === 'phone' ? (
          <form onSubmit={handleCheckPhone}>
            <Typography type="p" style={{ marginBottom: 20 }}>
              Digite seu telefone para continuar.
            </Typography>
            <FieldWrap>
              <Label>Telefone (WhatsApp)</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(11) 99999-0000"
                inputMode="numeric"
                autoFocus
              />
            </FieldWrap>
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
          <form onSubmit={handleRegister}>
            <Typography type="p" style={{ marginBottom: 20 }}>
              Não encontramos o telefone <strong>{phone}</strong>. Como podemos te chamar?
            </Typography>
            <FieldWrap>
              <Label>Nome completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoFocus />
            </FieldWrap>
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
