export const action = {
  Add: 'add',
  Move: 'move',
  Merge: 'merge',
} as const;

export type ActionType = (typeof action)[keyof typeof action];
