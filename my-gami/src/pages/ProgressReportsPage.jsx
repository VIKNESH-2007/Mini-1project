import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import { WeeklyTimeChart, SubjectAccuracyBars } from '../components/charts/SimpleBarChart';
import ActivityHeatmap from '../components/charts/ActivityHeatmap';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Printer, 
  Award,
  BookOpen
} from 'lucide-react';

export default function ProgressReportsPage() {
  const { currentUser } = useAuth();
  const { xp, streak, level, badges } = useXP();
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Academic Performance & Metrics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Weekly Progress & Report Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive audit of study hours, quiz accuracy, and subject mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportCardModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official Report Card</span>
          </button>
        </div>
      </div>

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{xp}</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            +320 XP earned this week
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">7.2 hrs</div>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">
            Across 5 rural subjects
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quiz Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">86.4%</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            18/20 Quizzes completed
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Trophies Earned</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{unlockedBadgesCount} / {badges.length}</div>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">
            Level {level} Scholar
          </span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTimeChart />
        <SubjectAccuracyBars />
      </div>

      {/* Activity Heatmap (GitHub-style 30 days) */}
      <ActivityHeatmap streak={streak} />

      {/* Strengths & Growth Areas Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <h4 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Key Academic Strengths</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">Domains where student excels consistently</p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
              <span className="font-bold text-emerald-800">Sustainable Agriculture (94%):</span>
              <span>Exceptional retention of composting ratios and moisture retention concepts.</span>
            </li>
            <li className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
              <span className="font-bold text-emerald-800">Rural Digital Literacy (90%):</span>
              <span>Quick mastery of UPI PIN security, OTP precautions, and cyber scam detection.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <h4 className="font-extrabold text-sm text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Recommended Growth Focus</span>
          </h4>
          <p className="text-xs text-slate-500 mb-4">AI recommended practice topics for this week</p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-start gap-2">
              <span className="font-bold text-amber-800">English Speaking Dialogues:</span>
              <span>Needs more audio pronunciation practice using the microphone voice tutor.</span>
            </li>
            <li className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-start gap-2">
              <span className="font-bold text-amber-800">Decimal to Percentage Conversions:</span>
              <span>Solve 2 additional practice quizzes on market fractions.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Printable Report Card Modal */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-4 border-slate-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header with emblem */}
            <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                Official Student Progress Certificate
              </h3>
              <p className="text-xs text-slate-500">
                GamiLearn Rural Education Initiative • Term Report
              </p>
            </div>

            {/* Student Info Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold block">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Grade & Section</span>
                <span className="font-extrabold text-slate-900">{currentUser?.grade}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">School</span>
                <span className="font-extrabold text-slate-900">{currentUser?.school}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Location</span>
                <span className="font-extrabold text-slate-900">{currentUser?.village}</span>
              </div>
            </div>

            {/* Grades Table */}
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-black">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold">Mathematics</td>
                  <td className="p-3">88%</td>
                  <td className="p-3 text-emerald-600 font-bold">Proficient</td>
                  <td className="p-3 text-right font-black text-brand-600">A</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Science & Ecosystems</td>
                  <td className="p-3">82%</td>
                  <td className="p-3 text-emerald-600 font-bold">Proficient</td>
                  <td className="p-3 text-right font-black text-brand-600">A-</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Sustainable Agriculture</td>
                  <td className="p-3">94%</td>
                  <td className="p-3 text-emerald-600 font-bold">Mastery</td>
                  <td className="p-3 text-right font-black text-emerald-600">A+</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Rural Digital Skills</td>
                  <td className="p-3">90%</td>
                  <td className="p-3 text-emerald-600 font-bold">Mastery</td>
                  <td className="p-3 text-right font-black text-emerald-600">A+</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">English Communication</td>
                  <td className="p-3">74%</td>
                  <td className="p-3 text-amber-600 font-bold">Developing</td>
                  <td className="p-3 text-right font-black text-amber-600">B</td>
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowReportCardModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
