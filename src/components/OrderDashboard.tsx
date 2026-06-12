import { CalculatorResults, BoardType } from '../types';

interface OrderDashboardProps {
  results: CalculatorResults | null;
  boardType: BoardType;
  wastage: string;
}

export function OrderDashboard({ results, boardType, wastage }: OrderDashboardProps) {
  if (!results) {
    return (
      <div id="dashboard-empty-state" className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
        <p className="text-sm text-slate-400">請在左側輸入有效的量測長度、寬度，以啟動天花板叫料精算</p>
      </div>
    );
  }

  const isPly = boardType === '3x7';

  return (
    <div id="order-dashboard-container" className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-center">
      {/* 背景裝飾光效 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl rounded-full"></div>
      
      <h3 className="text-sm font-bold text-slate-300 mb-2">天花板精算工程叫料總計</h3>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-1">
        {/* 角材支數 */}
        <div id="sticks-summary" className="flex items-end gap-2">
          <span className="text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-md">
            {results.orderSticks}
          </span>
          <span className="text-xl font-bold mb-1 text-slate-400">
            支 <span className="text-xs font-normal opacity-70 ml-1">永新防蟲角材 (8尺標準規格)</span>
          </span>
        </div>
        
        {/* 板材片數 */}
        <div id="boards-summary" className="flex items-end gap-2 md:border-l border-slate-700 md:pl-8">
          <span className={`text-5xl md:text-6xl font-black tracking-tighter drop-shadow-md ${isPly ? 'text-amber-400' : 'text-emerald-400'}`}>
            {results.orderBoards}
          </span>
          <span className="text-xl font-bold mb-1 text-slate-400">
            片 <span className="text-xs font-normal opacity-70 ml-1">
              {isPly ? '天然集層 4mm 夾板 (3x7 規格)' : '日本麗仕 7mm 矽酸鈣板 (3x6 規格)'}
            </span>
          </span>
        </div>
      </div>

      <div id="dashboard-meta-layout" className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap gap-x-6 gap-y-2">
         <span>天花實鋪坪數: <strong className="text-emerald-300">{results.areaPing.toFixed(1)} 坪</strong></span>
         <span>板材實鋪不重疊: <strong className="text-emerald-300">{results.actualBoardsUsed} 片</strong></span>
         <span>材料耗損安全加成: <strong className="text-indigo-400">+{wastage}%</strong></span>
         <span>餘料智慧折合: <strong className="text-amber-300">{results.totalScrapLength.toFixed(1)} 尺</strong></span>
      </div>
    </div>
  );
}
