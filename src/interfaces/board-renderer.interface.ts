import type { IboardActions } from "./board-actions.interface";

export interface IBoardRenderer {
  updateBoard(boardActions: IboardActions[]): void;
  reset(): void;
  get boardEl(): HTMLDivElement;
}
