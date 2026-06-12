import { LayoutGrid, ArrowDownToLine, Link, Lightbulb } from 'lucide-react';
import { CalculatorResults, UnitType } from '../types';

interface DetailReportProps {
  results: CalculatorResults | null;
  unit: UnitType;
}

export function DetailReport({ results, unit }: DetailReportProps) {
  if (!results) return null;

  const unitLabel = unit === 'tsai' ? '尺' : 'cm';

  return (
    <div id="detail-report-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. 副支放樣與裁切表 */}
      <div id="sub-joist-report" className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col">
        <h3 className="text-sm font-bold mb-4 text-emerald-800 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-emerald-600" /> 副角材放樣與裁切規格
        </h3>
        
        <div id="sub-joist-details" className="space-y-3">
          {results.bayLast > 0 && (
            <div
              id="last-bay-warning"
              className={`p-2 rounded-lg border flex items-start gap-2 ${
                results.isNarrowLastBay
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed font-sans">
                最後收邊跨距為 <span className="font-bold">{results.lastBaySpan.toFixed(2)} {unitLabel}</span>。
                {results.isNarrowLastBay
                  ? '由於此跨距極窄，放樣系統已自動微調骨架間距以提高受力結構。'
                  : '此跨距落於標準預設，維持一般副支配置。'}
              </div>
            </div>
          )}

          {/* 1. 起頭靠牆 */}
          <div id="detail-bay-1" className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <div>
              <h4 className="font-bold text-emerald-900 text-[11px]">起步首跨 (自起扣 1.5t)</h4>
              <p className="text-[9px] text-emerald-700">裁切數量: {results.subLinesPerBay} 支 / 跨</p>
            </div>
            <div className="text-base font-black text-emerald-700">
              {results.bay1.toFixed(2)} <span className="text-[9px]">{unitLabel}</span>
            </div>
          </div>

          {/* 2. 主支之間 */}
          <div id="detail-bay-mid" className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <div>
              <h4 className="font-bold text-blue-900 text-[11px]">主骨架間跨 (自起扣 1.0t)</h4>
              <p className="text-[9px] text-blue-700">
                共 {Math.max(0, results.mainLines - 1)} 跨 / 每跨需 {results.subLinesPerBay} 支
              </p>
            </div>
            <div className="text-base font-black text-blue-700">
              {results.bayMid.toFixed(2)} <span className="text-[9px]">{unitLabel}</span>
            </div>
          </div>

          {/* 3. 結尾收邊 */}
          <div id="detail-bay-last" className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
            <div>
              <h4 className="font-bold text-amber-900 text-[11px]">結尾收邊跨距</h4>
              <p className="text-[9px] text-amber-700">裁切數量: {results.subLinesLastBay} 支</p>
            </div>
            <div className="text-base font-bold text-amber-700">
              {results.bayLast.toFixed(2)} <span className="text-[9px]">{unitLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 吊筋與搭接配件 */}
      <div id="hanger-splice-report" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <ArrowDownToLine className="w-4 h-4 text-indigo-600" /> 吊筋拉力組件與搭接配件
        </h3>

        <div id="hanger-splice-details" className="space-y-4">
          {/* 搭接片 */}
          {results.totalSplices > 0 ? (
            <div id="splice-detail-block" className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-rose-800 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-rose-600" /> 主骨架延長搭接 (雙夾片)
                </span>
                <span className="text-xs font-black text-rose-700">{results.totalSplices} 處搭接</span>
              </div>
              <div className="text-[9px] text-rose-650 leading-relaxed font-sans">
                跨距長度超越 8 台尺標準，需接長骨架。每處搭接點需搭配一段{' '}
                <strong className="text-rose-700">
                  {results.spliceLength.toFixed(2)} {unitLabel}
                </strong>{' '}
                的角材裁切片作為增強腹板，防止接頭下垂。
              </div>
            </div>
          ) : (
            <div id="no-splice-notice" className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[10px] text-gray-500">
              主角材拉線跨距未超過 8 台尺 (約 244 cm)，故無需延長搭接片，大省新料！
            </div>
          )}

          {/* T字吊筋 */}
          <div id="hanger-detail-block" className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-indigo-900 flex items-center gap-1">
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> T 字加勁吊筋組 (紅點位置)
              </span>
              <span className="text-xs font-black text-indigo-700">總共 {results.totalHangers} 組</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white/60 p-2 rounded border border-indigo-50">
                <div className="text-[9px] text-indigo-600 mb-0.5">橫定天花板支 (頂 RC)</div>
                <div className="font-extrabold text-xs text-indigo-900">
                  {results.hangerTop.toFixed(2)} {unitLabel}
                </div>
              </div>
              <div className="bg-white/60 p-2 rounded border border-indigo-50">
                <div className="text-[9px] text-indigo-600 mb-0.5">豎支下拉受力支</div>
                <div className="font-extrabold text-xs text-indigo-900">
                  {results.hangerVertical.toFixed(2)} {unitLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="eco-notice-card" className="mt-auto pt-2 border-t border-dashed border-gray-200">
          <p className="text-[10px] text-emerald-700 bg-emerald-50/55 p-2 rounded-lg flex items-start gap-1 font-sans leading-relaxed">
            <span className="text-emerald-500 font-bold">✓</span>
            <strong>精算餘料回收機制：</strong>
            所有吊筋橫支、搭接用短木棒，在算料系統中皆已優先對接「主角材切割後剩餘的廢料」進行重分配，大限度將材料耗損降至最低。
          </p>
        </div>
      </div>
    </div>
  );
}
