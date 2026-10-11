import React from 'react';
import { useXP } from '../../context/GamificationContext';
import { Zap, X } from 'lucide-react';

export default function ConfettiReward() {
  const { rewardModal, closeRewardModal } = useXP();

  if (!rewardModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={closeRewardModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close reward popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-white shadow-xl flex items-center justify-center text-4xl mb-4 -mt-10 animate-bounce">
          {rewardModal.icon || '🎉'}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-1">
          {rewardModal.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-slate-600 mb-4">
          {rewardModal.subtitle}
        </p>

        {/* XP Gained Pill */}
        {rewardModal.xpGained > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-extrabold text-lg mb-5 shadow-xs">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            <span>+{rewardModal.xpGained} XP Earned</span>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={closeRewardModal}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md shadow-brand-200 active:scale-98 transition"
        >
          Keep It Up! 🚀
        </button>
      </div>
    </div>
  );
}
