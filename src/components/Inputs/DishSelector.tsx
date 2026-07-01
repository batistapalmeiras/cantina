// Libs
import { Minus, Plus } from 'lucide-react';
import styled from 'styled-components';
// Components
import { Dish } from '../../types';
import { DishQuantity } from '../../types/Inputs';

interface Props {
  dishes: Dish[];
  quantities: Record<string, DishQuantity>;
  onIncrement: (dish: Dish) => void;
  onDecrement: (dishId: string) => void;
  onSetAddonCount: (dishId: string, addonId: string, count: number) => void;
}

const DishCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const DishHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.base};
`;

const DishInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DishName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

const DishMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StepBtn = styled.button<{ $disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.rounded.full};
  border: 1px solid ${({ theme, $disabled }) => ($disabled ? theme.colors.hairline : theme.colors.borderStrong)};
  background: ${({ theme }) => theme.colors.canvas};
  color: ${({ theme, $disabled }) => ($disabled ? theme.colors.hairline : theme.colors.ink)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: box-shadow 0.15s, border-color 0.15s;
  flex-shrink: 0;

  &:hover:not([disabled]) {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const StepCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  min-width: 20px;
  text-align: center;
`;

const TicketList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const TicketRow = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  background: ${({ theme }) => theme.colors.surfaceSoft};
`;

const TicketLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TicketQuestion = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SoldOut = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
`;

export function DishSelector({ dishes, quantities, onIncrement, onDecrement, onSetAddonCount }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {dishes.map((dish) => {
        const q = quantities[dish.id] ?? { count: 0, addonCounts: {} };
        const maxAvailable = dish.totalTickets - dish.soldTickets;
        const remaining = maxAvailable - q.count;
        const soldOut = maxAvailable <= 0;

        return (
          <DishCard key={dish.id}>
            <DishHeader>
              <DishInfo>
                <DishName>{dish.name}</DishName>
                <DishMeta>
                  R$ {dish.price.toFixed(2)} · {remaining} disponíve{remaining === 1 ? 'l' : 'is'}
                </DishMeta>
              </DishInfo>
              {soldOut ? (
                <SoldOut>Esgotado</SoldOut>
              ) : (
                <Stepper>
                  <StepBtn
                    type="button"
                    $disabled={q.count === 0}
                    disabled={q.count === 0}
                    onClick={() => onDecrement(dish.id)}
                  >
                    <Minus size={14} />
                  </StepBtn>
                  <StepCount>{q.count}</StepCount>
                  <StepBtn
                    type="button"
                    $disabled={q.count >= maxAvailable}
                    disabled={q.count >= maxAvailable}
                    onClick={() => onIncrement(dish)}
                  >
                    <Plus size={14} />
                  </StepBtn>
                </Stepper>
              )}
            </DishHeader>

            {q.count > 0 && dish.availableAddons.length > 0 && (
              <TicketList>
                {dish.availableAddons.map((addon) => {
                  const addonCount = q.addonCounts[addon.id] ?? 0;
                  return (
                    <TicketRow key={addon.id}>
                      <TicketQuestion>Quantos itens você quer com:</TicketQuestion>
                      <TicketLabel>{addon.name}{addon.price > 0 ? ` · +R$ ${addon.price.toFixed(2)}` : ''}</TicketLabel>
                      <Stepper>
                        <StepBtn
                          type="button"
                          $disabled={addonCount === 0}
                          disabled={addonCount === 0}
                          onClick={() => onSetAddonCount(dish.id, addon.id, addonCount - 1)}
                        >
                          <Minus size={12} />
                        </StepBtn>
                        <StepCount style={{ fontSize: 14 }}>{addonCount}</StepCount>
                        <StepBtn
                          type="button"
                          $disabled={addonCount >= q.count}
                          disabled={addonCount >= q.count}
                          onClick={() => onSetAddonCount(dish.id, addon.id, addonCount + 1)}
                        >
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
