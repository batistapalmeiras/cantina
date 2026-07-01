import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled, { keyframes } from 'styled-components';
import { Pencil } from 'lucide-react';
import { useReservation } from './hooks/useReservation';
import { useClientHistory } from './hooks/useClientHistory';
import { reservationSchema, ReservationFormValues } from './validators/schema';
import { useClient } from '../../hooks/useClient';
import { useModal } from '../../hooks/useModal';
import { PaymentMethod } from '../../types';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { InfoBox } from '../../components/InfoBox';
import { DishSelector } from '../../components/Inputs';
import { EditProfileModal } from './components/EditProfileModal';
import { CancelConfirmDialog } from './components/CancelConfirmDialog';
import { HistoryModal } from './components/HistoryModal';
import icon from '../../assets/icon.png';

/* ── Phone mask ─────────────────────────────────────────── */

const formatPhone = (val: string) => {
  const d = val.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/* ── Skeleton ───────────────────────────────────────────── */

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

const Skeleton = styled.div<{ $h?: string; $w?: string }>`
  height: ${({ $h }) => $h ?? '16px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

/* ── Layout ──────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.base};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

/* ── Header ─────────────────────────────────────────────── */

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.base} 0;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const BrandName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const BrandSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 1px;
`;

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.full};
  background: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: box-shadow 0.15s, color 0.15s;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; color: ${({ theme }) => theme.colors.ink}; }
`;

/* ── Cards ──────────────────────────────────────────────── */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SessionName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

const SessionDate = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

/* ── Input ──────────────────────────────────────────────── */

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

const Input = styled.input<{ $error?: boolean }>`
  height: 48px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.primaryErrorText : theme.colors.hairline)};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.canvas};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.hairlineSoft};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.mutedSoft}; }
`;

const ErrorMsg = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.primaryErrorText};
`;

/* ── Payment toggle ─────────────────────────────────────── */

const PaymentToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PaymentBtn = styled.button<{ $selected: boolean }>`
  height: 44px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.buttonSm.fontSize};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.ink : theme.colors.canvas)};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.onDark : theme.colors.muted)};
  & + & { border-left: 1px solid ${({ theme }) => theme.colors.hairline}; }
  &:hover { background: ${({ theme, $selected }) => ($selected ? theme.colors.ink : theme.colors.surfaceSoft)}; }
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
`;

const TotalLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

const TotalValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const CancelLink = styled.button`
  display: block;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.primaryErrorText};
  cursor: pointer;
  text-align: center;
  &:hover { text-decoration: underline; }
`;

const HistoryBtn = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  text-align: center;
  &:hover { color: ${({ theme }) => theme.colors.ink}; text-decoration: underline; }
`;

/* ── Empty page ─────────────────────────────────────────── */

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.base};
`;

/* ══════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════ */

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Cash]: 'Dinheiro',
};

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
      <CardLabel>Pagamento</CardLabel>
      <PaymentToggle>
        <PaymentBtn $selected={paymentMethod === PaymentMethod.Pix} onClick={() => setPaymentMethod(PaymentMethod.Pix)}>
          Pix
        </PaymentBtn>
        <PaymentBtn $selected={paymentMethod === PaymentMethod.Cash} onClick={() => setPaymentMethod(PaymentMethod.Cash)}>
          Dinheiro
        </PaymentBtn>
      </PaymentToggle>
      {paymentMethod === PaymentMethod.Pix && (
        <InfoBox variant="warning">Apresente o comprovante Pix no caixa após o culto.</InfoBox>
      )}
      {paymentMethod === PaymentMethod.Cash && (
        <InfoBox variant="warning">Acerte o pagamento em dinheiro no caixa após o culto.</InfoBox>
      )}
      <TotalLine>
        <TotalLabel>Total</TotalLabel>
        <TotalValue>R$ {total.toFixed(2)}</TotalValue>
      </TotalLine>
    </Card>
  );

  const openHistory = () => open(<HistoryModal history={history} loading={historyLoading} />);

  /* ── Sessão fechada ── */
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

  /* ── Skeleton ── */
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

  /* ── Login ── */
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
                      onChange={(e) => field.onChange(formatPhone(e.target.value))}
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

  /* ── Editar reserva existente ── */
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

  /* ── Nova reserva ── */
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
