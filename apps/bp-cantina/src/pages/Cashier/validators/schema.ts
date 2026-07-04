// Libs
import { z } from 'zod';
// Components
import { PaymentMethod } from 'bp-core';

export const cashierSchema = z.object({
  customerName: z.string().min(1, 'Selecione um cliente'),
  customerPhone: z.string().min(1, 'Selecione um cliente'),
  clientId: z.string().min(1, 'Selecione um cliente'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  stayForMeal: z.boolean(),
});

export type CashierFormValues = z.infer<typeof cashierSchema>;
