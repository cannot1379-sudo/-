import { Ruler, Settings, Compass, Layers } from 'lucide-react';
import { CalculatorInputs, UnitType, BoardType } from '../types';

interface ParameterPanelProps {
  inputs: CalculatorInputs;
  unit: UnitType;
  boardType: BoardType;
  onChange: (key: keyof CalculatorInputs, value: string) => void;
  onBoardTypeChange: (type: BoardType) => void;
}

export function ParameterPanel({
  inputs,
  unit,
  boardType,
  onChange,
  onBoardTypeChange,
}: ParameterPanelProps) {
  const currentUnitLabel = unit === 'cm' ? 'cm' : '尺';

  return (
    <div id="parameter-panel" className="space-y-6">
      {/* 區塊 1：空間尺寸 */}
      <div id="panel-dimensions" className="bg-white p-5 rounded-2xl shadow-sm space-y-4 border border-gray-100">
        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2 text-gray-800">
          <Ruler className="w-4 h-4 text-indigo-600" /> 空間與高度量測
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">空間長度 (L)</label>
            <div className="relative">
              <input
                id="input-length"
                type="number"
                step="0.1"
                value={inputs.l}
                onChange={(e) => onChange('l', e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors"
                placeholder="輸入長度"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-bold">{currentUnitLabel}</span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">空間寬度 (W)</label>
            <div className="relative">
              <input
                id="input-width"
                type="number"
                step="0.1"
                value={inputs.w}
                onChange={(e) => onChange('w', e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors"
                placeholder="輸入寬度"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-bold">{currentUnitLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-100">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">原 RC 天花高度</label>
            <input
              id="input-orig-height"
              type="number"
              step="0.1"
              value={inputs.originalHeight}
              onChange={(e) => onChange('originalHeight', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-indigo-700 mb-1">新木作天花高度</label>
            <input
              id="input-new-height"
              type="number"
              step="0.1"
              value={inputs.newHeight}
              onChange={(e) => onChange('newHeight', e.target.value)}
              className="w-full px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-gray-100">
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-500" /> 主角材鋪設方向
          </label>
          <select
            id="select-direction"
            value={inputs.mainDirection}
            onChange={(e) => onChange('mainDirection', e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
          >
            <option value="w">橫跨短邊平行 W (最符合現場實務)</option>
            <option value="l">橫跨長邊平行 L</option>
          </select>
        </div>
      </div>

      {/* 區塊 2：施工設定參數 */}
      <div id="panel-engineering" className="bg-white p-5 rounded-2xl shadow-sm space-y-4 border border-gray-100">
        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2 text-gray-800">
          <Settings className="w-4 h-4 text-indigo-600" /> 工法骨架精緻參數
        </h3>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">角材剖面寬度 (減算扣料)</label>
          <div className="relative">
            <input
              id="input-thickness"
              type="number"
              step="0.001"
              value={inputs.timberThickness}
              onChange={(e) => onChange('timberThickness', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <span className="absolute right-3 top-2 text-xs text-gray-400">{currentUnitLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">主角材跨距</label>
            <input
              id="input-main-spacing"
              type="number"
              step="0.1"
              value={inputs.mainSpacing}
              onChange={(e) => onChange('mainSpacing', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">副角材標準間距</label>
            <input
              id="input-sub-spacing"
              type="number"
              step="0.1"
              value={inputs.subSpacing}
              onChange={(e) => onChange('subSpacing', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-100">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">主角材搭接長度</label>
            <input
              id="input-splice-length"
              type="number"
              step="0.1"
              value={inputs.spliceLength}
              onChange={(e) => onChange('spliceLength', e.target.value)}
              className="w-full px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 font-semibold rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">耗損安全加成 (%)</label>
            <input
              id="input-wastage"
              type="number"
              step="1"
              value={inputs.wastage}
              onChange={(e) => onChange('wastage', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-100">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">吊筋支撐間距</label>
            <input
              id="input-hanger-spacing"
              type="number"
              step="0.1"
              value={inputs.hangerSpacing}
              onChange={(e) => onChange('hangerSpacing', e.target.value)}
              className="w-full px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">吊筋橫放樣長度</label>
            <input
              id="input-hanger-top"
              type="number"
              step="0.1"
              value={inputs.hangerTopLength}
              onChange={(e) => onChange('hangerTopLength', e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* 封板尺寸選擇 */}
        <div className="pt-2 border-t border-dashed border-gray-100">
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-teal-600" /> 面層封板板材格式
          </label>
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button
              id="btn-board-3x6"
              type="button"
              onClick={() => onBoardTypeChange('3x6')}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                boardType === '3x6'
                  ? 'bg-white shadow text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              3x6 矽酸鈣板 (防火)
            </button>
            <button
              id="btn-board-3x7"
              type="button"
              onClick={() => onBoardTypeChange('3x7')}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                boardType === '3x7'
                  ? 'bg-white shadow text-amber-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              3x7 4mm夾板 (造型)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
