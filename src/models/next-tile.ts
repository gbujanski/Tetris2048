import type { INextTile } from "../interfaces/next-tile.interface";

export class NextTile implements INextTile {
  constructor() {}

  public getNextTileValue(higestTileValue: number): number {
    const log2FromHighestTile = Math.log2(higestTileValue);
    let nextRandomPowerOfTwo;

    if (log2FromHighestTile - 5 < -3) {
      nextRandomPowerOfTwo = 1
    } else if (log2FromHighestTile - 5 < 0) {
      nextRandomPowerOfTwo = Math.ceil(Math.random() * 2);
    }
    else {
      nextRandomPowerOfTwo = Math.ceil(Math.random() * (log2FromHighestTile - 4));
    }

    return Math.pow(2, nextRandomPowerOfTwo);
  }
}