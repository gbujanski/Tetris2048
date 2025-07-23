import type { INextTileRenderer } from '../interfaces/next-tile-renderer.interface';
import { State } from '../state';
import { Tile } from './tile';

export class NextTileRenderer implements INextTileRenderer {
  private nextTileEl: HTMLDivElement;
  private state = State.getInstance();

  constructor() {
    this.nextTileEl = document.getElementById('next-tile') as HTMLDivElement;

    let nextTileValue = this.getInitialNextTileValue();
    this.updateNextTileDisplay(nextTileValue);
    this.subscribeForFutureChanges();
  }

  private subscribeForFutureChanges(): void {
    this.state.subscribe('board', () => {
      this.updateNextTileDisplay();
    });
  }
  private getInitialNextTileValue(): number {
    if (this.state.has('nextTile')) {
      const valueFromState = this.state.get('nextTile');

      if (valueFromState > 0 && Math.log2(valueFromState) % 1 === 0) {
        return valueFromState;
      } else {
        console.warn(
          'Invalid next tile value in state, resetting to 0. Expected a power of two.'
        );
        this.state.delete('nextTile');
      }
    }
    return 0;
  }

  private updateNextTileDisplay(value: number = 0): void {
    let nextTileValue = value;

    if (!nextTileValue) {
      nextTileValue = this.getNextTileValue();
    }

    this.state.set('nextTile', nextTileValue);
    const newTile = new Tile(nextTileValue);

    this.nextTileEl.textContent = newTile.displayValue;
    this.nextTileEl.style.backgroundColor = newTile.bgColor;
    this.nextTileEl.style.color = newTile.textColor;
  }

  private getNextTileValue(): number {
    const log2FromHighestTile = this.getLog2FromHighestTile();
    const nextRandomPowerOfTwo =
      this.generateNextRandomPowerOfTwo(log2FromHighestTile);

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
      nextRandomPowerOfTwo = 1;
    } else if (log2FromHighestTile - 5 < 0) {
      nextRandomPowerOfTwo = Math.ceil(Math.random() * 2);
    } else {
      nextRandomPowerOfTwo = Math.ceil(
        Math.random() * (log2FromHighestTile - 4)
      );
    }

    return nextRandomPowerOfTwo;
  }
}
