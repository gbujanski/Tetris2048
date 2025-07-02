import type { IBoard } from "../interfaces/board.interface";
import type { IBoardRenderer } from "../interfaces/board-renderer.interface";
import type { ICoords } from "../interfaces/cords.interface";

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

    public addTile(cords: ICoords, value: number): void {
        const boardActions = this.board.addTile(cords, value);
        this.renderer.updateBoard(boardActions);
    }
}