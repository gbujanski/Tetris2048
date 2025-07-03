import type { IBoard } from "../interfaces/board.interface";
import type { IBoardRenderer } from "../interfaces/board-renderer.interface";
import type { IboardActions, IboardAddAction, IboardMergeAction, IboardMoveAction } from "../interfaces/board-actions.interface";
import { action } from "../enums/board-action.enum";

export class BoardRenderer implements IBoardRenderer {
  private _boardEl: HTMLDivElement;
  private _board: IBoard;
  private _dopedTile: HTMLDivElement | null = null;


  constructor(board: IBoard, boardEl: HTMLDivElement) {
    this._board = board;
    this._boardEl = boardEl;
    this.generateBoardStructure();
  }

  public get boardEl(): HTMLDivElement {
    return this._boardEl;
  }

  public get dopedTile(): HTMLDivElement | null {
    return this._dopedTile;
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
  }

  private addTile(action: IboardAddAction): void {
    this._boardEl.children[action.to.row].children[action.to.col].textContent = action.value.toString();
  }

  private async editTile(action: IboardMoveAction | IboardMergeAction): Promise<void> {
    const fromTile = this._boardEl.children[action.from.row].children[action.from.col];
    const toTile = this._boardEl.children[action.to.row].children[action.to.col];
    const fromTileValue = fromTile.textContent;

    if (fromTile.textContent !== '') {
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
    
      await new Promise(resolve => setTimeout(resolve, 300));
      tempElement.remove();
    }
    
    toTile.textContent = action.action === 'move' ? fromTileValue : action.value.toString();
  }

  private generateBoardStructure(): void {
    this._board.tiles.forEach((row, i) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'row';
      rowEl.dataset.row = i.toString();

      row.forEach((_, i) => {
        const tileEl = document.createElement('div');
        tileEl.className = 'tile';
        tileEl.dataset.col = i.toString();
        this.bindEvents(tileEl);
        rowEl.appendChild(tileEl);
      });

      this._boardEl.appendChild(rowEl);
    });
  }

  private bindEvents(tileEl: HTMLDivElement): void {
    tileEl.addEventListener('dragenter', () => {
      tileEl.classList.add('hovered');
    });

    tileEl.addEventListener('dragleave', () => {
      tileEl.classList.remove('hovered');
    });

    tileEl.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    tileEl.addEventListener('drop', () => {
      tileEl.classList.remove('hovered');
      this._dopedTile = tileEl;
    });
  }
}
