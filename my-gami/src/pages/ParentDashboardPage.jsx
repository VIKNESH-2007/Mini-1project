import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import { 
  Flame, 
  Zap, 
  MessageSquare, 
  Send, 
  Bell, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export default function ParentDashboardPage() {
  const { currentUser } = useAuth();
  const { xp, streak, level } = useXP();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const milestones = [
    { id: 1, title: "7-Day Consecutive Study Streak!", date: "Yesterday, 6:30 PM", icon: "🔥", color: "bg-orange-100 text-orange-800" },
    { id: 2, title: "Scored 100% in Market Fractions Quiz", date: "Sep 19, 2026", icon: "🧮", color: "bg-blue-100 text-blue-800" },
    { id: 3, title: "Unlocked 'Offline Champion' Trophy", date: "Sep 18, 2026", icon: "📡", color: "bg-emerald-100 text-emerald-800" },
    { id: 4, title: "Completed Soil Science & Composting Experiment", date: "Sep 16, 2026", icon: "🌱", color: "bg-amber-100 text-amber-800" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!teacherMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowMessageModal(false);
      setTeacherMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-teal-100 px-3 py-1 rounded-full backdrop-blur-xs">
            Guardian & Parent Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Namaste, {currentUser?.name || "Murugan"}! 👨‍👧
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-lg">
            Monitoring daily education & screen-time metrics for your child, <span className="font-bold text-white">Sanjay (Class 8)</span>.
          </p>
        </div>

        <button
          onClick={() => setShowMessageModal(true)}
          className="px-5 py-3 rounded-2xl bg-white text-teal-900 font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-teal-50 transition active:scale-95 shrink-0"
        >
          <MessageSquare className="w-4 h-4 text-teal-700" />
          <span>Message Headmaster / Teacher</span>
        </button>
      </div>

      {/* Child KPI snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Weekly Attendance</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">7 / 7 days active</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Continuous Streak</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-orange-500" />
            <span>{streak} Days</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">No missed classes</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Knowledge XP & Level</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center gap-1">
            <Zap className="w-5 h-5 fill-amber-500" />
            <span>Lvl {level}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">{xp} Total Knowledge XP</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Productive Study Time</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">62 mins/day</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Target: 45 mins</span>
        </div>
      </div>

      {/* Main Grid: Milestones and Teacher Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Child Milestones */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Learning Milestones & Honors</h3>
              <p className="text-xs text-slate-500">Live notifications of your child's triumphs</p>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${m.color}`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">{m.title}</p>
                  <p className="text-[11px] text-slate-400">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Notes & Guidance */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Remarks from Master Anand</h3>
                <p className="text-xs text-slate-500">Head STEM & Rural Literacy Coordinator</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs text-teal-950 space-y-3 leading-relaxed mb-4">
              <p className="italic">
                "Sanjay is showing remarkable understanding in practical fractions and solar principles. He also helps other village kids download offline lesson packets onto their phones."
              </p>
              <div className="pt-2 border-t border-teal-200/60 font-bold text-teal-900 flex justify-between">
                <span>Recommendation:</span>
                <span>Encourage 15 mins daily of spoken English</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowMessageModal(true)}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Reply to Teacher</span>
          </button>
        </div>

      </div>

      {/* Message Teacher Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-black text-base text-slate-900">
              Message to Master Anand Sharma
            </h3>
            <p className="text-xs text-slate-500">
              Send a question or update about Sanjay's study schedule or health.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={4}
                required
                value={teacherMessage}
                onChange={(e) => setTeacherMessage(e.target.value)}
                placeholder="Namaste Masterji, Sanjay completed the practical experiment today..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-teal-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={messageSent}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {messageSent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
