// React
import { ReactNode } from 'react';
import { Control, Controller, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
// Local
import { ErrorText, Label, Wrapper } from './styles';

export { InputField } from './styles';

export interface IBaseInputProps {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
  children: ReactNode;
}

export function BaseInput({ label, wrapperStyle, error, children }: IBaseInputProps) {
  return (
    <Wrapper style={wrapperStyle}>
      <Label>{label}</Label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}

interface ControlledBaseProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  wrapperStyle?: React.CSSProperties;
  children: (field: ControllerRenderProps<T, N>, error?: string) => React.ReactNode;
}

export function ControlledBase<T extends FieldValues, N extends FieldPath<T>>({
  label,
  control,
  name,
  wrapperStyle,
  children,
}: ControlledBaseProps<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <BaseInput label={label} wrapperStyle={wrapperStyle} error={fieldState.error?.message}>
          {children(field, fieldState.error?.message)}
        </BaseInput>
      )}
    />
  );
}
