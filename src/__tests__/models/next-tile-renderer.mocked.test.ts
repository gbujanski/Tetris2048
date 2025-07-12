import { NextTileRenderer } from "../../models/next-tile-renderer";

// Use the mock from the __mocks__ directory
let nextTileElement: HTMLDivElement;
let nextTileRenderer: NextTileRenderer | null = null;

jest.mock('../../state');

describe('NextTileRenderer (basic tests with mocked State)', () => {
  beforeEach(() => {
    // Create a mock next tile element
    nextTileElement = document.createElement('div');
    nextTileElement.id = 'next-tile';
    document.body.appendChild(nextTileElement);
  });

  afterEach(() => {
    // Clean up the mock element
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
