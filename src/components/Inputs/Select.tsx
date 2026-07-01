import React from 'react';
import styled from 'styled-components';
import { FieldPath, FieldValues } from 'react-hook-form';
import { SelectProps } from '../../types/Inputs';
import { ControlledBase, BaseInput } from './BaseInput';

const SelectField = styled.select`
  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  outline: none;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23222222' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  padding-right: ${({ theme }) => theme.spacing.xl};

  &:focus {
    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.ink};
  }
`;

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
