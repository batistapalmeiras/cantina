export interface DbSession {
  id: string;
  date: string;
  ministry: string;
  pix_key: string;
  is_open: boolean;
  created_at: string;
}

export interface DbDish {
  id: string;
  session_id: string;
  name: string;
  price: number;
  total_tickets: number;
  sold_tickets: number;
}

export interface DbAddon {
  id: string;
  dish_id: string;
  name: string;
}

export interface DbOrder {
  id: string;
  session_id: string;
  customer_name: string;
  customer_phone: string | null;
  payment_method: 'cash' | 'pix';
  status: 'reservation' | 'sale';
  total: number;
  created_at: string;
  confirmed_at: string | null;
}

export interface DbTicketItem {
  id: string;
  order_id: string;
  dish_id: string;
  dish_name: string;
  dish_base_price: number;
  total_price: number;
  addons: { id: string; name: string }[];
}
