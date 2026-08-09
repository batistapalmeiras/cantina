// Libs
import { z } from 'zod';

const addonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  price: z.number().min(0),
});

const priceTierSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(2, 'Mínimo 2'),
  price: z.number().min(0),
});

const dishSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  price: z.number().gt(0, 'Preço deve ser maior que zero'),
  totalTickets: z.number().int().min(1, 'Mínimo 1'),
  soldTickets: z.number().int(),
  availableAddons: z.array(addonSchema),
  priceTiers: z.array(priceTierSchema).refine(
    (tiers) => new Set(tiers.map((t) => t.quantity)).size === tiers.length,
    'Quantidades de faixas não podem se repetir'
  ),
});

export const sessionFormSchema = z.object({
  ministry: z.string().min(1, 'Selecione um ministério'),
  dishes: z.array(dishSchema).min(1),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
