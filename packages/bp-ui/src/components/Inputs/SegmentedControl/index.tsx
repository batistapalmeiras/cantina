// Local
import { Btn, Label, SegmentedControlTone, Toggle, Wrap } from './styles';

export type { SegmentedControlTone } from './styles';

export interface SegmentedControlOption<T extends string | number | boolean> {
  value: T;
  label: string;
}

interface Props<T extends string | number | boolean> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  label?: string;
  tone?: SegmentedControlTone;
}

export function SegmentedControl<T extends string | number | boolean>({ value, onChange, options, label, tone = 'ink' }: Props<T>) {
  return (
    <Wrap>
      {label && <Label>{label}</Label>}
      <Toggle>
        {options.map((option) => (
          <Btn
            key={String(option.value)}
            type="button"
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
