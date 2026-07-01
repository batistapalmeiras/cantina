// Components
import { OrderStatus, PaymentMethod } from '../../../../types';

export interface HistoryOrder {
  id: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  dishes: string[];
  sessionDate: string;
  sessionMinistry: string;
}
