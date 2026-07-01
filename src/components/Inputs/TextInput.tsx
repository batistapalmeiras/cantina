import { InputHTMLAttributes } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TextFieldProps, CurrencyFieldProps } from '../../types/Inputs';
import { maskCurrencyInput, parseCurrency } from '../../utils';
import { ControlledBase, BaseInput, InputField } from './BaseInput';

type Props<T extends FieldValues, N extends FieldPath<T>> =
  | TextFieldProps<T, N>
  | CurrencyFieldProps<T, N>;

export function TextInput<T extends FieldValues, N extends FieldPath<T>>(
  props: Props<T, N>
) {
  const { label, control, name, wrapperStyle, placeholder, currency, ...rest } = props as TextFieldProps<T, N> & { currency?: boolean };

  return (
    <ControlledBase label={label} control={control} name={name} wrapperStyle={wrapperStyle}>
      {(field) => (
        <InputField
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          placeholder={placeholder}
          value={currency ? maskCurrencyInput(field.value != null && field.value !== '' ? Number(field.value).toFixed(2) : '') : (field.value ?? '')}
          onChange={(e) => {
            if (currency) {
              field.onChange(parseCurrency(e.target.value));
            } else if ((rest as InputHTMLAttributes<HTMLInputElement>).type === 'number') {
              field.onChange(e.target.valueAsNumber);
            } else {
              field.onChange(e.target.value);
            }
          }}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      )}
    </ControlledBase>
  );
}

interface RawTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
}

export function RawTextInput({ label, wrapperStyle, error, ...rest }: RawTextInputProps) {
  return (
    <BaseInput label={label} wrapperStyle={wrapperStyle} error={error}>
      <InputField {...rest} />
    </BaseInput>
  );
}
