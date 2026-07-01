// Local
import { OrderStatus,PaymentMethod } from './enums';

export type UserRole = 'admin' | 'operator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  availableAddons: Addon[];
}

export interface TicketItem {
  dishId: string;
  dishName: string;
  dishBasePrice: number;
  addons: Addon[];
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  tickets: TicketItem[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  total: number;
  createdAt: string;
  confirmedAt?: string;
  delivered: boolean;
}

export interface Session {
  id: string;
  date: string;
  ministry: string;
  dishes: Dish[];
  orders: Order[];
  isOpen: boolean;
  status: 'open' | 'pending' | 'closed';
  pixKey: string;
}
