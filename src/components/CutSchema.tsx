import { CalculatorResults, UnitType, BoardType } from '../types';
import { CM_PER_TSAI } from '../utils/calculator';

interface CutSchemaProps {
  results: CalculatorResults | null;
  unit: UnitType;
  boardType: BoardType;
}

export function CutSchema({ results, unit, boardType }: CutSchemaProps) {
  if (!results || !results.bins) return null;

  const isPly = boardType === '3x7';
  const useFill = isPly ? '#fef08a' : '#d1fae5'; // 黃色 vs 淺綠色
  const useStroke = isPly ? '#b45309' : '#059669';
  const textColor = isPly ? '#78350f' : '#065f46';

  return (
    <div id="cut-schema-container" className="w-full flex flex-col">
      <div
        id="cut-schema-viewport"
        className="w-full h-[350px] md:h-[450px] bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto scrollbar-hide"
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {results.bins.map((bin, idx) => {
            return (
              <div key={`bin-${idx}`} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500 mb-1">原板 第 {idx + 1} 片</span>
                
                {/* SVG 比例高度，自動配合板材是 6尺或 7尺 */}
                <svg
                  id={`bin-svg-${idx}`}
                  viewBox={`0 0 30 ${results.boardLen * 10}`}
                  className="w-full max-w-[80px] drop-shadow-sm bg-white border border-slate-300 transition-all rounded"
                >
                  {/* 板材背景（淺灰，表示未使用的整板廢料） */}
                  <rect x="0" y="0" width="30" height={results.boardLen * 10} fill="#f1f5f9" />

                  {/* 繪製此原板上切割的所有物件 */}
                  {bin.items.map((item, i) => (
                    <g key={`bin-item-${idx}-${i}`}>
                      <rect
                        x={item.x * 10}
                        y={item.y * 10}
                        width={item.w * 10}
                        height={item.h * 10}
                        fill={useFill}
                        stroke={useStroke}
                        strokeWidth="0.5"
                      />
                      <text
                        x={(item.x + item.w / 2) * 10}
                        y={(item.y + item.h / 2) * 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="3.6"
                        fontWeight="bold"
                        fill={textColor}
                      >
                        {unit === 'tsai'
                          ? `${item.w.toFixed(1)}x${item.h.toFixed(1)}`
                          : `${(item.w * CM_PER_TSAI).toFixed(0)}x${(item.h * CM_PER_TSAI).toFixed(0)}`}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* 裁切專屬圖例與算法提醒 */}
      <div className="mt-4 p-3 bg-teal-50 rounded-xl flex flex-wrap gap-4 text-[10px] md:text-sm border border-teal-100 text-teal-850">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-3 rounded-sm"
              style={{
                backgroundColor: isPly ? '#fef08a' : '#d1fae5',
                border: `1px solid ${isPly ? '#b45309' : '#059669'}`,
              }}
            ></div>
            <span className="font-semibold text-slate-800">實務使用裁切區塊</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <div className="w-4 h-3 bg-[#f1f5f9] border border-slate-300 rounded-sm"></div>
            <span className="text-slate-500">剩餘可回收餘料 (下料廢片)</span>
          </div>
        </div>
        <div className="w-full mt-1 text-[10px] text-teal-700 leading-relaxed font-sans">
          ※ <strong>AI 實務裁切算法機制：</strong>系統已啟用二維斷頭台 (2D Guillotine) 打包運算，支援板片 90 度自動旋轉。封板最後階段產生的剩餘餘料，會自動套用於窄間距、非對稱或最後一跨的收邊接縫，從而將新板材的採購量降到最低。
        </div>
      </div>
    </div>
  );
}
