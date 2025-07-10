import './style.css';
import { Board } from './models/board';
import { BoardRenderer } from './models/board-renderer';
import { NextTileRenderer } from './models/next-tile-renderer';
import { GameController } from './models/game-controller';
import { PointerDragHandler } from './models/pointer-drag-handler';

const boardEl = document.getElementById('board') as HTMLDivElement;

const boardSizeX = 5; // Example size
const boardSizeY = 8; // Example size
const board = new Board(boardSizeX, boardSizeY);
const boardRenderer = new BoardRenderer(board, boardEl);
new GameController(board, boardRenderer);
new NextTileRenderer();
new PointerDragHandler();
