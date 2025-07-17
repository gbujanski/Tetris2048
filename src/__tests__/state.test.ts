import { State } from '../state';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('State', () => {
  let stateInstance: State;

  beforeEach(() => {
    // Reset singleton
    // @ts-expect-error - Access private property for testing
    State._instance = undefined;

    stateInstance = State.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('`getInstance` returns the same instance', () => {
    const instance1 = State.getInstance();
    const instance2 = State.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('`set` adds a value to the state and `get` retrieves a value from the state', () => {
    expect(stateInstance.get('testKey')).toBeUndefined();
    stateInstance.set('testKey', 'testValue');
    expect(stateInstance.get('testKey')).toBe('testValue');
  });

  test('`has` returns true when key exists', () => {
    expect(stateInstance.get('testKey')).toBeUndefined();
    stateInstance.set('testKey', 'testValue');
    expect(stateInstance.has('testKey')).toBe(true);
  });

  test('`has` returns false when key does not exist', () => {
    expect(stateInstance.get('nonExistentKey')).toBeUndefined();
    expect(stateInstance.has('nonExistentKey')).toBe(false);
  });

  test('`delete` removes a key from the state', () => {
    stateInstance.set('testKey', 'testValue');
    expect(stateInstance.has('testKey')).toBe(true);

    stateInstance.delete('testKey');
    expect(stateInstance.has('testKey')).toBe(false);
  });

  test('`clear` removes all keys from the state', () => {
    stateInstance.set('key1', 'value1');
    stateInstance.set('key2', 'value2');

    expect(stateInstance.has('key1')).toBe(true);
    expect(stateInstance.has('key2')).toBe(true);

    stateInstance.clear();

    expect(stateInstance.has('key1')).toBe(false);
    expect(stateInstance.has('key2')).toBe(false);
  });

  test('`subscribe` registers a callback that is called when value changes', () => {
    const mockCallback = jest.fn();
    stateInstance.subscribe('testKey', mockCallback);

    stateInstance.set('testKey', 'testValue');
    expect(mockCallback).toHaveBeenCalledWith('testValue', undefined);

    stateInstance.set('testKey', 'testValue2');
    expect(mockCallback).toHaveBeenCalledWith('testValue2', 'testValue');
  });

  test('unsubscribe removes the callback', () => {
    const mockCallback = jest.fn();
    const unsubscribe = stateInstance.subscribe('testKey', mockCallback);

    stateInstance.set('testKey', 'testValue');
    expect(mockCallback).toHaveBeenCalledWith('testValue', undefined);

    unsubscribe();
    mockCallback.mockClear();

    stateInstance.set('testKey', 'testValue2');
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('`delete` saves state to localStorage', () => {
    stateInstance.set('testKey', 'testValue');
    stateInstance.delete('testKey');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'appState',
      JSON.stringify([])
    );
  });

  test('`clear` removes state from localStorage', () => {
    stateInstance.set('testKey', 'testValue');
    stateInstance.clear();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('appState');
  });

  test('should restore state from localStorage on instance creation', () => {
    const savedState = JSON.stringify([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    localStorageMock.getItem.mockReturnValue(savedState);
    // Reset singleton
    // @ts-expect-error - Access private property for testing
    State._instance = undefined;
    const newStateInstance = State.getInstance();

    expect(newStateInstance.get('key1')).toBe('value1');
    expect(newStateInstance.get('key2')).toBe('value2');
  });
});
