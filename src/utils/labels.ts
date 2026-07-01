// Components
import { OrderStatus, PaymentMethod } from '../types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Sale]: 'Confirmado',
  [OrderStatus.Reservation]: 'Pendente',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Cash]: 'Dinheiro',
};
