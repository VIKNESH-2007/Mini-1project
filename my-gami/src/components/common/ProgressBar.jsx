import React from 'react';

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  label = '', 
  sublabel = '', 
  colorClass = 'bg-brand-500', 
  heightClass = 'h-3',
  showPercent = true 
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-700">
          {label && <span>{label}</span>}
          <div className="ml-auto flex items-center gap-1.5">
            {sublabel && <span className="text-slate-400 font-normal">{sublabel}</span>}
            {showPercent && <span className="font-extrabold text-slate-800">{percentage}%</span>}
          </div>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heightClass} shadow-inner`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
