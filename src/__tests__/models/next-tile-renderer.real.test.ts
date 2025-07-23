import { NextTileRenderer } from '../../models/next-tile-renderer';
import { State } from '../../state';

let nextTileElement: HTMLDivElement;

describe('NextTileRenderer (integration tests with real State)', () => {
  let warnMock: jest.SpyInstance;

  beforeAll(() => {
    const mockBoard = [
      [2, 4],
      [8, 16],
    ];
    const state = State.getInstance();
    state.set('board', mockBoard);

    warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    nextTileElement = document.createElement('div');
    nextTileElement.id = 'next-tile';
    document.body.appendChild(nextTileElement);
  });

  afterEach(() => {
    document.body.removeChild(nextTileElement);
  });

  afterAll(() => {
    State.getInstance().clear();
    warnMock.mockRestore();
  });

  test('should update next tile display when board changes', () => {
    const state = State.getInstance();
    state.set('board', [
      [2, 8],
      [8, 16],
    ]);

    const spyUpdateNextTileDisplay = jest.spyOn(
      NextTileRenderer.prototype as any,
      'updateNextTileDisplay'
    );
    new NextTileRenderer();
    expect(spyUpdateNextTileDisplay).toHaveBeenCalledTimes(1);

    state.set('board', [
      [2, 4],
      [8, 16],
    ]);

    expect(spyUpdateNextTileDisplay).toHaveBeenCalledTimes(2);
  });

  test('should initialize next tile with value from state', () => {
    const state = State.getInstance();
    state.set('nextTile', 4);

    let nextTileRenderer = new NextTileRenderer();
    expect(nextTileRenderer['nextTileEl'].textContent).toBe('4');

    state.set('nextTile', 128);
    nextTileRenderer = new NextTileRenderer();
    expect(nextTileRenderer['nextTileEl'].textContent).toBe('128');
  });

  test('should reset next tile to 0 if invalid value in state', () => {
    const state = State.getInstance();
    state.set('nextTile', 3);

    const nextTileRenderer = new NextTileRenderer();
    const newTileValue = nextTileRenderer['nextTileEl'].textContent;
    expect(Math.log2(parseInt(newTileValue!)) % 1).toBe(0);
  });
});
