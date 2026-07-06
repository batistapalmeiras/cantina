// React
import { FieldPath, FieldValues, useController } from 'react-hook-form';
// Components
import { BaseInput } from '../BaseInput';
// Local
import { SelectField } from './styles';
import { RawSelectProps, SelectProps } from './types';

export function RawSelect({ label, wrapperStyle, error, children, ...rest }: RawSelectProps) {
  return (
    <BaseInput label={label} wrapperStyle={wrapperStyle} error={error}>
      <SelectField {...rest}>{children}</SelectField>
    </BaseInput>
  );
}

export function Select<T extends FieldValues, N extends FieldPath<T>>({
  label,
  control,
  name,
  wrapperStyle,
  children,
}: SelectProps<T, N>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput label={label} wrapperStyle={wrapperStyle} error={fieldState.error?.message}>
      <SelectField value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur} ref={field.ref}>
        {children}
      </SelectField>
    </BaseInput>
  );
}
