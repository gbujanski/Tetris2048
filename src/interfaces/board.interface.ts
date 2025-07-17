import type { ITile } from '../interfaces/tile.interface';
import type { IboardActions } from '../interfaces/board-actions.interface';
import type { ICoords } from './cords.interface';

export interface IBoard {
  get tiles(): ITile[][];
  addTile(cords: ICoords, value: number): IboardActions[];
  reset(): void;
}
