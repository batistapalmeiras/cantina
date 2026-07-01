// React
import { Control, Controller, ControllerRenderProps,FieldPath, FieldValues } from 'react-hook-form';
// Libs
import styled from 'styled-components';
// Components
import { IBaseInputProps } from '../../types/Inputs';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.caption.lineHeight};
  color: ${({ theme }) => theme.colors.muted};
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.primaryErrorText};
`;

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

export const InputField = styled.input`
  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedSoft};
  }

  &:hover:not(:focus):not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    border-width: 2px;
    padding: 0 calc(${({ theme }) => theme.spacing.md} - 1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme }) => theme.colors.mutedSoft};
    cursor: not-allowed;
  }
`;
