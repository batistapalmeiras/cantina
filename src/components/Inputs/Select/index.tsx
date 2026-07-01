// React
import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
// Components
import { BaseInput, ControlledBase } from '../BaseInput';
// Local
import { SelectField } from './styles';

interface SelectProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
}

interface RawSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
}

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
  return (
    <ControlledBase label={label} control={control} name={name} wrapperStyle={wrapperStyle}>
      {(field) => (
        <SelectField
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          ref={field.ref as React.Ref<HTMLSelectElement>}
        >
          {children}
        </SelectField>
      )}
    </ControlledBase>
  );
}
