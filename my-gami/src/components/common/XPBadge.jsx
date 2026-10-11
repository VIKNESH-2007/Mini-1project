import React from 'react';
import { Lock, Check } from 'lucide-react';

export default function XPBadge({ badge, onClick }) {
  const { title, category, icon, description, unlocked, rarity, xpReward, progress } = badge;

  const rarityColorMap = {
    Common: "border-slate-300 bg-slate-50 text-slate-700",
    Rare: "border-blue-400 bg-blue-50/60 text-blue-800",
    Epic: "border-purple-400 bg-purple-50/60 text-purple-800",
    Legendary: "border-amber-400 bg-amber-50/70 text-amber-900 shadow-playful-amber"
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
        unlocked 
          ? `${rarityColorMap[rarity] || 'border-brand-300 bg-brand-50/50'} hover:-translate-y-1 hover:shadow-md badge-shine`
          : 'border-dashed border-slate-300 bg-slate-50/60 opacity-70 grayscale hover:opacity-90'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl filter drop-shadow-sm select-none">{icon}</span>
          
          <div className="flex items-center gap-1">
            {unlocked ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                <Check className="w-3 h-3" /> Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            )}
          </div>
        </div>

        <h4 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">{description}</p>
      </div>

      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span className="uppercase text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 font-bold">
          {category}
        </span>
        <span className="font-extrabold text-amber-600">
          +{xpReward} XP
        </span>
      </div>

      {!unlocked && progress && (
        <div className="mt-2 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-center">
          Progress: {progress}
        </div>
      )}
    </div>
  );
}
