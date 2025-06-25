import type { IBoard } from "./BoardInterface";
import type { IBoardRenderer } from "./BoardRendererInterface";

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

  public updateTile(row: number, col: number, value: number): void {
    const tileEl = this._boardEl.children[row]?.children[col] as HTMLDivElement;
    
    if (!tileEl) {
      throw new Error(`Tile at row ${row}, col ${col} does not exist.`);
    }

    if (value == 0) {
      tileEl.textContent = '';
      tileEl.style.backgroundColor = '';
    } else {
      tileEl.textContent = this._board.tiles[row][col].value.toString();
      tileEl.style.backgroundColor = this._board.tiles[row][col].color;
    }
  }

  public reset(): void {
    this._boardEl.innerHTML = '';
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

        rowEl.appendChild(tileEl);
      });

      this._boardEl.appendChild(rowEl);
    });
  }
}
