export const mockState = {
  get: jest.fn().mockImplementation(key => {
    if (key === 'board') {
      return [
        [4, 8],
        [2, 16],
        [4, 32],
      ];
    }
    return undefined;
  }),
  set: jest.fn(),
  subscribe: jest.fn(),
  has: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
};

export const State = {
  getInstance: jest.fn(() => mockState),
};
