export interface ReportStats {
  totalTickets: number;
  revenue: number;
  confirmedOrders: number;
  pendingReservations: number;
}

export interface DishMapEntry {
  name: string;
  sold: number;
  total: number;
}
