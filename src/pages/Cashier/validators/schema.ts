// Libs
import { z } from 'zod';
// Components
import { PaymentMethod } from '../../../types';

export const cashierSchema = z.object({
  customerName: z.string().min(1, 'Selecione um cliente'),
  customerPhone: z.string().min(1, 'Selecione um cliente'),
  clientId: z.string().min(1, 'Selecione um cliente'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type CashierFormValues = z.infer<typeof cashierSchema>;
