import { Board } from '../../models/board';
import { State } from '../../state';

describe('Board', () => {
  beforeEach(() => {
    // Reset state to make sure tests are isolated
    const state = State.getInstance();
    state.clear();
  });

  test('should initialize with an empty board', () => {
    const board = new Board(4, 4);
    expect(board.tiles).toHaveLength(4);
    expect(board.tiles[0]).toHaveLength(4);
    expect(board.tiles.flat().every(tile => tile.value === 0)).toBe(true);
  });

  test('should reset the board', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);
    expect(board.tiles.flat().every(tile => tile.value === 0)).toBe(false);

    board.reset();
    expect(board.tiles.flat().every(tile => tile.value === 0)).toBe(true);
  });

  test('should add a tile at the specified coordinates', () => {
    const board = new Board(4, 4);
    const actions = board.addTile({ row: 0, col: 0 }, 2);
    expect(board.tiles[0][0].value).toBe(2);
    expect(actions.length).toBeGreaterThan(0);
  });

  test('should throw error for out of bounds coordinates', () => {
    const board = new Board(4, 4);
    expect(() => board.addTile({ row: -1, col: 0 }, 2)).toThrow(
      'Index out of bounds'
    );
    expect(() => board.addTile({ row: 4, col: 0 }, 2)).toThrow(
      'Index out of bounds'
    );
    expect(() => board.addTile({ row: 0, col: -1 }, 2)).toThrow(
      'Index out of bounds'
    );
    expect(() => board.addTile({ row: 0, col: 4 }, 2)).toThrow(
      'Index out of bounds'
    );
  });

  test('should throw error for negative tile value', () => {
    const board = new Board(4, 4);
    expect(() => board.addTile({ row: 0, col: 0 }, -2)).toThrow(
      'Value cannot be negative'
    );
  });

  test('should add new tile below the last filled tile in a column', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);
    board.addTile({ row: 3, col: 0 }, 4);

    // Tile on 1,0 and 2,0 is empty - should add new tile on 1,0
    expect(board.tiles[0][0].value).toBe(2);
    expect(board.tiles[1][0].value).toBe(4);
    expect(board.tiles[2][0].value).toBe(0);
    expect(board.tiles[3][0].value).toBe(0);
  });

  test('should merge tiles with the same value if new tile is added to the bottom', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);
    board.addTile({ row: 1, col: 0 }, 2);

    expect(board.tiles[0][0].value).toBe(4);
    expect(board.tiles[1][0].value).toBe(0);
  });

  test('should merge tiles with the same value if new tile is added on the left side', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);
    board.addTile({ row: 0, col: 1 }, 2);

    expect(board.tiles[0][0].value).toBe(4);
    expect(board.tiles[0][1].value).toBe(0);
  });

  test('should merge tiles with the same value if new tile is added on the right side', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 1 }, 2);
    board.addTile({ row: 0, col: 2 }, 2);

    expect(board.tiles[0][1].value).toBe(4);
    expect(board.tiles[0][2].value).toBe(0);
  });

  test('should merge tiles recursively when multiple merges are possible', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 4);
    board.addTile({ row: 0, col: 1 }, 2);
    board.addTile({ row: 0, col: 2 }, 2);

    expect(board.tiles[0][0].value).toBe(8);
    expect(board.tiles[0][1].value).toBe(0);
    expect(board.tiles[0][2].value).toBe(0);
  });

  test('should not merge tiles with different values', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);
    board.addTile({ row: 1, col: 0 }, 4);

    expect(board.tiles[0][0].value).toBe(2);
    expect(board.tiles[1][0].value).toBe(4);
  });

  test('should recreate the board from the state', () => {
    const state = State.getInstance();
    state.set('board', [
      [2, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 2],
    ]);
    const board = new Board(4, 4);

    expect(board.tiles[0][0].value).toBe(2);
    expect(board.tiles[1][1].value).toBe(2);
    expect(board.tiles[2][2].value).toBe(2);
    expect(board.tiles[3][3].value).toBe(2);
  });

  test('should update the state after adding a tile', () => {
    const board = new Board(4, 4);
    board.addTile({ row: 0, col: 0 }, 2);

    const state = State.getInstance();
    expect(state.get('board')).toEqual([
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  test('should update the state after merging tiles', () => {
    const board = new Board(4, 4);
    const state = State.getInstance();

    board.addTile({ row: 0, col: 0 }, 2);
    expect(state.get('board')).toEqual([
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    board.addTile({ row: 0, col: 1 }, 2);
    expect(state.get('board')).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});
