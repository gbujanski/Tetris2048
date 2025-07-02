import './style.css';
import { Board } from './models/board';
import { BoardRenderer } from './models/board-renderer';
import { NextTile } from './models/next-tile';
import { getColor } from './utils/get-color';
import { GameController } from './models/game-controller';

const boardEl = document.getElementById('board') as HTMLDivElement;
const nextTileEl = document.getElementById('next-tile') as HTMLDivElement;

const boardSizeX = 4; // Example size
const boardSizeY = 5; // Example size
const board = new Board(boardSizeX, boardSizeY);
const boardRenderer = new BoardRenderer(board, boardEl);
const gameController = new GameController(board, boardRenderer);
const nextTileInstance = new NextTile();



function updateNextTileDisplay() {
    const nextTileValue = nextTileInstance.getNextTileValue(board.higestTileValue);
    nextTileEl.textContent = nextTileValue.toString();
    nextTileEl.style.backgroundColor = getColor(nextTileValue);
}

updateNextTileDisplay();

let dropX = 0;
let dropY = 0;

nextTileEl.addEventListener('dragend', (e) => {
    console.log(e);
    dropX = boardRenderer.dopedTile?.dataset.col ? parseInt(boardRenderer.dopedTile.dataset.col) : 0;
    dropY = boardRenderer.dopedTile?.parentElement?.dataset.row ? parseInt(boardRenderer.dopedTile.parentElement.dataset.row) : 0;
    gameController.addTile({row: dropY, col: dropX}, parseInt(nextTileEl.textContent!));
    updateNextTileDisplay();
});

