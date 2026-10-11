import React from 'react';

export function WeeklyTimeChart() {
  const data = [
    { day: "Mon", minutes: 55, target: 45 },
    { day: "Tue", minutes: 40, target: 45 },
    { day: "Wed", minutes: 65, target: 45 },
    { day: "Thu", minutes: 50, target: 45 },
    { day: "Fri", minutes: 75, target: 45 },
    { day: "Sat", minutes: 90, target: 45 },
    { day: "Sun", minutes: 60, target: 45 }
  ];

  const maxMinutes = 100;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900">Weekly Study Minutes</h4>
          <p className="text-[11px] text-slate-500">Total: 435 mins (Target: 315 mins)</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          +38% vs last week
        </span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.minutes / maxMinutes) * 100);
          const isTargetMet = item.minutes >= item.target;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                {item.minutes}m
              </span>
              <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end justify-center p-0.5">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isTargetMet ? 'bg-brand-500 group-hover:bg-brand-600' : 'bg-amber-400 group-hover:bg-amber-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 mt-1">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
          <span>Target Met (&gt;45m)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Moderate (&lt;45m)</span>
        </span>
      </div>
    </div>
  );
}

export function SubjectAccuracyBars() {
  const subjects = [
    { name: "Data Structures & Algorithms (C++)", accuracy: 92, color: "bg-blue-500" },
    { name: "Enterprise OOP & JVM (Java)", accuracy: 88, color: "bg-amber-500" },
    { name: "Systems & Memory (C)", accuracy: 84, color: "bg-emerald-500" },
    { name: "Web APIs & EF Core (C#)", accuracy: 90, color: "bg-indigo-500" },
    { name: "Version Control & CI/CD (Git & GitHub)", accuracy: 95, color: "bg-purple-500" },
    { name: "Containerization & DevOps (Docker)", accuracy: 86, color: "bg-cyan-500" }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
      <h4 className="font-extrabold text-sm text-slate-900 mb-1">Subject Mastery Breakdown</h4>
      <p className="text-[11px] text-slate-500 mb-4">Quiz accuracy scores across key domains</p>

      <div className="space-y-3.5">
        {subjects.map((sub, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{sub.name}</span>
              <span className="font-extrabold text-slate-900">{sub.accuracy}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${sub.color} h-2.5 rounded-full transition-all duration-700`}
                style={{ width: `${sub.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
