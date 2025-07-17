import { Board } from '../../models/board';
import { BoardRenderer } from '../../models/board-renderer';
import { State } from '../../state';

describe('BoardRenderer', () => {
  let boardEl: HTMLDivElement;
  let board: Board;
  const rowsNumber = 4;
  const colsNumber = 4;

  beforeEach(() => {
    boardEl = document.createElement('div');
    boardEl.className = 'board';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create board layout', () => {
    board = new Board(rowsNumber, colsNumber);

    new BoardRenderer(board, boardEl);
    expect(boardEl.children.length).toBe(rowsNumber);

    Array.from(boardEl.children).forEach((row: Element) => {
      expect(row.className).toBe('row');
      expect(row.children.length).toBe(colsNumber);
    });
  });

  test('should create tiles with correct values and styles', () => {
    board = new Board(rowsNumber, colsNumber);

    board.addTile({ row: 0, col: 0 }, 2);
    board.addTile({ row: 1, col: 1 }, 4);
    new BoardRenderer(board, boardEl);

    const firstTile = boardEl.children[0].children[0] as HTMLDivElement;
    expect(firstTile.textContent).toBe('2');
    expect(firstTile.style.backgroundColor).toBe('rgb(119, 110, 101)');
    expect(firstTile.style.color).toBe('rgb(0, 0, 0)');

    // tile 0,0 is empty, should move tile from 1,1 to 0,1
    const secondTile = boardEl.children[0].children[1] as HTMLDivElement;
    expect(secondTile.textContent).toBe('4');
    expect(secondTile.style.backgroundColor).toBe('rgb(238, 228, 218)');
    expect(secondTile.style.color).toBe('rgb(0, 0, 0)');
  });

  test('should update board view after merge', async () => {
    const state = State.getInstance();

    state.set('board', [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    board = new Board(rowsNumber, colsNumber);
    const renderer = new BoardRenderer(board, boardEl);

    const boardActions = board.addTile({ row: 1, col: 1 }, 2);
    renderer.updateBoard(boardActions);
    await jest.runAllTimersAsync();

    expect(boardEl.children[0].children[0].textContent).toBe('4');
    expect(boardEl.children[1].children[0].textContent).toBe('');
    expect(boardEl.children[2].children[0].textContent).toBe('');
    expect(boardEl.children[3].children[0].textContent).toBe('');
  });

  test('should update board view after multiple merge', async () => {
    const state = State.getInstance();

    state.set('board', [
      [16, 8, 0, 0],
      [0, 4, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    board = new Board(rowsNumber, colsNumber);
    const renderer = new BoardRenderer(board, boardEl);

    const boardActions = board.addTile({ row: 3, col: 1 }, 2);
    renderer.updateBoard(boardActions);
    await jest.runAllTimersAsync();

    expect(boardEl.children[0].children[0].textContent).toBe('32');
    expect(boardEl.children[1].children[0].textContent).toBe('');
    expect(boardEl.children[2].children[0].textContent).toBe('');
    expect(boardEl.children[3].children[0].textContent).toBe('');
    expect(boardEl.children[0].children[1].textContent).toBe('');
    expect(boardEl.children[1].children[1].textContent).toBe('');
    expect(boardEl.children[2].children[1].textContent).toBe('');
    expect(boardEl.children[3].children[1].textContent).toBe('');
  });
});
