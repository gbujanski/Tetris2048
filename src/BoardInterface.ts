import type { ITile } from './TileInterface';

export interface IBoard {
  get tiles(): ITile[][];
  get higestTileValue(): number;
  updateTile(row: number, col: number, value: number): void;
  reset(): void;
}
 