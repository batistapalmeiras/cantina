// Local
import { Btn, Label, Toggle, Wrap } from './styles';
import { SegmentedControlProps } from './types';

export function SegmentedControl<T extends string | number | boolean>({
  value,
  onChange,
  options,
  label,
  tone = 'ink'
}: SegmentedControlProps<T>) {
  return (
    <Wrap>
      {label && <Label>{label}</Label>}
      <Toggle role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <Btn
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            $selected={option.value === value}
            $tone={tone}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Btn>
        ))}
      </Toggle>
    </Wrap>
  );
}
