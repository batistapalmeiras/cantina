import { PaymentMethod } from '../types';

const PIX_SURCHARGE = 0.05;

export function calculateTotalWithPixSurcharge(total: number, paymentMethod: PaymentMethod): number {
  if (paymentMethod === PaymentMethod.Pix) {
    return total + PIX_SURCHARGE;
  }
  return total;
}
