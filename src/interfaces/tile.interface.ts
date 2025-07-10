export interface ITile {
  get color(): { bg: string, text: string };
  get value(): number;
  set value(value: number);
}
 