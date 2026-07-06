// Libs
import { Addon } from 'bp-core';
import { Minus, Plus } from 'lucide-react';
// Components
import { formatCurrency } from '../../../utils/mask';
// Local
import {
  DishCard,
  DishHeader,
  DishInfo,
  DishMeta,
  DishName,
  SoldOut,
  SelectorLabel,
  StepBtn,
  StepCount,
  Stepper,
  TicketLabel,
  TicketList,
  TicketQuestion,
  TicketRow,
} from './styles';
import { DishSelectorProps } from './types';

export function DishSelector({ dishes, quantities, onIncrement, onDecrement, onSetAddonCount, label, reserved }: DishSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <SelectorLabel>{label}</SelectorLabel>
      {dishes.map((dish) => {
        const q = quantities[dish.id] ?? { count: 0, addonCounts: {} };
        const globalAvailable = dish.totalTickets - dish.soldTickets;
        const maxAvailable = globalAvailable + (reserved?.[dish.id] ?? 0);
        const remaining = maxAvailable - q.count;
        const soldOut = maxAvailable <= 0 && q.count === 0;

        return (
          <DishCard key={dish.id}>
            <DishHeader>
              <DishInfo>
                <DishName>{dish.name}</DishName>
                <DishMeta>
                  {formatCurrency(dish.price)} · {remaining} disponíve{remaining === 1 ? 'l' : 'is'}
                </DishMeta>
              </DishInfo>
              {soldOut ? (
                <SoldOut>Esgotado</SoldOut>
              ) : (
                <Stepper>
                  <StepBtn type="button" $disabled={q.count === 0} disabled={q.count === 0} onClick={() => onDecrement(dish.id)}>
                    <Minus size={14} />
                  </StepBtn>
                  <StepCount>{q.count}</StepCount>
                  <StepBtn type="button" $disabled={q.count >= maxAvailable} disabled={q.count >= maxAvailable} onClick={() => onIncrement(dish)}>
                    <Plus size={14} />
                  </StepBtn>
                </Stepper>
              )}
            </DishHeader>

            {q.count > 0 && dish.availableAddons.length > 0 && (
              <TicketList>
                {dish.availableAddons.map((addon: Addon) => {
                  const addonCount = q.addonCounts[addon.id] ?? 0;
                  return (
                    <TicketRow key={addon.id}>
                      <TicketQuestion>Quantos itens você quer com:</TicketQuestion>
                      <TicketLabel>
                        {addon.name}
                        {addon.price > 0 ? ` · +${formatCurrency(addon.price)}` : ''}
                      </TicketLabel>
                      <Stepper>
                        <StepBtn type="button" $disabled={addonCount === 0} disabled={addonCount === 0} onClick={() => onSetAddonCount(dish.id, addon.id, addonCount - 1)}>
                          <Minus size={12} />
                        </StepBtn>
                        <StepCount style={{ fontSize: 14 }}>{addonCount}</StepCount>
                        <StepBtn type="button" $disabled={addonCount >= q.count} disabled={addonCount >= q.count} onClick={() => onSetAddonCount(dish.id, addon.id, addonCount + 1)}>
                          <Plus size={12} />
                        </StepBtn>
                      </Stepper>
                    </TicketRow>
                  );
                })}
              </TicketList>
            )}
          </DishCard>
        );
      })}
    </div>
  );
}
