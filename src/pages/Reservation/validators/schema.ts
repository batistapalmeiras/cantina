import { z } from 'zod';

export const reservationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
