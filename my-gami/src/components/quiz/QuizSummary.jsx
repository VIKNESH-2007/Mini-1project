import React from 'react';
import { Link } from 'react-router-dom';
import { useXP } from '../../context/GamificationContext';
import { Zap, RotateCcw, ArrowRight } from 'lucide-react';

export default function QuizSummary({ score, totalQuestions, xpEarned, onRetry }) {
  const { streak } = useXP();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg max-w-xl mx-auto text-center animate-in zoom-in-95">
      {/* Trophy / Ribbon visual */}
      <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-5xl mb-4 animate-bounce">
        🏆
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-amber-800 inline-block mb-2">
        Daily Challenge Complete
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        {percentage >= 75 ? "Outstanding Performance!" : percentage >= 50 ? "Well Done, Learner!" : "Keep Practicing!"}
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
        You answered <span className="font-bold text-slate-900">{score} out of {totalQuestions}</span> questions correctly.
        {percentage === 100 && " Perfect score achieved!"}
      </p>

      {/* Rewards Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
        <div className="p-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">XP Earned</span>
          <div className="flex items-center justify-center gap-1 text-base font-extrabold text-amber-600 mt-0.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>+{xpEarned}</span>
          </div>
        </div>

        <div className="p-2 border-x border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accuracy</span>
          <span className="text-base font-extrabold text-brand-600 mt-0.5 block">
            {percentage}%
          </span>
        </div>

        <div className="p-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Streak</span>
          <span className="text-base font-extrabold text-orange-600 mt-0.5 block">
            🔥 {streak} Days
          </span>
        </div>
      </div>

      {/* Leaderboard teaser */}
      <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl mb-6 flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            #5
          </div>
          <div>
            <p className="text-xs font-bold text-purple-950">Leaderboard Rank: #5</p>
            <p className="text-[11px] text-purple-700">Only 130 XP away from Rank #4!</p>
          </div>
        </div>
        <Link
          to="/leaderboard"
          className="text-xs font-extrabold text-purple-700 hover:text-purple-900 underline flex items-center gap-0.5"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-200 transition active:scale-95"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
