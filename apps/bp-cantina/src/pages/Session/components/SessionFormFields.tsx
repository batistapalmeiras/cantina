// React
import { Control, Controller, useFieldArray } from 'react-hook-form';
// Libs
import { Button, Select, TextInput } from 'bp-ui';
// Components
import { MINISTRIES } from '../../../data';
import { newId } from '../domain';
import {
  AddonRow,
  AddonSectionLabel,
  DishCard,
  DishCardHeader,
  DishesSection,
  FormContainer,
  Row,
  SmallInput,
} from '../styles';
import { SessionFormValues } from '../validators';

interface SessionFormFieldsProps {
  control: Control<SessionFormValues>;
}


export function SessionFormFields({ control }: SessionFormFieldsProps) {
  const { fields: dishes, remove: removeDish } = useFieldArray({ control, name: 'dishes' });

  return (
    <FormContainer>
      <Select label="Ministério" control={control} name="ministry">
        <option value="" disabled>Selecione o Ministério</option>
        {MINISTRIES.map((m) => <option key={m}>{m}</option>)}
      </Select>

      <DishesSection>
        {dishes.map((_, idx) => (
          <DishFields
            key={idx}
            control={control}
            dishIndex={idx}
            canRemove={dishes.length > 1}
            onRemove={() => removeDish(idx)}
          />
        ))}
      </DishesSection>
    </FormContainer>
  );
}

interface DishFieldsProps {
  control: Control<SessionFormValues>;
  dishIndex: number;
  canRemove: boolean;
  onRemove: () => void;
}

function DishFields({ control, dishIndex, canRemove, onRemove }: DishFieldsProps) {
  const { fields: addons, append: appendAddon, remove: removeAddon } = useFieldArray({
    control,
    name: `dishes.${dishIndex}.availableAddons`,
  });

  return (
    <DishCard>
      <DishCardHeader>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextInput
            label="Nome do Prato"
            control={control}
            name={`dishes.${dishIndex}.name` as const}
            placeholder="ex: Frango com arroz e feijão"
          />
          <Row>
            <TextInput
              currency
              label="Preço (R$)"
              control={control}
              name={`dishes.${dishIndex}.price` as const}
              wrapperStyle={{ flex: 1 }}
            />
            <TextInput
              label="Fichinhas"
              type="number"
              min={1}
              control={control}
              name={`dishes.${dishIndex}.totalTickets` as const}
              wrapperStyle={{ flex: 1 }}
            />
          </Row>
        </div>
        {canRemove && (
          <Button variant="danger" size="sm" onClick={onRemove}>Remover</Button>
        )}
      </DishCardHeader>

      <AddonSectionLabel>Acréscimos disponíveis</AddonSectionLabel>
      {addons.map((addon, addonIdx) => (
        <AddonRow key={addon.id}>
          <Controller
            control={control}
            name={`dishes.${dishIndex}.availableAddons.${addonIdx}.name`}
            render={({ field }) => (
              <SmallInput placeholder="Nome do acréscimo" {...field} />
            )}
          />
          <Button variant="danger" size="sm" onClick={() => removeAddon(addonIdx)}>✕</Button>
        </AddonRow>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => appendAddon({ id: newId(), name: '', price: 0 })}
        style={{ marginTop: 6 }}
      >
        + Acréscimo
      </Button>
    </DishCard>
  );
}
