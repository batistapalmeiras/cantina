// React
import { Controller, FieldPath, FieldValues } from 'react-hook-form';
// Local
import { ErrorText, Label, Wrapper } from './styles';
import { ControlledBaseProps, IBaseInputProps } from './types';

export { InputField } from './styles';
export type { IBaseInputProps } from './types';

export function BaseInput({ label, wrapperStyle, error, children }: IBaseInputProps) {
  return (
    <Wrapper style={wrapperStyle}>
      <Label>{label}</Label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
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
