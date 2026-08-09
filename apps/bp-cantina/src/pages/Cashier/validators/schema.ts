// Libs
import { z } from 'zod';
import { text } from 'bp-kit';
// Components
import { PaymentMethod } from 'bp-core';

export const cashierSchema = z.object({
  customerName: z.string().min(1, text.validation.selectRequired('um cliente')),
  customerPhone: z.string().min(1, text.validation.selectRequired('um cliente')),
  clientId: z.string().min(1, text.validation.selectRequired('um cliente')),
  paymentMethod: z.nativeEnum(PaymentMethod),
  stayForMeal: z.boolean(),
});

export type CashierFormValues = z.infer<typeof cashierSchema>;
