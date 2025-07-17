export interface ITile {
  get value(): number;
  set value(value: number);
  get bgColor(): string;
  get textColor(): string;
  get displayValue(): string;
  toJson(): { value: number };
}
