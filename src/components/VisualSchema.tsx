import React from 'react';
import { UnitType, BoardType, CalculatorResults } from '../types';
import { CM_PER_TSAI } from '../utils/calculator';

interface VisualSchemaProps {
  results: CalculatorResults;
  unit: UnitType;
  boardType: BoardType;
  viewType: 'joist' | 'board';
  l: string;
  w: string;
}

export function VisualSchema({ results, unit, boardType, viewType, l, w }: VisualSchemaProps) {
  const { drawParams } = results;
  if (!drawParams) return null;

  const {
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
  } = drawParams;

  const formatDim = (v: number) => {
    return unit === 'tsai' ? `${v.toFixed(2)}尺` : `${(v * CM_PER_TSAI).toFixed(1)}cm`;
  };

  const renderHDim = (
    xStart: number,
    xEnd: number,
    y: number,
    label: string,
    showLeftLine = true,
    showRightLine = true
  ) => {
    const midX = (xStart + xEnd) / 2;
    if (xEnd - xStart < 8) return null;
    return (
      <g key={`hdim-${xStart}-${xEnd}-${y}`} className="opacity-95">
        {showLeftLine && (
          <line
            x1={xStart}
            y1={y + 6}
            x2={xStart}
            y2={y - 8}
            stroke="#cbd5e1"
            strokeWidth="0.75"
            strokeDasharray="1,1"
          />
        )}
        {showRightLine && (
          <line
            x1={xEnd}
            y1={y + 6}
            x2={xEnd}
            y2={y - 8}
            stroke="#cbd5e1"
            strokeWidth="0.75"
            strokeDasharray="1,1"
          />
        )}
        <line x1={xStart} y1={y} x2={xEnd} y2={y} stroke="#64748b" strokeWidth="1" />
        <line
          x1={xStart - 3}
          y1={y + 3}
          x2={xStart + 3}
          y2={y - 3}
          stroke="#475569"
          strokeWidth="1.2"
        />
        <line x1={xEnd - 3} y1={y + 3} x2={xEnd + 3} y2={y - 3} stroke="#475569" strokeWidth="1.2" />
        <rect x={midX - 16} y={y - 12} width="32" height="9" fill="#f8fafc" rx="1" />
        <text
          x={midX}
          y={y - 5}
          textAnchor="middle"
          fontSize="7.5px"
          fontWeight="bold"
          fill="#334155"
        >
          {label}
        </text>
      </g>
    );
  };

  const renderVDim = (
    yStart: number,
    yEnd: number,
    x: number,
    label: string,
    showTopLine = true,
    showBottomLine = true
  ) => {
    const midY = (yStart + yEnd) / 2;
    if (yEnd - yStart < 8) return null;
    return (
      <g key={`vdim-${yStart}-${yEnd}-${x}`} className="opacity-95">
        {showTopLine && (
          <line
            x1={x + 6}
            y1={yStart}
            x2={x - 8}
            y2={yStart}
            stroke="#cbd5e1"
            strokeWidth="0.75"
            strokeDasharray="1,1"
          />
        )}
        {showBottomLine && (
          <line
            x1={x + 6}
            y1={yEnd}
            x2={x - 8}
            y2={yEnd}
            stroke="#cbd5e1"
            strokeWidth="0.75"
            strokeDasharray="1,1"
          />
        )}
        <line x1={x} y1={yStart} x2={x} y2={yEnd} stroke="#64748b" strokeWidth="1" />
        <line
          x1={x - 3}
          y1={yStart - 3}
          x2={x + 3}
          y2={yStart + 3}
          stroke="#475569"
          strokeWidth="1.2"
        />
        <line x1={x - 3} y1={yEnd - 3} x2={x + 3} y2={yEnd + 3} stroke="#475569" strokeWidth="1.2" />
        <rect x={x - 31} y={midY - 4.5} width="28" height="9" fill="#f8fafc" rx="1" />
        <text
          x={x - 17}
          y={midY + 2.5}
          textAnchor="middle"
          fontSize="7.5px"
          fontWeight="bold"
          fill="#334155"
        >
          {label}
        </text>
      </g>
    );
  };

  const renderOuterDimensions = () => {
    const lines = [];
    const overallDimY = offsetY + drawH + 30;
    
    // 總長 L
    lines.push(
      <g key="outer-h-overall" className="opacity-80">
        <line
          x1={offsetX}
          y1={offsetY + drawH}
          x2={offsetX}
          y2={overallDimY + 6}
          stroke="#94a3b8"
          strokeWidth="0.75"
          strokeDasharray="2,2"
        />
        <line
          x1={offsetX + drawW}
          y1={offsetY + drawH}
          x2={offsetX + drawW}
          y2={overallDimY + 6}
          stroke="#94a3b8"
          strokeWidth="0.75"
          strokeDasharray="2,2"
        />
        <line x1={offsetX} y1={overallDimY} x2={offsetX + drawW} y2={overallDimY} stroke="#475569" strokeWidth="1.2" />
        <line
          x1={offsetX - 4}
          y1={overallDimY + 4}
          x2={offsetX + 4}
          y2={overallDimY - 4}
          stroke="#1e293b"
          strokeWidth="1.8"
        />
        <line
          x1={offsetX + drawW - 4}
          y1={overallDimY + 4}
          x2={offsetX + drawW + 4}
          y2={overallDimY - 4}
          stroke="#1e293b"
          strokeWidth="1.8"
        />
        <rect x={offsetX + drawW / 2 - 40} y={overallDimY - 14} width="80" height="11" fill="#f8fafc" rx="2" />
        <text
          x={offsetX + drawW / 2}
          y={overallDimY - 5}
          textAnchor="middle"
          fontSize="9px"
          fontWeight="black"
          fill="#1e293b"
        >
          總長 L: {unit === 'tsai' ? `${L_tsai.toFixed(1)} 尺` : `${Number(l).toFixed(1)} cm`}
        </text>
      </g>
    );

    // 總寬 W
    const overallDimXRight = offsetX + drawW + 48;
    const midY = offsetY + drawH / 2;
    lines.push(
      <g key="outer-v-overall" className="opacity-80">
        <line
          x1={offsetX + drawW}
          y1={offsetY}
          x2={overallDimXRight + 6}
          y2={offsetY}
          stroke="#94a3b8"
          strokeWidth="0.75"
          strokeDasharray="2,2"
        />
        <line
          x1={offsetX + drawW}
          y1={offsetY + drawH}
          x2={overallDimXRight + 6}
          y2={offsetY + drawH}
          stroke="#94a3b8"
          strokeWidth="0.75"
          strokeDasharray="2,2"
        />
        <line
          x1={overallDimXRight}
          y1={offsetY}
          x2={overallDimXRight}
          y2={offsetY + drawH}
          stroke="#475569"
          strokeWidth="1.2"
        />
        <line
          x1={overallDimXRight - 4}
          y1={offsetY + 4}
          x2={overallDimXRight + 4}
          y2={offsetY - 4}
          stroke="#1e293b"
          strokeWidth="1.8"
        />
        <line
          x1={overallDimXRight - 4}
          y1={offsetY + drawH + 4}
          x2={overallDimXRight + 4}
          y2={offsetY + drawH - 4}
          stroke="#1e293b"
          strokeWidth="1.8"
        />
        <g transform={`rotate(90, ${overallDimXRight}, ${midY})`}>
          <rect x={overallDimXRight - 40} y={midY - 14} width="80" height="12" fill="#f8fafc" rx="2" />
          <text
            x={overallDimXRight}
            y={midY - 5}
            textAnchor="middle"
            fontSize="9px"
            fontWeight="black"
            fill="#1e293b"
          >
            總寬 W: {unit === 'tsai' ? `${W_tsai.toFixed(1)} 尺` : `${Number(w).toFixed(1)} cm`}
          </text>
        </g>
      </g>
    );

    return lines;
  };

  const renderContent = () => {
    if (viewType === 'joist') {
      const mainJoistLines = [];
      const subJoistLines = [];
      const hangerDots = [];
      const spliceRects = [];
      const chainDimensionLines = [];

      // 主角材平行 W (橫跨短邊)
      if (results.drawParams.ms_tsai > 0) {
        if (results.drawParams.bay1LengthTsai <= 0) return null;

        const mainXCoords: number[] = [];
        for (let i = 0; i < mainLines; i++) {
          const xVal = (i + 1) * ms_tsai;
          if (xVal < L_tsai - tt_tsai) mainXCoords.push(xVal);
        }

        mainXCoords.forEach((x, idx) => {
          const svgX = offsetX + x * scale;
          const svgYStart = offsetY + tt_tsai * scale;
          const svgYEnd = offsetY + (W_tsai - tt_tsai) * scale;
          
          // 繪製主角材線
          mainJoistLines.push(
            <line
              key={`main-${x}-${idx}`}
              x1={svgX}
              y1={svgYStart}
              x2={svgX}
              y2={svgYEnd}
              stroke="#78350f"
              strokeWidth={Math.max(2, tt_tsai * scale)}
              strokeLinecap="square"
            />
          );

          // 繪製搭接
          const innerSpan = W_tsai - 2 * tt_tsai;
          for (let s = 1; s <= splicesPerLine; s++) {
            const spliceY = tt_tsai + s * 8.065; // 8.065台尺 standard size
            if (spliceY < W_tsai - tt_tsai) {
              spliceRects.push(
                <rect
                  key={`splice-${x}-${s}`}
                  x={svgX - (tt_tsai * scale) / 2 - 2}
                  y={offsetY + (spliceY - spliceLen_tsai / 2) * scale}
                  width={tt_tsai * scale + 4}
                  height={spliceLen_tsai * scale}
                  fill="#fda4af"
                  stroke="#e11d48"
                  strokeWidth="1"
                  opacity="0.9"
                />
              );
            }
          }

          // 繪製吊筋 (紅點)
          const hangersCount = Math.floor(innerSpan / hs_tsai);
          for (let h = 1; h <= hangersCount; h++) {
            const hY = tt_tsai + h * hs_tsai;
            if (hY < W_tsai - tt_tsai) {
              hangerDots.push(
                <circle
                  key={`hanger-${x}-${h}`}
                  cx={svgX}
                  cy={offsetY + hY * scale}
                  r="4.5"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              );
            }
          }
        });

        // 繪製副角材 (SS 間距分割)
        const subYCoords = [];
        for (let j = 1; j <= subLinesPerBay; j++) subYCoords.push(tt_tsai + j * ss_tsai);
        const xBays = [tt_tsai, ...mainXCoords, L_tsai - tt_tsai];

        subYCoords.forEach((y, subIdx) => {
          const svgY = offsetY + y * scale;
          for (let i = 0; i < xBays.length - 1; i++) {
            const isLastBay = i === xBays.length - 2;
            if (isLastBay && isNarrowLastBay) continue;
            const startX = xBays[i] + (i === 0 ? tt_tsai : tt_tsai / 2);
            const endX = xBays[i + 1] - (isLastBay ? tt_tsai : tt_tsai / 2);
            if (startX < endX) {
              subJoistLines.push(
                <line
                  key={`sub-${y}-${i}-${subIdx}`}
                  x1={offsetX + startX * scale}
                  y1={svgY}
                  x2={offsetX + endX * scale}
                  y2={svgY}
                  stroke="#b45309"
                  strokeWidth={Math.max(1.5, (tt_tsai / 2) * scale)}
                  strokeDasharray="1,1"
                />
              );
            }
          }
        });

        // 結尾收頭
        if (isNarrowLastBay && xBays.length >= 2) {
          const startX = xBays[xBays.length - 2] + tt_tsai / 2;
          const endX = xBays[xBays.length - 1] - tt_tsai;
          for (let j = 1; j <= subLinesLastBay; j++) {
            const y = tt_tsai + j * lastBaySubSpacingTsai;
            if (y < W_tsai - tt_tsai && startX < endX) {
              subJoistLines.push(
                <line
                  key={`sub-last-${y}-${j}`}
                  x1={offsetX + startX * scale}
                  y1={offsetY + y * scale}
                  x2={offsetX + endX * scale}
                  y2={offsetY + y * scale}
                  stroke="#ea580c"
                  strokeWidth={Math.max(1.5, (tt_tsai / 2) * scale)}
                />
              );
            }
          }
        }

        // 繪製鏈條尺寸
        const hBays = [];
        if (mainLines === 0) {
          hBays.push({ start: tt_tsai, end: L_tsai - tt_tsai, label: formatDim(L_tsai - 2 * tt_tsai) });
        } else {
          hBays.push({ start: tt_tsai, end: ms_tsai - 0.5 * tt_tsai, label: formatDim(bay1LengthTsai) });
          for (let i = 1; i < mainLines; i++) {
            hBays.push({
              start: i * ms_tsai + 0.5 * tt_tsai,
              end: (i + 1) * ms_tsai - 0.5 * tt_tsai,
              label: formatDim(bayMidLengthTsai),
            });
          }
          const lastJoistRight = mainLines * ms_tsai + 0.5 * tt_tsai;
          if (lastJoistRight < L_tsai - tt_tsai) {
            hBays.push({ start: lastJoistRight, end: L_tsai - tt_tsai, label: formatDim(bayLastLengthTsai) });
          }
        }
        hBays.forEach((bay, idx) => {
          const dimEl = renderHDim(
            bay.start * scale + offsetX,
            bay.end * scale + offsetX,
            offsetY - 18,
            bay.label
          );
          if (dimEl) chainDimensionLines.push(React.cloneElement(dimEl, { key: `dim-h-${idx}` }));
        });

        const vBays = [];
        vBays.push({ start: tt_tsai, end: tt_tsai + ss_tsai, label: formatDim(ss_tsai) });
        for (let j = 1; j < subLinesPerBay; j++) {
          vBays.push({ start: tt_tsai + j * ss_tsai, end: tt_tsai + (j + 1) * ss_tsai, label: formatDim(ss_tsai) });
        }
        const lastSubY = tt_tsai + subLinesPerBay * ss_tsai;
        if (lastSubY < W_tsai - tt_tsai) {
          vBays.push({ start: lastSubY, end: W_tsai - tt_tsai, label: formatDim(W_tsai - tt_tsai - lastSubY) });
        }
        vBays.forEach((bay, idx) => {
          const dimEl = renderVDim(
            bay.start * scale + offsetY,
            bay.end * scale + offsetY,
            offsetX - 20,
            bay.label
          );
          if (dimEl) chainDimensionLines.push(React.cloneElement(dimEl, { key: `dim-v-${idx}` }));
        });
      }

      return (
        <>
          {subJoistLines}
          {mainJoistLines}
          {spliceRects}
          {hangerDots}
          {chainDimensionLines}
        </>
      );
    } else {
      // 繪製封板排版圖
      const isPly = boardType === '3x7';
      const boardFill = isPly ? '#fef3c7' : '#e2e8f0'; // 夾板琥珀 vs 矽酸鈣灰藍
      const boardStroke = isPly ? '#d97706' : '#64748b';

      return results.renderBoards.map((b, i) => (
        <rect
          key={`board-${i}`}
          x={offsetX + b.x * scale}
          y={offsetY + b.y * scale}
          width={b.w * scale}
          height={b.h * scale}
          fill={boardFill}
          stroke={boardStroke}
          strokeWidth="1.2"
          opacity="0.8"
        />
      ));
    }
  };

  return (
    <div id="visual-schema-card" className="w-full relative">
      <svg
        id="visual-layout-canvas"
        className="w-full aspect-[6/5] bg-slate-50 rounded-xl border border-slate-200"
        viewBox="0 0 600 500"
      >
        <defs>
          <pattern id="canvas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="500" fill="url(#canvas-grid)" rx="12" />
        
        {/* 外牆基準框 */}
        <rect
          x={offsetX}
          y={offsetY}
          width={drawW}
          height={drawH}
          fill="none"
          stroke="#334155"
          strokeWidth="2.5"
        />

        {/* 內層放樣界限 */}
        <rect
          x={offsetX + tt_tsai * scale}
          y={offsetY + tt_tsai * scale}
          width={Math.max(0, drawW - 2 * tt_tsai * scale)}
          height={Math.max(0, drawH - 2 * tt_tsai * scale)}
          fill="#fbfbfb"
          stroke="#94a3b8"
          strokeWidth={Math.max(1.5, tt_tsai * scale)}
          opacity="0.95"
        />

        {renderContent()}
        {renderOuterDimensions()}

        {/* 起步放樣點指標 */}
        <g id="layout-origin-marker" transform="translate(42, 42)" className="opacity-70 font-sans">
          <circle cx="0" cy="0" r="14" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="1.2" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="1.2" />
          <polygon
            points="0,-12 -3.5,-5 3.5,-5"
            fill={viewType === 'joist' ? '#ef4444' : boardType === '3x7' ? '#d97706' : '#10b981'}
          />
          <text x="-4" y="21" fontSize="8" fontWeight="bold" fill="#475569">
            {viewType === 'joist' ? '放樣起點' : '封板起點'}
          </text>
        </g>
      </svg>
    </div>
  );
}
