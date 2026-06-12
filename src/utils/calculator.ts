import { CalculatorInputs, CalculatorResults, UnitType, BoardType } from '../types';

export const CM_PER_TSAI = 30.3;
export const TIMBER_LENGTH_TSAI = 8.065; // 8尺

export class BinNode {
  x: number;
  y: number;
  w: number;
  h: number;
  used: boolean;
  right: BinNode | null;
  down: BinNode | null;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.used = false;
    this.right = null;
    this.down = null;
  }

  insert(pw: number, ph: number): BinNode | null {
    const eps = 0.01; // 容錯值
    if (this.used) {
      const node = this.right ? this.right.insert(pw, ph) : null;
      if (node) return node;
      return this.down ? this.down.insert(pw, ph) : null;
    } else if (pw <= this.w + eps && ph <= this.h + eps) {
      this.used = true;
      const dw = this.w - pw;
      const dh = this.h - ph;
      // 切割邏輯：留下最大連續面積的廢料
      if (dw > dh) {
        this.right = new BinNode(this.x + pw, this.y, dw, this.h);
        this.down = new BinNode(this.x, this.y + ph, pw, dh);
      } else {
        this.right = new BinNode(this.x + pw, this.y, dw, ph);
        this.down = new BinNode(this.x, this.y + ph, this.w, dh);
      }
      return this;
    }
    return null;
  }
}

export function calculateCeiling(
  inputs: CalculatorInputs,
  unit: UnitType,
  boardType: BoardType
): CalculatorResults | null {
  const toTsai = (val: number) => (unit === 'tsai' ? val : val / CM_PER_TSAI);
  const toCurrentUnit = (tsaiVal: number) => (unit === 'tsai' ? tsaiVal : tsaiVal * CM_PER_TSAI);

  const numL = Number(inputs.l) || 0;
  const numW = Number(inputs.w) || 0;
  const numOriginalHeight = Number(inputs.originalHeight) || 0;
  const numNewHeight = Number(inputs.newHeight) || 0;
  const numHangerTopLength = Number(inputs.hangerTopLength) || 0;
  const numSpliceLength = Number(inputs.spliceLength) || 0;
  const numTimberThickness = Number(inputs.timberThickness) || 0;
  const numMainSpacing = Number(inputs.mainSpacing) || 0;
  const numSubSpacing = Number(inputs.subSpacing) || 0;
  const numHangerSpacing = Number(inputs.hangerSpacing) || 0;
  const numWastage = Number(inputs.wastage) || 0;

  const boardLen = boardType === '3x6' ? 6.0 : 7.0; // 6尺或 7尺

  const L_tsai = toTsai(numL);
  const W_tsai = toTsai(numW);
  const origH_tsai = toTsai(numOriginalHeight);
  const newH_tsai = toTsai(numNewHeight);
  const hangerTop_tsai = toTsai(numHangerTopLength);
  const spliceLen_tsai = toTsai(numSpliceLength);
  const tt_tsai = toTsai(numTimberThickness);
  const ms_tsai = toTsai(numMainSpacing);
  const ss_tsai = toTsai(numSubSpacing);
  const hs_tsai = toTsai(numHangerSpacing);

  const hangerVertical_tsai = Math.max(0, origH_tsai - newH_tsai);

  if (!L_tsai || !W_tsai || L_tsai <= 0 || W_tsai <= 0) return null;

  // 1. 角材骨架運算
  const perimeter = 2 * (L_tsai + W_tsai);
  const rawSpanLength = inputs.mainDirection === 'w' ? W_tsai : L_tsai;
  const rawRunLength = inputs.mainDirection === 'w' ? L_tsai : W_tsai;
  const innerSpanLength = Math.max(0, rawSpanLength - 2 * tt_tsai);

  const mainLines = Math.floor((rawRunLength - 1.5 * tt_tsai) / ms_tsai);
  const subLinesPerBay = Math.floor(innerSpanLength / ss_tsai);

  const splicesPerLine = Math.max(0, Math.ceil((innerSpanLength - 0.05) / TIMBER_LENGTH_TSAI) - 1);
  const totalSplices = mainLines * splicesPerLine;

  const bay1LengthTsai = Math.max(0, ms_tsai - 1.5 * tt_tsai);
  const bayMidLengthTsai = Math.max(0, ms_tsai - 1.0 * tt_tsai);
  const bayLastLengthTsai = Math.max(0, rawRunLength - mainLines * ms_tsai - 1.5 * tt_tsai);

  const lastBaySpanTsai = rawRunLength - mainLines * ms_tsai;
  const isNarrowLastBay = lastBaySpanTsai > 0 && lastBaySpanTsai < 2.5;
  const lastBaySubSpacingTsai = isNarrowLastBay ? 1.5 : ss_tsai;
  const subLinesLastBay = Math.floor(innerSpanLength / lastBaySubSpacingTsai);

  const requiredCuts: number[] = [];

  if (mainLines >= 0) {
    for (let i = 0; i < subLinesPerBay; i++) requiredCuts.push(bay1LengthTsai);
    if (mainLines > 1) {
      for (let i = 0; i < subLinesPerBay * (mainLines - 1); i++) requiredCuts.push(bayMidLengthTsai);
    }
    if (bayLastLengthTsai > 0) {
      for (let i = 0; i < subLinesLastBay; i++) requiredCuts.push(bayLastLengthTsai);
    }
  }

  const hangersPerLine = Math.floor(innerSpanLength / hs_tsai);
  const totalHangers = mainLines * hangersPerLine;
  for (let i = 0; i < totalHangers; i++) {
    if (hangerVertical_tsai > 0) requiredCuts.push(hangerVertical_tsai);
    if (hangerTop_tsai > 0) requiredCuts.push(hangerTop_tsai);
  }

  for (let i = 0; i < totalSplices; i++) {
    if (spliceLen_tsai > 0) requiredCuts.push(spliceLen_tsai);
  }

  let fullTimbers = 0;
  for (let i = 0; i < mainLines; i++) {
    let remainingSpan = innerSpanLength;
    while (remainingSpan > 0) {
      if (remainingSpan >= TIMBER_LENGTH_TSAI - 0.1) {
        fullTimbers++;
        remainingSpan -= TIMBER_LENGTH_TSAI;
      } else {
        requiredCuts.push(remainingSpan);
        remainingSpan = 0;
      }
    }
  }

  requiredCuts.sort((a, b) => b - a);
  const scraps: number[] = [];
  let packedTimbers = 0;

  for (const cut of requiredCuts) {
    if (cut <= 0) continue;
    const fitIdx = scraps.findIndex((s) => s >= cut);
    if (fitIdx !== -1) {
      scraps[fitIdx] -= cut;
    } else {
      packedTimbers++;
      scraps.push(TIMBER_LENGTH_TSAI - cut);
    }
  }

  let totalScrapLength = scraps.reduce((sum, val) => sum + val, 0);
  let perimeterRemaining = perimeter;

  if (totalScrapLength >= perimeterRemaining) {
    totalScrapLength -= perimeterRemaining;
    perimeterRemaining = 0;
  } else {
    perimeterRemaining -= totalScrapLength;
  }

  const extraTimbersForPerimeter = Math.ceil(perimeterRemaining / TIMBER_LENGTH_TSAI);
  const baseSticks = fullTimbers + packedTimbers + extraTimbersForPerimeter;
  const orderSticks = Math.ceil(baseSticks * (1 + numWastage / 100));

  // 2. 封板精準裁切與排版
  const areaPing = (L_tsai * W_tsai) / 36;

  const boardPieces: { w: number; h: number }[] = []; // 要送進 Bin Packing 的尺寸
  const renderBoards: { x: number; y: number; w: number; h: number }[] = []; // 實際拼版尺寸與座標

  const bayCount = mainLines + (lastBaySpanTsai > 0 ? 1 : 0);
  const runLength = inputs.mainDirection === 'w' ? W_tsai : L_tsai;

  for (let bayIdx = 0; bayIdx < bayCount; bayIdx++) {
    const isLastBay = bayIdx === bayCount - 1 && lastBaySpanTsai > 0;
    const bayW = isLastBay ? lastBaySpanTsai : 3.0;

    // 判斷是否為窄跨距收邊 (轉向成 3尺 長度封)
    const useRotated = isLastBay && isNarrowLastBay;
    const standardPieceLength = useRotated ? 3.0 : boardLen; // 正常為 6 或 7

    let currentPos = 0;

    // 按照實務：先用完整板材封到底，剩下的再去裁切
    while (currentPos + 0.01 < runLength) {
      const pieceLen = Math.min(standardPieceLength, runLength - currentPos);

      let svgX, svgY, svgW, svgH;
      if (inputs.mainDirection === 'w') {
        svgX = bayIdx * 3.0;
        svgY = currentPos;
        svgW = bayW;
        svgH = pieceLen;
      } else {
        svgX = currentPos;
        svgY = bayIdx * 3.0;
        svgW = pieceLen;
        svgH = bayW;
      }
      renderBoards.push({ x: svgX, y: svgY, w: svgW, h: svgH });

      const matLength = useRotated ? bayW : pieceLen;
      if (matLength > 0.05) {
        boardPieces.push({ w: 3.0, h: matLength });
      }

      currentPos += pieceLen;
    }
  }

  boardPieces.sort((a, b) => b.w * b.h - a.w * a.h);

  // 執行 2D 裁切打包演算法 (支援旋轉)
  const bins: { root: BinNode; items: { x: number; y: number; w: number; h: number }[] }[] = [];
  for (const p of boardPieces) {
    let placed = false;
    const pw = p.w, ph = p.h;

    for (const bin of bins) {
      let node = bin.root.insert(pw, ph);
      if (node) {
        bin.items.push({ x: node.x, y: node.y, w: pw, h: ph });
        placed = true;
        break;
      }
      node = bin.root.insert(ph, pw);
      if (node) {
        bin.items.push({ x: node.x, y: node.y, w: ph, h: pw });
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newBin = { root: new BinNode(0, 0, 3.0, boardLen), items: [] as any[] };
      bins.push(newBin);
      let node = newBin.root.insert(pw, ph);
      if (node) {
        newBin.items.push({ x: node.x, y: node.y, w: pw, h: ph });
      } else {
        node = newBin.root.insert(ph, pw);
        if (node) {
          newBin.items.push({ x: node.x, y: node.y, w: ph, h: pw });
        }
      }
    }
  }

  const actualBoardsUsed = bins.length;
  const orderBoards = Math.ceil(actualBoardsUsed * (1 + numWastage / 100));

  // SVG 畫布偏移設定
  const paddingLeft = 55;
  const paddingRight = 75;
  const paddingTop = 60;
  const paddingBottom = 70;
  const svgW = 600;
  const svgH = 500;

  const scale = Math.min(
    (svgW - paddingLeft - paddingRight) / L_tsai,
    (svgH - paddingTop - paddingBottom) / W_tsai
  );
  const drawW = L_tsai * scale;
  const drawH = W_tsai * scale;
  const offsetX = paddingLeft + (svgW - paddingLeft - paddingRight - drawW) / 2;
  const offsetY = paddingTop + (svgH - paddingTop - paddingBottom - drawH) / 2;

  return {
    mainLines,
    subLinesPerBay,
    bay1: toCurrentUnit(bay1LengthTsai),
    bayMid: toCurrentUnit(bayMidLengthTsai),
    bayLast: toCurrentUnit(bayLastLengthTsai),
    lastBaySpan: toCurrentUnit(lastBaySpanTsai),
    isNarrowLastBay,
    lastBaySubSpacing: toCurrentUnit(lastBaySubSpacingTsai),
    subLinesLastBay,
    totalSubJoists:
      subLinesPerBay * Math.max(0, mainLines) + (bayLastLengthTsai > 0 ? subLinesLastBay : 0),
    totalHangers,
    totalSplices,
    spliceLength: toCurrentUnit(spliceLen_tsai),
    hangerVertical: toCurrentUnit(hangerVertical_tsai),
    hangerTop: toCurrentUnit(hangerTop_tsai),
    packedTimbers,
    fullTimbers,
    extraTimbersForPerimeter,
    totalScrapLength: toCurrentUnit(totalScrapLength),
    orderSticks,
    areaPing,
    actualBoardsUsed,
    orderBoards,
    bins: bins as any,
    renderBoards,
    boardLen,
    drawParams: {
      offsetX,
      offsetY,
      drawW,
      drawH,
      scale,
      L_tsai,
      W_tsai,
      tt_tsai,
      ms_tsai,
      ss_tsai,
      hs_tsai,
      spliceLen_tsai,
      mainLines,
      subLinesPerBay,
      splicesPerLine,
      subLinesLastBay,
      lastBaySubSpacingTsai,
      isNarrowLastBay,
      bay1LengthTsai,
      bayMidLengthTsai,
      bayLastLengthTsai,
    },
  };
}
