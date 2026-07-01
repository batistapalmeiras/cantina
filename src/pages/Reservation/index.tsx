// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
// Libs
import { Pencil } from 'lucide-react';
// Components
import icon from '../../assets/icon.png';
import { Button } from '../../components/Button';
import { InfoBox } from '../../components/InfoBox';
import { DishSelector } from '../../components/Inputs';
import { PaymentToggle } from '../../components/PaymentToggle';
import { Typography } from '../../components/Typography';
import { useClient } from '../../hooks/useClient';
import { useModal } from '../../hooks/useModal';
import { PaymentMethod } from '../../types';
import { maskPhone } from '../../utils';
// Local
import { CancelConfirmDialog } from './components/CancelConfirmDialog';
import { EditProfileModal } from './components/EditProfileModal';
import { HistoryModal } from './components/HistoryModal';
import { useClientHistory } from './hooks/useClientHistory';
import { useReservation } from './hooks/useReservation';
import {
  BrandLogo,
  BrandName,
  BrandRow,
  BrandSub,
  CancelLink,
  Card,
  CardLabel,
  Container,
  EditBtn,
  Empty,
  ErrorMsg,
  FieldStack,
  FieldWrap,
  Header,
  HistoryBtn,
  Input,
  Label,
  Page,
  SessionDate,
  SessionName,
  Skeleton,
  TotalLabel,
  TotalLine,
  TotalValue,
} from './styles';
import { ReservationFormValues,reservationSchema } from './validators';

export function ReservationPage() {
  const { client, loginClient, updateClient, loading: clientLoading } = useClient();
  const { open, close, modal } = useModal();
  const [loggingIn, setLoggingIn] = useState(false);

  const {
    session,
    paymentMethod,
    setPaymentMethod,
    quantities,
    tickets,
    total,
    clientOrder,
    increment,
    decrement,
    setAddonCount,
    submitReservation,
    saveReservation,
    cancelReservation,
  } = useReservation(client?.phone);

  const { history, loading: historyLoading } = useClientHistory(client?.phone, session?.id);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { name: '', phone: '' },
  });

  const name = watch('name');
  const phone = watch('phone');

  const openEditProfile = () => {
    if (!client) return;
    open(
      <EditProfileModal
        name={client.name}
        phone={client.phone}
        close={close}
        onSave={updateClient}
      />
    );
  };

  const brandHeader = (sub: string, showEdit = false) => (
    <Header>
      <BrandRow>
        <BrandLogo src={icon} alt="Cantina IBC" />
        <div>
          <BrandName>Cantina IBC</BrandName>
          <BrandSub>{sub}</BrandSub>
        </div>
      </BrandRow>
      {showEdit && (
        <EditBtn onClick={openEditProfile}>
          <Pencil size={13} />
          Editar dados
        </EditBtn>
      )}
    </Header>
  );

  const paymentSection = (
    <Card>
      <PaymentToggle label="Forma de pagamento" value={paymentMethod} onChange={setPaymentMethod} />
      {paymentMethod === PaymentMethod.Pix && (
        <InfoBox variant="warning" style={{ marginTop: 12 }}>Apresente o comprovante Pix no caixa após o culto.</InfoBox>
      )}
      {paymentMethod === PaymentMethod.Cash && (
        <InfoBox variant="warning" style={{ marginTop: 12 }}>Acerte o pagamento em dinheiro no caixa após o culto.</InfoBox>
      )}
      <TotalLine>
        <TotalLabel>Total</TotalLabel>
        <TotalValue>R$ {total.toFixed(2)}</TotalValue>
      </TotalLine>
    </Card>
  );

  const openHistory = () => open(<HistoryModal history={history} loading={historyLoading} />);

  if (!session || !session.isOpen) {
    return (
      <Page>
        <Container>
          {brandHeader('Igreja Batista Palmeiras')}
          <Empty>
            <Typography type="h3">Reservas indisponíveis</Typography>
            <Typography type="p">Nenhuma sessão está aberta no momento.</Typography>
          </Empty>
        </Container>
      </Page>
    );
  }

  if (clientLoading) {
    return (
      <Page>
        <Container>
          {brandHeader('Igreja Batista Palmeiras')}
          <Card>
            <Skeleton $h="20px" $w="55%" />
            <Skeleton $h="13px" $w="35%" style={{ marginTop: 8 }} />
          </Card>
          <Card>
            <Skeleton $h="13px" $w="30%" style={{ marginBottom: 16 }} />
            <Skeleton $h="72px" />
          </Card>
          <Card>
            <Skeleton $h="13px" $w="25%" style={{ marginBottom: 16 }} />
            <Skeleton $h="44px" />
            <Skeleton $h="48px" style={{ marginTop: 12 }} />
          </Card>
        </Container>
      </Page>
    );
  }

  if (!client) {
    const handleLogin = async () => {
      setLoggingIn(true);
      try { await loginClient(name, phone); }
      finally { setLoggingIn(false); }
    };

    return (
      <Page>
        <Container>
          {brandHeader('Igreja Batista Palmeiras')}
          <Card>
            <CardLabel>Identificação</CardLabel>
            <Typography type="p" style={{ marginBottom: 20 }}>
              Digite seu nome e telefone para fazer uma reserva.
            </Typography>
            <FieldStack>
              <FieldWrap>
                <Label>Nome completo</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input {...field} placeholder="Seu nome" $error={!!errors.name} />
                  )}
                />
                {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
              </FieldWrap>
              <FieldWrap>
                <Label>Telefone (WhatsApp)</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="(11) 99999-0000"
                      inputMode="numeric"
                      $error={!!errors.phone}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                    />
                  )}
                />
                {errors.phone && <ErrorMsg>{errors.phone.message}</ErrorMsg>}
              </FieldWrap>
            </FieldStack>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit(handleLogin)}
              disabled={loggingIn || !name?.trim() || !phone?.trim()}
              style={{ marginTop: 20 }}
            >
              {loggingIn ? 'Verificando...' : 'Continuar'}
            </Button>
          </Card>
        </Container>
      </Page>
    );
  }

  if (clientOrder) {
    return (
      <Page>
        <Container>
          {brandHeader(`Olá, ${client.name}!`, true)}

          <Card>
            <SessionName>{session.ministry}</SessionName>
            <SessionDate>{new Date(session.date).toLocaleDateString('pt-BR')}</SessionDate>
          </Card>

          <Card>
            <CardLabel>Sua reserva</CardLabel>
            <DishSelector
              dishes={session.dishes}
              quantities={quantities}
              onIncrement={increment}
              onDecrement={decrement}
              onSetAddonCount={setAddonCount}
            />
          </Card>

          {paymentSection}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => saveReservation(client.name, client.phone)}
            disabled={tickets.length === 0}
          >
            Salvar alterações
          </Button>

          <CancelLink onClick={() => open(<CancelConfirmDialog close={close} onConfirm={cancelReservation} />)}>
            Cancelar minha reserva
          </CancelLink>

          <HistoryBtn onClick={openHistory}>Ver histórico de pedidos</HistoryBtn>

          {modal}
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        {brandHeader(`Olá, ${client.name}!`, true)}

        <Card>
          <SessionName>{session.ministry}</SessionName>
          <SessionDate>{new Date(session.date).toLocaleDateString('pt-BR')}</SessionDate>
        </Card>

        <Card>
          <CardLabel>Fichinhas</CardLabel>
          <DishSelector
            dishes={session.dishes}
            quantities={quantities}
            onIncrement={increment}
            onDecrement={decrement}
            onSetAddonCount={setAddonCount}
          />
        </Card>

        {paymentSection}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => submitReservation({ name: client.name, phone: client.phone })}
          disabled={tickets.length === 0}
        >
          Confirmar reserva
        </Button>

        <HistoryBtn onClick={openHistory}>Ver histórico de pedidos</HistoryBtn>

        {modal}
      </Container>
    </Page>
  );
}
