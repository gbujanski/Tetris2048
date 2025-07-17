import type { IBoard } from "../interfaces/board.interface";
import type { IBoardRenderer } from "../interfaces/board-renderer.interface";
import type { IboardActions, IboardAddAction, IboardMergeAction, IboardMoveAction } from "../interfaces/board-actions.interface";
import { action } from "../enums/board-action.enum";
import { Tile } from "./tile";

export class BoardRenderer implements IBoardRenderer {
  private _board: IBoard;
  private _boardEl: HTMLDivElement;

  constructor(board: IBoard, boardEl: HTMLDivElement) {
    this._board = board;
    this._boardEl = boardEl;
    this.generateBoardStructure();
  }

  public async updateBoard(boardActions: IboardActions[]): Promise<void> {
   for (const boardAction of boardActions) {
      switch (boardAction.action) {
        case action.Add:
          this.addTile(boardAction);
          break;
        case action.Move:
          await this.editTile(boardAction);
          break;
        case action.Merge:
          await this.editTile(boardAction);
          break;
      }
    }
  }

  public reset(): void {
    this._boardEl.innerHTML = '';
    this.generateBoardStructure();
  }

  private addTile(addAction: IboardAddAction): void {
    const tileEl = this._boardEl.children[addAction.to.row].children[addAction.to.col] as HTMLDivElement;
    const newTile = new Tile(addAction.value);

    tileEl.textContent = newTile.displayValue;
    tileEl.style.backgroundColor = newTile.bgColor;
    tileEl.style.color = newTile.textColor;
    tileEl.dataset.value = newTile.value.toString();
  }

  private async editTile(moveOrMergeAction: IboardMoveAction | IboardMergeAction): Promise<void> {
    const fromTile = this._boardEl.children[moveOrMergeAction.from.row].children[moveOrMergeAction.from.col] as HTMLDivElement;
    const toTile = this._boardEl.children[moveOrMergeAction.to.row].children[moveOrMergeAction.to.col] as HTMLDivElement;
    const fromTileValue = fromTile.dataset.value ? parseInt(fromTile.dataset.value) : 0;

    if (fromTile.textContent !== '') {
      // update with animation
      const tempElement = fromTile.cloneNode(true) as HTMLDivElement;
      const destinationTileRect = toTile.getBoundingClientRect();
      const sourceTileRect = fromTile.getBoundingClientRect();

      tempElement.style.left = `${sourceTileRect.left}px`;
      tempElement.style.top = `${sourceTileRect.top}px`;
      tempElement.style.position = 'absolute';
      tempElement.style.zIndex = '1000';
      tempElement.style.transition = 'left 0.3s ease, top 0.3s ease';

      this._boardEl.appendChild(tempElement);
      // Force reflow to ensure the initial position is applied
      tempElement.getBoundingClientRect();

      tempElement.style.left = `${destinationTileRect.left}px`;
      tempElement.style.top = `${destinationTileRect.top}px`;
      fromTile.textContent = '';
      fromTile.style.backgroundColor = '';

      await this.sleep(300);
      
      tempElement.remove();
    }

    const newTile = new Tile(moveOrMergeAction.action === action.Move ? fromTileValue : moveOrMergeAction.value);

    toTile.textContent = newTile.displayValue;
    toTile.dataset.value = newTile.value.toString();

    if (toTile.textContent) {
      toTile.style.backgroundColor = newTile.bgColor;
      toTile.style.color = newTile.textColor;
    }
  }

  private generateBoardStructure(): void {
    this._board.tiles.forEach((row, i) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'row';
      rowEl.dataset.row = i.toString();

      row.forEach((tile, i) => {
        const tileEl = document.createElement('div');
        tileEl.className = 'tile';
        tileEl.dataset.col = i.toString();
        tileEl.dataset.value = tile.value.toString();

        if (tile.value !== 0) {
          const newTile = new Tile(tile.value);
          
          tileEl.textContent = newTile.displayValue;
          tileEl.style.backgroundColor = newTile.bgColor;
          tileEl.style.color = newTile.textColor;
        }

        rowEl.appendChild(tileEl);
      });

      this._boardEl.appendChild(rowEl);
    });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
