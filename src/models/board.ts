import type { IBoard } from "../interfaces/board.interface";
import type { ITile } from '../interfaces/tile.interface';
import type { ICoords } from "../interfaces/cords.interface";
import type { IboardActions } from "../interfaces/board-actions.interface";
import { Tile } from "../models/tile";
import { action } from '../enums/board-action.enum';

export class Board implements IBoard {
  private _tiles: ITile[][];
  private boardActions: IboardActions[] = [];
  private tilesToCheckInNextStep: ICoords[] = [];
  private colsToUpdate: number[] = [];


  constructor(sizeX: number, sizeY: number) {
    this._tiles = Array.from({ length: sizeY }, () =>
      Array.from({ length: sizeX }, () => new Tile(0))
    );
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

  public addTile(cords: ICoords, value: number): IboardActions[] {
    const { row, col } = cords;
    this.boardActions = [];

    if (row < 0 || row >= this._tiles.length || col < 0 || col >= this._tiles[row].length) {
      throw new Error("Index out of bounds");
    }

    if (value < 0) {
      throw new Error("Value cannot be negative");
    } 

    const indexOfLastFilledTileInColumn = this.getIndexOfLastFilledTileInColumn(col);
    
    // 1. If the column is empty, add the tile at the top.
    // 2. If the column is full, check if the last filled tile has the same value.
    //    If it has the same value, merge them.
    // 3. Otherwise, add the new tile below the last filled tile.
    if (indexOfLastFilledTileInColumn === -1) {
      // 1. Column is empty, add new tile at the top
      this.updateTileData({
        action: action.Add,
        to: { row: 0, col: col },
        value
    })
    } else if (indexOfLastFilledTileInColumn === this._tiles.length - 1) {
      if (this._tiles[indexOfLastFilledTileInColumn][col].value == value) {
        // 2. Column is full & last tile has the same value, merge them
        this.updateTileData({
          action: action.Merge,
          from: { row: indexOfLastFilledTileInColumn, col: col },
          to: { row: indexOfLastFilledTileInColumn, col: col },
          value: value * 2,
        });
      }
    } else {
      // 3. Otherwise, add new tile below the last filled tile
      this.updateTileData({
        action: action.Add,
        to: { row: indexOfLastFilledTileInColumn + 1, col: col },
        value
      });
    }

    this.checkForMerge();

    return this.boardActions;
  }

  private isTopTileHaveSameValue(cords: ICoords): boolean {
    const { row, col } = cords;
    
    if (row === 0) return false;
    return this._tiles[row - 1][col].value === this._tiles[row][col].value;
  }

  private isLeftTileHaveSameValue(cords: ICoords): boolean {
    const { row, col } = cords;
    
    if (col === 0) return false;
    return this._tiles[row][col - 1].value === this._tiles[row][col].value;
  }

  private isRightTileHaveSameValue(cords: ICoords): boolean {
    const { row, col } = cords;

    if (col === this._tiles[row].length - 1) return false;
    return this._tiles[row][col + 1].value === this._tiles[row][col].value;
  }

  private isBottomTileHaveSameValue(cords: ICoords): boolean {
    const { row, col } = cords;

    if (row === this._tiles.length - 1) return false;
    return this._tiles[row + 1][col].value === this._tiles[row][col].value;
  }

  private getIndexOfLastFilledTileInColumn(col: number): number {
    for (let i = this._tiles.length - 1; i >= 0; i--) {
      if (this._tiles[i][col].value !== 0) {
        return i;
      }
    }
    return -1; // No filled tile found in the column
  }

  private updateTileData(action: IboardActions): void {
    this.boardActions.push({ ...action });

    if (action.action !== 'move') this._tiles[action.to.row][action.to.col].value = action.value;
    if (action.action !== 'add') this._tiles[action.from.row][action.from.col].value = 0;
    if (action.action === 'move') this._tiles[action.to.row][action.to.col].value = this._tiles[action.from.row][action.from.col].value;

    console.log(`check tile at (${action.to.row}, ${action.to.col}) for next step`);
    this.tilesToCheckInNextStep.push(action.to);
  }

  private checkForMerge(): void {
    if (this.tilesToCheckInNextStep.length === 0) return;
    const tilesToCheckInNextStep = [...this.tilesToCheckInNextStep];
    this.tilesToCheckInNextStep = [];
    console.log('Checking for merges...');
    console.log(`tiles values before merge:`, this._tiles.map(row => row.map(tile => tile.value)));

    tilesToCheckInNextStep.forEach(cords => {
      const { row, col } = cords;
      console.log(`tiles value at (${row}, ${col}):`, `${this._tiles[row][col].value}`);
      if (this._tiles[row][col].value === 0) return;
      console.log(`Checking tile at (${row}, ${col}) for merges...`);
      if (this.isTopTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row: row - 1, col },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
      } else if (this.isLeftTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row, col: col - 1 },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
      } else if (this.isRightTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row, col: col + 1 },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
      } else if (this.isBottomTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row: row + 1, col },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
      }
    });

    console.log(`tiles values after merge:`, this._tiles.map(row => row.map(tile => tile.value)));

    this.moveTileIfTopTileIsEmpty();
  }

  private moveTileIfTopTileIsEmpty(): void {
    if (this.colsToUpdate.length === 0) {
      this.checkForMerge();
      return;
    }

    this.colsToUpdate.forEach((col) => {
      this._tiles.forEach((_, rowIndex) => {
        if (rowIndex > 0 && this._tiles[rowIndex - 1][col].value === 0) {
          this.updateTileData({
            action: action.Move,
            to: { row: rowIndex - 1, col },
            from: { row: rowIndex, col }
          });
        }
      });
    });

    this.colsToUpdate = [];
    this.checkForMerge();
  }
}

//edge cases
// 1. after merging the column may look like 2, 4, 0, 0, 4 and moveTileIfTopTileIsEmpty change this to 2, 4, 0, 4, 0 but it should be 2, 4, 4, 0, 0