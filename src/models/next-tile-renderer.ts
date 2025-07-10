import type { INextTileRenderer } from "../interfaces/next-tile-renderer.interface";
import { State } from "../state";
import { Tile } from "./tile";

export class NextTileRenderer implements INextTileRenderer {
  private nextTileEl: HTMLDivElement;
  private state = State.getInstance();

  constructor() {
    this.nextTileEl = document.getElementById('next-tile') as HTMLDivElement;
    this.updateNextTileDisplay();
    this.subscribeForFutureChanges();
  }

  private subscribeForFutureChanges(): void {
    this.state.subscribe('board', () => {
      this.updateNextTileDisplay();
    });
  }

  private updateNextTileDisplay(): void {
    const nextTileValue = this.getNextTileValue();
    this.state.set('nextTile', nextTileValue);
    const newTile = new Tile(nextTileValue);

    this.nextTileEl.textContent = newTile.value.toString();
    this.nextTileEl.style.backgroundColor = newTile.color.bg;
    this.nextTileEl.style.color = newTile.color.text;
  }

  private getNextTileValue(): number {
    const log2FromHighestTile = this.getLog2FromHighestTile();
    const nextRandomPowerOfTwo = this.generateNextRandomPowerOfTwo(log2FromHighestTile);

    return Math.pow(2, nextRandomPowerOfTwo);
  }

  private getLog2FromHighestTile(): number {
    const board = this.state.get('board') as number[][];
    const highestTileValue = Math.max(...board.flat());

    return Math.log2(highestTileValue);
  }

  private generateNextRandomPowerOfTwo(log2FromHighestTile: number): number {
    let nextRandomPowerOfTwo;
    
    if (log2FromHighestTile - 5 < -3) {
      nextRandomPowerOfTwo = 1
    } else if (log2FromHighestTile - 5 < 0) {
      nextRandomPowerOfTwo = Math.ceil(Math.random() * 2);
    } else {
      nextRandomPowerOfTwo = Math.ceil(Math.random() * (log2FromHighestTile - 4));
    }

    return nextRandomPowerOfTwo;
  }
}