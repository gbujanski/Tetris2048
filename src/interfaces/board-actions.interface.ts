import { action } from '../enums/board-action.enum';
import type { ICoords } from './cords.interface';

export interface IboardAddAction {
  action: typeof action.Add;
  to: ICoords;
  value: number;
}

export interface IboardMoveAction {
  action: typeof action.Move;
  from: ICoords;
  to: ICoords;
}

export interface IboardMergeAction {
  action: typeof action.Merge;
  from: ICoords;
  to: ICoords;
  value: number;
}

export type IboardActions =
  | IboardAddAction
  | IboardMoveAction
  | IboardMergeAction;
