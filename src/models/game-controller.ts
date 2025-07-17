import type { IBoard } from '../interfaces/board.interface';
import type { IBoardRenderer } from '../interfaces/board-renderer.interface';
import type { ICoords } from '../interfaces/cords.interface';
import { State } from '../state';

export class GameController {
  private board: IBoard;
  private renderer: IBoardRenderer;
  private state = State.getInstance();

  constructor(board: IBoard, renderer: IBoardRenderer) {
    this.board = board;
    this.renderer = renderer;

    this.subscribeForFutureChanges();
    this.onResetButtonClick();
  }

  private reset(): void {
    this.board.reset();
    this.renderer.reset();
  }

  private addTile(cords: ICoords, value: number): void {
    const boardActions = this.board.addTile(cords, value);
    this.renderer.updateBoard(boardActions);
  }

  private subscribeForFutureChanges(): void {
    this.state.subscribe('dropTarget', target => {
      const col = target.dataset.col ? parseInt(target.dataset.col) : 0;
      const row = target.parentElement?.dataset.row
        ? parseInt(target.parentElement.dataset.row)
        : 0;
      const droppedTileValue = parseInt(this.state.get('nextTile'));

      this.addTile({ row, col }, droppedTileValue);
    });
  }

  private onResetButtonClick(): void {
    const resetButton = document.getElementById(
      'reset-btn'
    ) as HTMLButtonElement;
    resetButton.addEventListener('click', () => {
      this.reset();
    });
  }
}
