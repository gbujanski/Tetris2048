import { NextTileRenderer } from '../../models/next-tile-renderer';
import { State } from '../../state';

let nextTileElement: HTMLDivElement;

describe('NextTileRenderer (integration tests with real State)', () => {
  beforeAll(() => {
    const mockBoard = [
      [2, 4],
      [8, 16],
    ];
    const state = State.getInstance();
    state.set('board', mockBoard);
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
});
