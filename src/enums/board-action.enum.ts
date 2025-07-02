export const action = {
  Add: "add",
  Move: "move",
  Merge: "merge",
} as const;

export type action = (typeof action)[keyof typeof action];