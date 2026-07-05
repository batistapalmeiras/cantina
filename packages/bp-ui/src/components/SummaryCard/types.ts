export interface SummaryItem {
  name: string;
  qty: number;
  subtotal?: number;
}

export interface SummaryCardButton {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export interface SummaryCardProps {
  label?: string;
  items: SummaryItem[];
  total: number;
  onConfirm?: () => void;
  confirmText?: string;
  loading?: boolean;
  disabled?: boolean;
  buttons?: SummaryCardButton[];
  emptyMessage?: string;
}
