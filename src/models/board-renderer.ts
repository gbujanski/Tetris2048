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

  public updateBoard(boardActions: IboardActions[]): void {
    boardActions.forEach((boardAction: IboardActions) => {
      switch (boardAction.action) {
        case action.Add:
          this.addTile(boardAction);
          break;
        case action.Move:
          this.moveTile(boardAction);
          break;
        case action.Merge:
          this.mergeTiles(boardAction);
          break;
      }
    })
  }

  public reset(): void {
    this._boardEl.innerHTML = '';
  }

  private addTile(action: IboardAddAction): void {
    this._boardEl.children[action.to.row].children[action.to.col].textContent = action.value.toString();
  }

  private moveTile(action: IboardMoveAction): void {
    this._boardEl.children[action.to.row].children[action.to.col].textContent = this._boardEl.children[action.from.row].children[action.from.col].textContent;
    this._boardEl.children[action.from.row].children[action.from.col].textContent = '';
  }

  private mergeTiles(action: IboardMergeAction): void {
    this._boardEl.children[action.to.row].children[action.to.col].textContent = action.value.toString();
    this._boardEl.children[action.from.row].children[action.from.col].textContent = '';
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
