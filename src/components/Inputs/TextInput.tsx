import { InputHTMLAttributes, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TextFieldProps, CurrencyFieldProps } from '../../types/Inputs';
import { maskCurrencyInput, parseCurrency } from '../../utils';
import { ControlledBase, BaseInput, InputField } from './BaseInput';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

type Props<T extends FieldValues, N extends FieldPath<T>> =
  | TextFieldProps<T, N>
  | CurrencyFieldProps<T, N>;

export function TextInput<T extends FieldValues, N extends FieldPath<T>>(
  props: Props<T, N>
) {
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
