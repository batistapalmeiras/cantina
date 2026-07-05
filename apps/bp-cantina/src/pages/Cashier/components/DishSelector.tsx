// React
import { Control, UseFormSetValue } from 'react-hook-form';
// Libs
import { Dish } from 'bp-core';
import { DishQuantity, DishSelector } from 'bp-ui';
// Components
import { CashierFormValues } from '../validators';
// Local
import { ClientSearch } from './ClientSearch';

interface Props {
  control: Control<CashierFormValues>;
  setValue: UseFormSetValue<CashierFormValues>;
  dishes: Dish[];
  quantities: Record<string, DishQuantity>;
  onIncrement: (dish: Dish) => void;
  onDecrement: (dishId: string) => void;
  onSetAddonCount: (dishId: string, addonId: string, count: number) => void;
}

export function CashierDishSelector({ control, setValue, dishes, quantities, onIncrement, onDecrement, onSetAddonCount }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <ClientSearch control={control} setValue={setValue} />
      </div>

      <DishSelector
        label="Fichinhas"
        dishes={dishes}
        quantities={quantities}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onSetAddonCount={onSetAddonCount}
      />
    </div>
  );
}
