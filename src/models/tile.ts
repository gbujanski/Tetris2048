import type { ITile } from '../interfaces/tile.interface';
import { getColor } from '../utils/get-color';

export class Tile implements ITile {
  private _value: number;

  constructor(
    value: number = 0
  ) {
    this._value = value;
  }

  public get color(): string {
    return getColor(this.value);
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }
}
