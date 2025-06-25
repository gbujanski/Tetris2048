import type { IBoard } from "./BoardInterface";
import type { ITile } from './TileInterface';
import { Tile } from "./Tile";

export class Board implements IBoard {
  private _tiles: ITile[][];

  constructor(sizeX: number, sizeY: number) {
    this._tiles = Array.from({ length: sizeY }, () => Array(sizeX).fill(new Tile(0)));
  }

  public get tiles(): ITile[][] {
    return this._tiles;
  }

  public get higestTileValue(): number {
    return Math.max(...this._tiles.flat().map(tile => tile.value));
  }

  public reset(): void {
    this._tiles.forEach(row => row.forEach((tile) => tile.value = 0));
  }

  public updateTile(row: number, col: number, value: number): void {
    if (row >= 0 && row < this._tiles.length && col >= 0 && col < this._tiles[row].length) {
      this._tiles[row][col].value = value;
    } else {
      throw new Error("Index out of bounds");
    }
  }
}
