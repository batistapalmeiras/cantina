export interface SegmentedControlOption<T extends string | number | boolean> {
  value: T;
  label: string;
}

export type SegmentedControlTone = 'ink' | 'primary';

export interface SegmentedControlProps<T extends string | number | boolean> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  label?: string;
  tone?: SegmentedControlTone;
}
