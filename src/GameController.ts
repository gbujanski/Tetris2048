import type { IBoard } from "./BoardInterface";
import type { IBoardRenderer } from "./BoardRendererInterface";

export class GameController {
    private board: IBoard;
    private renderer: IBoardRenderer;

    constructor(board: IBoard, renderer: IBoardRenderer) {
        this.board = board;
        this.renderer = renderer;
    }

    public resetGame(): void {
        this.board.reset();
        this.renderer.reset();
    }

    public updateTile(row: number, col: number, value: number): void {
        this.board.updateTile(row, col, value);
        this.renderer.updateTile(row, col, value);
    }
}