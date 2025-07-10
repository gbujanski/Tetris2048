import type { ITile } from '../interfaces/tile.interface';

export class Tile implements ITile {
  private _value: number;
  private tileData: { bgColor: string, textColor: string, displayValue: string };

  constructor(value: number = 0) {
    this._value = value;
    this.tileData = this.getTileData(value);
  }

  public get bgColor(): string {
    return this.tileData.bgColor;
  }

  public get textColor(): string {
    return this.tileData.textColor;
  }

  public get displayValue(): string {
    return this.tileData.displayValue;
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public toJson(): { value: number } {
    return {
      value: this.value
    };
  }

  public static fromJson(json: { value: number }): Tile {
    return new Tile(json.value);
  }

  private getTileData(value: number): { bgColor: string, textColor: string, displayValue: string } {
    if (value === 0) return { bgColor: '#030303', textColor: '#000', displayValue: '' };
    if (value < 4) return { bgColor: '#776e65', textColor: '#000', displayValue: '2' };
    if (value < 8) return { bgColor: '#eee4da', textColor: '#000', displayValue: '4' };
    if (value < 16) return { bgColor: '#ede0c8', textColor: '#000', displayValue: '8' };
    if (value < 32) return { bgColor: '#f2b179', textColor: '#000', displayValue: '16' };
    if (value < 64) return { bgColor: '#f59563', textColor: '#000', displayValue: '32' };
    if (value < 128) return { bgColor: '#f67c5f', textColor: '#000', displayValue: '64' };
    if (value < 256) return { bgColor: '#f65e3b', textColor: '#000', displayValue: '128' };
    if (value < 512) return { bgColor: '#edcf72', textColor: '#000', displayValue: '256' };
    if (value < 1024) return { bgColor: '#edcc61', textColor: '#000', displayValue: '512' };
    if (value < 2048) return { bgColor: '#edc850', textColor: '#000', displayValue: '1024' };
    if (value < 4096) return { bgColor: '#e8b026', textColor: '#000', displayValue: '2048' };
    if (value < 8192) return { bgColor: '#a86ae4', textColor: '#000', displayValue: '4096' };
    if (value < 16384) return { bgColor: '#6b4fc4', textColor: '#ffffff', displayValue: '8192' };
    if (value < 32768) return { bgColor: '#3c3a32', textColor: '#ffffff', displayValue: '16k' };
    if (value < 65536) return { bgColor: '#2b2b2b', textColor: '#ffffff', displayValue: '32k' };
    if (value < 131072) return { bgColor: '#1e1b2e', textColor: '#ffffff', displayValue: '64k' };
    if (value < 262144) return { bgColor: '#291b1b', textColor: '#ffffff', displayValue: '128k' };
    if (value < 524288) return { bgColor: '#1e2d1e', textColor: '#ffffff', displayValue: '256k' };
    if (value < 1048576) return { bgColor: '#2e1e2d', textColor: '#ffffff', displayValue: '512k' };
    if (value < 2097152) return { bgColor: '#1c1c2e', textColor: '#ffffff', displayValue: '1M' };
    if (value < 4194304) return { bgColor: '#2e2c1c', textColor: '#ffffff', displayValue: '2M' };
    if (value < 8388608) return { bgColor: '#1f1f1f', textColor: '#ffffff', displayValue: '4M' };
    if (value < 16777216) return { bgColor: '#181818', textColor: '#ffffff', displayValue: '8M' };
    if (value < 33554432) return { bgColor: '#141414', textColor: '#ffffff', displayValue: '16M' };
    if (value < 67108864) return { bgColor: '#101010', textColor: '#ffffff', displayValue: '32M' };
    if (value < 134217728) return { bgColor: '#0d0d0d', textColor: '#ffffff', displayValue: '64M' };
    if (value < 268435456) return { bgColor: '#0a0a0a', textColor: '#ffffff', displayValue: '128M' };
    if (value < 536870912) return { bgColor: '#070707', textColor: '#ffffff', displayValue: '256M' };
    if (value < 1073741824) return { bgColor: '#050505', textColor: '#ffffff', displayValue: '512M' };
    return { bgColor: '#030303', textColor: '#ffffff', displayValue: '' };
  }
}
