// React
import { InputHTMLAttributes, useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
// Libs
import { Eye, EyeOff } from 'lucide-react';
// Components
import { maskCurrencyInput, parseCurrency } from '../../../utils';
import { BaseInput, ControlledBase, InputField } from '../BaseInput';
// Local
import { EyeButton, InputWrapper } from './styles';

interface BaseFieldProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  wrapperStyle?: React.CSSProperties;
  placeholder?: string;
}

export interface CurrencyFieldProps<T extends FieldValues, N extends FieldPath<T>>
  extends BaseFieldProps<T, N> {
  currency: true;
}

export interface TextFieldProps<T extends FieldValues, N extends FieldPath<T>>
  extends BaseFieldProps<T, N>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  currency?: false;
}

type Props<T extends FieldValues, N extends FieldPath<T>> =
  | TextFieldProps<T, N>
  | CurrencyFieldProps<T, N>;

export function TextInput<T extends FieldValues, N extends FieldPath<T>>(props: Props<T, N>) {
  const { label, control, name, wrapperStyle, placeholder, currency, ...rest } = props as TextFieldProps<T, N> & { currency?: boolean };
  const isPassword = (rest as InputHTMLAttributes<HTMLInputElement>).type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ControlledBase label={label} control={control} name={name} wrapperStyle={wrapperStyle}>
      {(field) => (
        <InputWrapper>
          <InputField
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            type={isPassword ? (showPassword ? 'text' : 'password') : (rest as InputHTMLAttributes<HTMLInputElement>).type}
            placeholder={placeholder}
            style={isPassword ? { paddingRight: 44 } : undefined}
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
          {isPassword && (
            <EyeButton type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </EyeButton>
          )}
        </InputWrapper>
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
