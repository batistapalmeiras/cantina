import { z } from 'zod';

const addonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  price: z.number().min(0),
});

const dishSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  price: z.number().min(0, 'Preço inválido'),
  totalTickets: z.number().int().min(1, 'Mínimo 1'),
  soldTickets: z.number().int(),
  availableAddons: z.array(addonSchema),
});

export const sessionFormSchema = z.object({
  ministry: z.string().min(1, 'Selecione um ministério'),
  dishes: z.array(dishSchema).min(1),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
