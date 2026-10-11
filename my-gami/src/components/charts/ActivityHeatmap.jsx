import { Flame } from 'lucide-react';

export default function ActivityHeatmap({ streak = 12 }) {
  // Generate 35 days (5 weeks) of activity blocks
  const days = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i + 1;
    // Simulate active days leading up to the current streak
    const isActive = i >= 35 - streak;
    const intensity = !isActive 
      ? 0 
      : i % 4 === 0 
      ? 3 
      : i % 2 === 0 
      ? 2 
      : 1;

    return {
      day: dayNum,
      active: isActive,
      intensity: intensity,
      date: `Day ${dayNum}`
    };
  });

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 3: return 'bg-emerald-600 border-emerald-700';
      case 2: return 'bg-emerald-400 border-emerald-500';
      case 1: return 'bg-emerald-200 border-emerald-300';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Learning Streak Calendar</h4>
            <p className="text-[11px] text-slate-500">Continuous daily learning consistency</p>
          </div>
        </div>

        <span className="font-extrabold text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          🔥 {streak} Day Streak!
        </span>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-bold text-slate-400">
            {day}
          </div>
        ))}
        {days.map((d, idx) => (
          <div
            key={idx}
            className={`h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 cursor-pointer ${
              getIntensityColor(d.intensity)
            } ${d.intensity > 1 ? 'text-white' : 'text-slate-500'}`}
            title={`${d.date}: ${d.intensity > 0 ? `${d.intensity * 2} lessons completed` : 'Rest day'}`}
          >
            {d.active ? "✓" : ""}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
        <span>Less active</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
          <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" />
          <span className="w-3 h-3 rounded bg-emerald-400 border border-emerald-500" />
          <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-700" />
        </div>
        <span>High activity</span>
      </div>
    </div>
  );
}
