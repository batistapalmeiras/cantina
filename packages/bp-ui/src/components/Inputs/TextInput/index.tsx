// React
import { useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
// Libs
import { Eye, EyeOff } from 'lucide-react';
// Components
import { maskCurrencyInput, maskPhone, parseCurrency } from '../../../utils/mask';
import { ControlledBase, InputField } from '../BaseInput';
// Local
import { EyeButton, InputWrapper } from './styles';
import { CurrencyFieldProps, TextFieldProps } from './types';

export type { CurrencyFieldProps, TextFieldProps } from './types';

type Props<T extends FieldValues, N extends FieldPath<T>> = TextFieldProps<T, N> | CurrencyFieldProps<T, N>;

export function TextInput<T extends FieldValues, N extends FieldPath<T>>(props: Props<T, N>) {
  const { label, control, name, wrapperStyle, placeholder, currency, mask, ...rest } = props as TextFieldProps<T, N> & {
    currency?: boolean;
  };
  const isPassword = rest.type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ControlledBase label={label} control={control} name={name} wrapperStyle={wrapperStyle}>
      {(field) => (
        <InputWrapper>
          <InputField
            {...rest}
            type={isPassword ? (showPassword ? 'text' : 'password') : rest.type}
            placeholder={placeholder}
            style={isPassword ? { paddingRight: 44 } : undefined}
            value={
              currency
                ? maskCurrencyInput(field.value != null && field.value !== '' ? Number(field.value).toFixed(2) : '')
                : (field.value ?? '')
            }
            onChange={(e) => {
              if (currency) {
                field.onChange(parseCurrency(e.target.value));
              } else if (mask === 'phone') {
                field.onChange(maskPhone(e.target.value));
              } else if (rest.type === 'number') {
                field.onChange(e.target.valueAsNumber);
              } else {
                field.onChange(e.target.value);
              }
            }}
            onBlur={field.onBlur}
            ref={field.ref}
          />
          {isPassword && (
            <EyeButton type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </EyeButton>
          )}
        </InputWrapper>
      )}
    </ControlledBase>
  );
}
