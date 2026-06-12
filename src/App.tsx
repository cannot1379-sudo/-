import { useState, useMemo } from 'react';
import { UnitType, BoardType, ActiveView, CalculatorInputs } from './types';
import { Header } from './components/Header';
import { ParameterPanel } from './components/ParameterPanel';
import { OrderDashboard } from './components/OrderDashboard';
import { VisualSchema } from './components/VisualSchema';
import { CutSchema } from './components/CutSchema';
import { DetailReport } from './components/DetailReport';
import { calculateCeiling, CM_PER_TSAI } from './utils/calculator';
import { Eye, ClipboardList, Scissors } from 'lucide-react';

export default function App() {
  const [unit, setUnit] = useState<UnitType>('tsai');
  const [boardType, setBoardType] = useState<BoardType>('3x6');
  const [activeView, setActiveView] = useState<ActiveView>('joist');

  // 初始化具備實務合理預設值的木作參數狀態 (此狀態完全由親元件管理)
  const [inputs, setInputs] = useState<CalculatorInputs>({
    l: '13.2',
    w: '10.5',
    originalHeight: '10.0',
    newHeight: '8.5',
    hangerTopLength: '0.9',
    timberThickness: '0.086',
    mainSpacing: '3.0',
    subSpacing: '1.2',
    hangerSpacing: '2.4',
    spliceLength: '1.2',
    wastage: '5',
    mainDirection: 'w',
  });

  // 當單位 (cm <-> tsai) 被選擇切換時，精準縮放與轉換所有與長度相關的輸入欄位，維持一致的幾何形態
  const handleUnitChange = (newUnit: UnitType) => {
    if (newUnit === unit) return;
    const isToTsai = newUnit === 'tsai';
    const factor = isToTsai ? 1 / CM_PER_TSAI : CM_PER_TSAI;

    setInputs((prev) => ({
      ...prev,
      l: prev.l ? +(Number(prev.l) * factor).toFixed(2) + '' : '',
      w: prev.w ? +(Number(prev.w) * factor).toFixed(2) + '' : '',
      originalHeight: prev.originalHeight ? +(Number(prev.originalHeight) * factor).toFixed(2) + '' : '',
      newHeight: prev.newHeight ? +(Number(prev.newHeight) * factor).toFixed(2) + '' : '',
      hangerTopLength: prev.hangerTopLength ? +(Number(prev.hangerTopLength) * factor).toFixed(2) + '' : '',
      timberThickness: prev.timberThickness ? +(Number(prev.timberThickness) * factor).toFixed(3) + '' : '',
      mainSpacing: prev.mainSpacing ? +(Number(prev.mainSpacing) * factor).toFixed(2) + '' : '',
      subSpacing: prev.subSpacing ? +(Number(prev.subSpacing) * factor).toFixed(2) + '' : '',
      hangerSpacing: prev.hangerSpacing ? +(Number(prev.hangerSpacing) * factor).toFixed(2) + '' : '',
      spliceLength: prev.spliceLength ? +(Number(prev.spliceLength) * factor).toFixed(2) + '' : '',
    }));
    setUnit(newUnit);
  };

  const handleInputChange = (key: keyof CalculatorInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 使用 useMemo 快取純粹的物理算料引擎，確保未變更參數時不會引發重複 Guillotine 打包重算
  const results = useMemo(() => {
    return calculateCeiling(inputs, unit, boardType);
  }, [inputs, unit, boardType]);

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-100 font-sans selection:bg-indigo-200 py-6 px-4 md:px-8">
      <div id="app-content-wrapper" className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. 整合型頁首 */}
        <Header unit={unit} onUnitChange={handleUnitChange} />

        {/* 雙欄主版區 (12 等分響應式網格) */}
        <div id="main-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* 左側：控制參數面板 (佔 4/12 寬度) */}
          <div id="left-column-control" className="lg:col-span-4">
            <ParameterPanel
              inputs={inputs}
              unit={unit}
              boardType={boardType}
              onChange={handleInputChange}
              onBoardTypeChange={setBoardType}
            />
          </div>

          {/* 右側：資料輸出與 2D 視覺化視窗 (佔 8/12 寬度) */}
          <div id="right-column-visualization" className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 叫料統計看板 */}
            <OrderDashboard results={results} boardType={boardType} wastage={inputs.wastage} />

            {/* 即時視覺化多重視窗面板 */}
            <div id="visualization-tabs-panel" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-155 flex flex-col">
              
              {/* 多重視角 Tabs 切換列 */}
              <div id="tab-buttons-row" className="flex overflow-x-auto border-b border-gray-200 mb-4 pb-0 scrollbar-hide">
                <button
                  id="tab-btn-joist"
                  onClick={() => setActiveView('joist')}
                  className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all duration-200 shrink-0 ${
                    activeView === 'joist'
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  骨架放樣圖
                </button>
                <button
                  id="tab-btn-board"
                  onClick={() => setActiveView('board')}
                  className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all duration-200 shrink-0 ${
                    activeView === 'board'
                      ? boardType === '3x6'
                        ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                        : 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  {boardType === '3x6' ? '矽酸鈣板' : '4mm 夾板'}實務排版圖
                </button>
                <button
                  id="tab-btn-cut"
                  onClick={() => setActiveView('cut')}
                  className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all duration-200 shrink-0 ${
                    activeView === 'cut'
                      ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  板材裁切與廢料圖
                </button>
              </div>

              {/* 根據主控 View 選擇渲染具體視圖 */}
              <div id="tab-canvas-viewport" className="w-full flex-1">
                {results ? (
                  <>
                    {activeView === 'joist' && (
                      <VisualSchema
                        results={results}
                        unit={unit}
                        boardType={boardType}
                        viewType="joist"
                        l={inputs.l}
                        w={inputs.w}
                      />
                    )}
                    {activeView === 'board' && (
                      <VisualSchema
                        results={results}
                        unit={unit}
                        boardType={boardType}
                        viewType="board"
                        l={inputs.l}
                        w={inputs.w}
                      />
                    )}
                    {activeView === 'cut' && (
                      <CutSchema results={results} unit={unit} boardType={boardType} />
                    )}
                  </>
                ) : (
                  <div className="py-20 text-center text-gray-400">
                    量測數據不足，無法生成 2D 視覺化圖形
                  </div>
                )}
              </div>

              {/* 圖形底下的即時輔助說明 */}
              {results && activeView === 'joist' && (
                <div id="joist-legend" className="mt-4 p-3 bg-slate-50 rounded-xl flex flex-wrap gap-4 text-[10px] md:text-xs border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-slate-400 rounded-sm"></div>
                    <span className="text-slate-600 font-medium">牆規邊角材</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-[#78350f]"></div>
                    <span className="text-slate-600 font-medium">主骨架 (W 走向)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 border-t border-dashed border-[#b45309]"></div>
                    <span className="text-slate-600 font-medium">副骨架 (分段分割)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600 font-medium">吊筋定位點</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-2.5 bg-rose-100 border border-rose-600 rounded-sm"></div>
                    <span className="text-slate-600 font-medium">延長搭接片</span>
                  </div>
                </div>
              )}

              {results && activeView === 'board' && (
                <div id="board-legend" className="mt-4 p-3 bg-slate-50 rounded-xl flex flex-wrap gap-3 text-[10px] md:text-xs border border-slate-100 align-middle">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-3 rounded-sm"
                      style={{
                        backgroundColor: boardType === '3x6' ? '#e2e8f0' : '#fef3c7',
                        border: `1px solid ${boardType === '3x6' ? '#64748b' : '#d97706'}`,
                      }}
                    ></div>
                    <span className="text-slate-600 font-medium">
                      對點切割之 {boardType === '3x6' ? '7mm 矽酸鈣板' : '4mm 夾板'}
                    </span>
                  </div>
                  <div className="text-slate-400 font-normal">
                    ※ 實務工程邏輯：在每個跨距中依序鋪設整板。超出邊界或收尾的寬度會自動經由打包優化回收。
                  </div>
                </div>
              )}
            </div>

            {/* 3. 吊筋副支細節拆分報表 */}
            <DetailReport results={results} unit={unit} />

          </div>
        </div>
      </div>
    </div>
  );
}
