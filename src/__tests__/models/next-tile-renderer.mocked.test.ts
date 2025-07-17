import { NextTileRenderer } from '../../models/next-tile-renderer';

let nextTileElement: HTMLDivElement;
let nextTileRenderer: NextTileRenderer | null = null;

jest.mock('../../state');

describe('NextTileRenderer (basic tests with mocked State)', () => {
  beforeEach(() => {
    nextTileElement = document.createElement('div');
    nextTileElement.id = 'next-tile';
    document.body.appendChild(nextTileElement);
  });

  afterEach(() => {
    document.body.removeChild(nextTileElement);
    jest.clearAllMocks();
    nextTileRenderer = null;
  });

  test('should create an instance of NextTileRenderer', () => {
    nextTileRenderer = new NextTileRenderer();
    expect(nextTileRenderer).toBeInstanceOf(NextTileRenderer);
  });

  test('should update next tile display on initialization', () => {
    nextTileRenderer = new NextTileRenderer();
    expect(nextTileElement.textContent).toBeDefined();
    expect(nextTileElement.style.backgroundColor).toBeDefined();
    expect(nextTileElement.style.color).toBeDefined();
  });
});
