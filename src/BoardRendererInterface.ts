import type { IBoard } from "./BoardInterface";

export interface IBoardRenderer {
  updateTile(row: number, col: number, value: number): void;
  reset(): void;
  get boardEl(): HTMLDivElement;
}
export interface IBoardRendererConstructor {
  new (board: IBoard, boardEl: HTMLDivElement): IBoardRenderer;
}