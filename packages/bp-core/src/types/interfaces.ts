// Local
import { OrderStatus, PaymentMethod } from './enums';

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface PriceTier {
  id: string;
  quantity: number; // sempre >= 2 — a faixa de quantidade 1 é o próprio `Dish.price`
  price: number; // preço total para essa quantidade
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  availableAddons: Addon[];
  priceTiers: PriceTier[];
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
  delivered: boolean;
  stayForMeal: boolean;
  receiptPath?: string;
}

export interface Session {
  id: string;
  date: string;
  ministry: string;
  dishes: Dish[];
  orders: Order[];
  isOpen: boolean;
  status: 'open' | 'pending' | 'closed';
}
