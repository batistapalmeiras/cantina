// Libs
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3, 'Informe pelo menos nome e sobrenome'),
  email: z.string().email('E-mail inválido'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
