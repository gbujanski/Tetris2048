import type { IBoard } from "../interfaces/board.interface";
import type { ITile } from '../interfaces/tile.interface';
import type { ICoords } from "../interfaces/cords.interface";
import type { IboardActions } from "../interfaces/board-actions.interface";
import { Tile } from "../models/tile";
import { action } from '../enums/board-action.enum';
import { State } from "../state";
export class Board implements IBoard {
  private state = State.getInstance();
  private _tiles: ITile[][];
  private boardActions: IboardActions[] = [];
  private tilesToCheckInNextStep: ICoords[] = [];
  private colsToUpdate: number[] = [];

  constructor(sizeX: number, sizeY: number) {
    if (this.state.has('board')) {
      this._tiles = this.generateBoardFromState();
    } else {
      this._tiles = this.generateEmptyBoard(sizeX, sizeY);
    }
  }

  public get tiles(): ITile[][] {
    return this._tiles;
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

    this.state.set('board', this._tiles.map(row => row.map(tile => tile.value)));

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

  private updateTileData(boardAction: IboardActions): void {
    this.boardActions.push({ ...boardAction });

    if (boardAction.action === action.Move) this._tiles[boardAction.to.row][boardAction.to.col].value = this._tiles[boardAction.from.row][boardAction.from.col].value;
    if (boardAction.action !== action.Move) this._tiles[boardAction.to.row][boardAction.to.col].value = boardAction.value;
    if (boardAction.action !== action.Add) this._tiles[boardAction.from.row][boardAction.from.col].value = 0;

    this.tilesToCheckInNextStep.push(boardAction.to);
  }

  private checkForMerge(): void {
    if (this.tilesToCheckInNextStep.length === 0) return;
    const tilesToCheckInNextStep = [...this.tilesToCheckInNextStep];
    this.tilesToCheckInNextStep = [];

    tilesToCheckInNextStep.forEach(cords => {
      const { row, col } = cords;
      if (this._tiles[row][col].value === 0) return;
      if (this.isTopTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row: row - 1, col },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
        this.colsToUpdate.push(col);
      } else if (this.isLeftTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row, col: col - 1 },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
        this.colsToUpdate.push(col);
      } else if (this.isRightTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: cords,
          value: this._tiles[row][col].value * 2,
          from: { row, col: col + 1 }
        });
        this.colsToUpdate.push(col + 1);
      } else if (this.isBottomTileHaveSameValue(cords)) {
        this.updateTileData({
          action: action.Merge,
          to: { row: row + 1, col },
          value: this._tiles[row][col].value * 2,
          from: cords
        });
        this.colsToUpdate.push(col);
      }
      
    });

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

  private generateBoardFromState(): Tile[][] {
    const rawBoard: number[][] = this.state.get('board');
    return rawBoard.map(row => row.map(tileValue => new Tile(tileValue)));
  }

  private generateEmptyBoard(sizeX: number, sizeY: number): Tile[][] {
    return Array.from({ length: sizeY }, () =>
      Array.from({ length: sizeX }, () => new Tile(0))
    );
  }
}

//edge cases
// 1. after merging the column may look like 2, 4, 0, 0, 4 and moveTileIfTopTileIsEmpty change this to 2, 4, 0, 4, 0 but it should be 2, 4, 4, 0, 0