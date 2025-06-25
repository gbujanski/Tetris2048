import './style.css';
import { Board } from './Board';
import { BoardRenderer } from './BoardRenderer';
import { NextTile } from './NextTile';
import { getColor } from './utils/getColor';
import { GameController } from './GameController';

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
    dropX = boardRenderer.dopedTile?.dataset.col ? parseInt(boardRenderer.dopedTile.dataset.col) : 0;
    dropY = boardRenderer.dopedTile?.parentElement?.dataset.row ? parseInt(boardRenderer.dopedTile.parentElement.dataset.row) : 0;
    gameController.updateTile(dropY, dropX, parseInt(nextTileEl.textContent!));
    updateNextTileDisplay();
});

