// Components
import { PaymentMethod } from '../types';

/**
 * Flat R$0,05 added to Pix payments (NOT a 5% rate) — a cent marker that
 * identifies the payment as the cafeteria's in the accounting.
 */
export const PIX_SURCHARGE = 0.05;

export function calculateTotalWithPixSurcharge(total: number, paymentMethod: PaymentMethod): number {
  if (paymentMethod === PaymentMethod.Pix) {
    return total + PIX_SURCHARGE;
  }
  return total;
}
