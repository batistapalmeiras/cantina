export interface SessionSummary {
  id: string;
  date: string;
  ministry: string;
  isOpen: boolean;
  status: 'open' | 'pending' | 'closed';
}
