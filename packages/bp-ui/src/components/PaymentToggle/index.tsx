// Libs
import { PaymentMethod } from 'bp-core';
// Local
import { Btn, Label, Toggle, Wrap } from './styles';

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  label?: string;
}

export function PaymentToggle({ value, onChange, label }: Props) {
  return (
    <Wrap>
      {label && <Label>{label}</Label>}
      <Toggle>
        <Btn type="button" $selected={value === PaymentMethod.Cash} onClick={() => onChange(PaymentMethod.Cash)}>
          Dinheiro
        </Btn>
        <Btn type="button" $selected={value === PaymentMethod.Pix} onClick={() => onChange(PaymentMethod.Pix)}>
          Pix
        </Btn>
      </Toggle>
    </Wrap>
  );
}
