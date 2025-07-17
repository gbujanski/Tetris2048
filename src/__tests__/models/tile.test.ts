import { Tile } from '../../models/tile';

describe('Tile', () => {
  test('should create a tile', () => {
    const tile = new Tile(0);
    expect(tile.value).toBe(0);
    expect(tile.bgColor).not.toBeUndefined();
    expect(tile.textColor).not.toBeUndefined();
  });

  test('should create a tile with a specific value', () => {
    const tile = new Tile(4);
    expect(tile.value).toBe(4);
    expect(tile.bgColor).not.toBeUndefined();
    expect(tile.textColor).not.toBeUndefined();
    expect(tile.displayValue).toBe('4');
  });

  test('should update tile value', () => {
    const tile = new Tile(2);
    const initialValue = tile.value;
    const initialBgColor = tile.bgColor;
    const initialTextColor = tile.textColor;
    const initialDisplayValue = tile.displayValue;

    expect(initialValue).toBe(2);
    expect(initialBgColor).toBe('#776e65');
    expect(initialTextColor).toBe('#000');
    expect(initialDisplayValue).toBe('2');

    tile.value = 2097152;

    expect(tile.value).toBe(2097152);
    expect(tile.bgColor).not.toBe(initialBgColor);
    expect(tile.textColor).not.toBe(initialTextColor);
    expect(tile.displayValue).not.toBe(initialDisplayValue);
    expect(tile.displayValue).toBe('2M');
  });
});
