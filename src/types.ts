export type UnitType = 'cm' | 'tsai';
export type BoardType = '3x6' | '3x7';
export type ActiveView = 'joist' | 'board' | 'cut';
export type MainDirection = 'w' | 'l';

export interface CalculatorInputs {
  l: string;
  w: string;
  originalHeight: string;
  newHeight: string;
  hangerTopLength: string;
  timberThickness: string;
  mainSpacing: string;
  subSpacing: string;
  hangerSpacing: string;
  spliceLength: string;
  wastage: string;
  mainDirection: MainDirection;
}

export interface RenderBoard {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CutItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Bin {
  items: CutItem[];
}

export interface DrawParams {
  offsetX: number;
  offsetY: number;
  drawW: number;
  drawH: number;
  scale: number;
  L_tsai: number;
  W_tsai: number;
  tt_tsai: number;
  ms_tsai: number;
  ss_tsai: number;
  hs_tsai: number;
  spliceLen_tsai: number;
  mainLines: number;
  subLinesPerBay: number;
  splicesPerLine: number;
  subLinesLastBay: number;
  lastBaySubSpacingTsai: number;
  isNarrowLastBay: boolean;
  bay1LengthTsai: number;
  bayMidLengthTsai: number;
  bayLastLengthTsai: number;
}

export interface CalculatorResults {
  mainLines: number;
  subLinesPerBay: number;
  bay1: number;
  bayMid: number;
  bayLast: number;
  lastBaySpan: number;
  isNarrowLastBay: boolean;
  lastBaySubSpacing: number;
  subLinesLastBay: number;
  totalSubJoists: number;
  totalHangers: number;
  totalSplices: number;
  spliceLength: number;
  hangerVertical: number;
  hangerTop: number;
  packedTimbers: number;
  fullTimbers: number;
  extraTimbersForPerimeter: number;
  totalScrapLength: number;
  orderSticks: number;
  areaPing: number;
  actualBoardsUsed: number;
  orderBoards: number;
  bins: Bin[];
  renderBoards: RenderBoard[];
  boardLen: number;
  drawParams: DrawParams;
}
