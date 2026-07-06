// Hand-authored to match the columns the app actually reads/writes (W2-1).
//
// This is NOT machine-generated. It intentionally mirrors the shape of
// `supabase gen types typescript` so the client can be typed as
// SupabaseClient<Database>. When Supabase access is available, regenerate
// this file from the live schema (`supabase gen types`) to replace it — the
// client typing then keeps working unchanged.
//
// Insert types mark server-defaulted columns (id, created_at, status,
// counters, flags) optional so existing inserts type-check. Each table carries
// an empty `Relationships` to satisfy postgrest-js's GenericTable contract.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface TicketItemAddon {
  id: string;
  name: string;
  price?: number;
}

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          date: string;
          ministry: string;
          is_open: boolean;
          status: 'open' | 'pending' | 'closed';
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          ministry: string;
          is_open?: boolean;
          status?: 'open' | 'pending' | 'closed';
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          ministry?: string;
          is_open?: boolean;
          status?: 'open' | 'pending' | 'closed';
          created_at?: string;
        };
        Relationships: [];
      };
      dishes: {
        Row: {
          id: string;
          session_id: string;
          name: string;
          price: number;
          total_tickets: number;
          sold_tickets: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          name: string;
          price: number;
          total_tickets: number;
          sold_tickets?: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          name?: string;
          price?: number;
          total_tickets?: number;
          sold_tickets?: number;
        };
        Relationships: [];
      };
      addons: {
        Row: {
          id: string;
          dish_id: string;
          name: string;
          price: number;
        };
        Insert: {
          id?: string;
          dish_id: string;
          name: string;
          price?: number;
        };
        Update: {
          id?: string;
          dish_id?: string;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          session_id: string;
          customer_name: string;
          customer_phone: string | null;
          payment_method: 'cash' | 'pix';
          status: 'reservation' | 'sale';
          total: number;
          created_at: string;
          delivered: boolean;
          stay_for_meal: boolean;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          customer_name: string;
          customer_phone?: string | null;
          payment_method: 'cash' | 'pix';
          status: 'reservation' | 'sale';
          total: number;
          created_at?: string;
          delivered?: boolean;
          stay_for_meal?: boolean;
          confirmed_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          customer_name?: string;
          customer_phone?: string | null;
          payment_method?: 'cash' | 'pix';
          status?: 'reservation' | 'sale';
          total?: number;
          created_at?: string;
          delivered?: boolean;
          stay_for_meal?: boolean;
          confirmed_at?: string | null;
        };
        Relationships: [];
      };
      ticket_items: {
        Row: {
          id: string;
          order_id: string;
          dish_id: string;
          dish_name: string;
          dish_base_price: number;
          total_price: number;
          addons: TicketItemAddon[];
        };
        Insert: {
          id?: string;
          order_id: string;
          dish_id: string;
          dish_name: string;
          dish_base_price: number;
          total_price: number;
          addons?: TicketItemAddon[];
        };
        Update: {
          id?: string;
          order_id?: string;
          dish_id?: string;
          dish_name?: string;
          dish_base_price?: number;
          total_price?: number;
          addons?: TicketItemAddon[];
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          phone: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          role: 'admin' | 'operator' | 'kitchen';
        };
        Insert: {
          id: string;
          name: string;
          role?: 'admin' | 'operator' | 'kitchen';
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'admin' | 'operator' | 'kitchen';
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      reserve_tickets: {
        Args: { p_dish_id: string; p_count: number };
        Returns: boolean;
      };
      adjust_tickets: {
        Args: { p_dish_id: string; p_delta: number };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
