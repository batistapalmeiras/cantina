// Components
import { Dish, TicketItem } from '../types';

// Shape estrutural igual ao `DishQuantity` de `bp-ui` — não importado daqui
// porque `bp-core` não pode depender de `bp-ui` (evita dependência circular).
export interface DishOrderQuantity {
  count: number;
  addonCounts: Record<string, number>;
}

/**
 * Preço total para comprar `quantity` unidades de um prato, considerando as
 * faixas promocionais dinâmicas (`dish.priceTiers`, quantity >= 2).
 * A melhor faixa (maior quantity <= quantity pedida) define um preço por
 * unidade (tier.price / tier.quantity) que se mantém para toda quantidade
 * a partir dali — ex: "2 por R$20" (R$10/un) também vale para 3, 4, 5...,
 * até que uma faixa maior cadastrada assuma.
 */
export function calculateDishPrice(dish: Dish, quantity: number): number {
  if (quantity <= 0) return 0;

  const bestTier = [...dish.priceTiers]
    .sort((a, b) => a.quantity - b.quantity)
    .filter((t) => t.quantity <= quantity)
    .pop();

  if (!bestTier) return quantity * dish.price;

  const tierPriceCents = Math.round(bestTier.price * 100);
  const totalCents = Math.round((tierPriceCents * quantity) / bestTier.quantity);
  return totalCents / 100;
}

/** Indica se, para essa quantidade, alguma faixa promocional do prato está em vigor. */
export function isPromoActive(dish: Dish, quantity: number): boolean {
  return dish.priceTiers.some((t) => t.quantity <= quantity);
}

/** Divide `total` (em reais) em `count` parcelas que somam exatamente `total`, sem perder centavos no arredondamento. */
function splitEvenly(total: number, count: number): number[] {
  if (count <= 0) return [];
  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents - baseCents * count;
  return Array.from({ length: count }, (_, i) => (baseCents + (i < remainder ? 1 : 0)) / 100);
}

/**
 * Expande as quantidades escolhidas por prato em um `TicketItem` por
 * unidade. O preço-base de cada prato é calculado por grupo (todas as
 * unidades daquele prato no pedido, via `calculateDishPrice`) e distribuído
 * entre as unidades; os adicionais de cada unidade continuam somados à
 * parte, por unidade, sem afetar o cálculo da promoção.
 */
export function buildOrderTickets(dishes: Dish[], quantities: Record<string, DishOrderQuantity>): TicketItem[] {
  const tickets: TicketItem[] = [];

  dishes.forEach((dish) => {
    const q = quantities[dish.id] ?? { count: 0, addonCounts: {} };
    if (q.count === 0) return;

    const baseShares = splitEvenly(calculateDishPrice(dish, q.count), q.count);

    for (let i = 0; i < q.count; i++) {
      const addons = dish.availableAddons.filter((a) => (q.addonCounts[a.id] ?? 0) > i);
      const addonTotal = addons.reduce((s, a) => s + (a.price ?? 0), 0);
      tickets.push({
        dishId: dish.id,
        dishName: dish.name,
        dishBasePrice: baseShares[i],
        addons,
        totalPrice: baseShares[i] + addonTotal,
      });
    }
  });

  return tickets;
}

export function computeOrderTotal(tickets: TicketItem[]): number {
  return tickets.reduce((s, t) => s + t.totalPrice, 0);
}
