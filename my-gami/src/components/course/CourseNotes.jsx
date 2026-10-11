import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Volume2, Bot, CheckCircle2, Bookmark } from 'lucide-react';

export default function CourseNotes({ course }) {
  const { speak } = useLanguage();
  const navigate = useNavigate();
  const { aiNotes } = course;

  if (!aiNotes) return null;

  const handleReadNotes = () => {
    const textToRead = `${aiNotes.summary}. Key concepts include: ${aiNotes.keyPoints.join('. ')}`;
    speak(textToRead);
  };

  const handleAskTutor = () => {
    navigate(`/ai-tutor?topic=${encodeURIComponent(course.title)}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">AI Lesson Summary</h3>
            <p className="text-[11px] text-slate-500">Auto-extracted key knowledge points</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReadNotes}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            title="Read summary out loud (Audio guide)"
            aria-label="Read AI Notes out loud"
          >
            <Volume2 className="w-4 h-4 text-brand-600" />
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-xs text-purple-950 leading-relaxed">
        {aiNotes.summary}
      </div>

      {/* Key Concepts */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-brand-600" />
          <span>Core Concepts to Remember</span>
        </h4>
        <ul className="space-y-2">
          {aiNotes.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulas if present */}
      {aiNotes.formulas && aiNotes.formulas.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
          <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
            Formulas & Rules
          </span>
          {aiNotes.formulas.map((formula, idx) => (
            <code key={idx} className="block text-xs font-mono font-bold text-amber-950 bg-amber-100/70 px-2 py-1 rounded mt-1">
              {formula}
            </code>
          ))}
        </div>
      )}

      {/* Ask AI Tutor CTA */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={handleAskTutor}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Tutor About "{course.title}"</span>
        </button>
      </div>
    </div>
  );
}
