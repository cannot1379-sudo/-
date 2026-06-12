import { Calculator } from 'lucide-react';
import { UnitType } from '../types';

interface HeaderProps {
  unit: UnitType;
  onUnitChange: (newUnit: UnitType) => void;
}

export function Header({ unit, onUnitChange }: HeaderProps) {
  return (
    <div id="app-header" className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-indigo-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div id="header-logo-container" className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
          <Calculator className="w-7 h-7" />
        </div>
        <div>
          <h1 id="header-title" className="text-xl font-bold text-gray-900 tracking-tight flex items-center flex-wrap gap-2">
            天花板角材與封板精算系統
            <span id="version-badge" className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
              分裝式元件架構 (CB)
            </span>
          </h1>
          <p id="header-subtitle" className="text-gray-500 text-xs mt-1">
            專業級木作工程算料模組。支援 3x6 矽酸鈣板 / 3x7 4mm 夾板，整合 Guillotine 裁切優化與搭接防呆
          </p>
        </div>
      </div>

      <div id="unit-toggle-group" className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto shadow-inner">
        <button
          id="btn-unit-cm"
          onClick={() => onUnitChange('cm')}
          className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
            unit === 'cm'
              ? 'bg-white shadow text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          公分 (cm)
        </button>
        <button
          id="btn-unit-tsai"
          onClick={() => onUnitChange('tsai')}
          className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
            unit === 'tsai'
              ? 'bg-white shadow text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          台尺 (tsai)
        </button>
      </div>
    </div>
  );
}
