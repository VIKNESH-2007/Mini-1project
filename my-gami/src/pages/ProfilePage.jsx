import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import XPBadge from '../components/common/XPBadge';
import ActivityHeatmap from '../components/charts/ActivityHeatmap';
import ProgressBar from '../components/common/ProgressBar';
import { 
  Flame, 
  Zap, 
  Award, 
  Edit3,
  X,
  CheckCircle,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { xp, streak, level, badges, unlockBadge } = useXP();
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const avatarsList = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Rishi",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Saran",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Lakshmi",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Kavitha",
    "https://api.dicebear.com/7.x/bottts/svg?seed=FarmerHero"
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-6 justify-between">
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with edit icon */}
          <div className="relative">
            <img
              src={selectedAvatar}
              alt={currentUser?.name}
              className="w-24 h-24 rounded-3xl border-4 border-brand-500 bg-brand-50 p-1 object-cover shadow-lg"
            />
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md transition"
              title="Change Avatar"
              aria-label="Change Avatar"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser?.name}
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                {currentUser?.role}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {currentUser?.school || "Village High School"} • {currentUser?.village}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak} Day Streak</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{xp} Total XP</span>
              </span>
              <span>•</span>
              <span className="font-extrabold text-slate-700">
                Level {level}
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Block */}
        <div className="w-full md:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
          <ProgressBar
            value={xp % 150}
            max={150}
            label={`Level ${level} Progress`}
            sublabel={`${150 - (xp % 150)} XP left`}
            colorClass="bg-gradient-to-r from-brand-500 to-emerald-400"
            heightClass="h-3"
          />
        </div>

      </div>

      {/* Avatar Picker Modal / Drawer */}
      {showAvatarPicker && (
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 animate-in fade-in">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Choose Your Learning Bot Avatar:
          </h4>
          <div className="flex flex-wrap gap-3">
            {avatarsList.map((av, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAvatar(av);
                  setShowAvatarPicker(false);
                }}
                className={`p-1 rounded-2xl border-2 transition hover:scale-105 ${
                  selectedAvatar === av ? 'border-brand-500 bg-white ring-2 ring-brand-300' : 'border-slate-200 bg-white'
                }`}
              >
                <img src={av} alt={`Avatar ${idx}`} className="w-14 h-14 rounded-xl" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Streak Calendar (Activity Heatmap) */}
      <ActivityHeatmap streak={streak} />

      {/* Badge Collection Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Badge & Trophy Showcase</span>
            </h3>
            <p className="text-xs text-slate-500">
              {unlockedCount} of {badges.length} badges unlocked
            </p>
          </div>

          <span className="text-xs font-black text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {Math.round((unlockedCount / badges.length) * 100)}% Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <XPBadge 
              key={badge.id} 
              badge={badge} 
              onClick={() => setSelectedBadge(badge)} 
            />
          ))}
        </div>
      </div>

      {/* Badge Details & Step-by-Step Procedure Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-sm select-none">{selectedBadge.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      {selectedBadge.category}
                    </span>
                    <span className="text-xs font-black text-amber-600">
                      +{selectedBadge.xpReward} XP
                    </span>
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 mt-0.5">
                    {selectedBadge.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-bold">Achievement Status:</span>
              {selectedBadge.unlocked ? (
                <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Unlocked ({selectedBadge.unlockedDate || "Completed"})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5" />
                  <span>In Progress {selectedBadge.progress ? `(${selectedBadge.progress})` : ''}</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedBadge.description}
            </p>

            {/* Step-by-Step Procedure to Earn / Complete */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Procedure to Complete & Earn:</span>
              </h4>

              <div className="space-y-2 text-xs">
                {(selectedBadge.procedure || [
                  "Step 1: Watch the complete course lecture and study the code breakdown.",
                  "Step 2: Solve the programming lab exercises in your Task Planner.",
                  "Step 3: Score 80%+ on the assessment quiz to claim your badge reward."
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {!selectedBadge.unlocked && (
                <button
                  onClick={() => {
                    unlockBadge(selectedBadge.id);
                    setSelectedBadge({ ...selectedBadge, unlocked: true, unlockedDate: "Just now" });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs transition"
                >
                  ✓ Test / Claim Unlock (+{selectedBadge.xpReward} XP)
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Close
                </button>

                {selectedBadge.actionLink && (
                  <Link
                    to={selectedBadge.actionLink}
                    onClick={() => setSelectedBadge(null)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md shadow-brand-200 transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{selectedBadge.actionText || "Start Learning"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
