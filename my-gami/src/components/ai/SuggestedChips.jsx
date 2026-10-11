import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedChips({ onSelectChip }) {
  const chips = [
    "🎥 Conduct Google Meet class on C++ Pointers & Memory",
    "🎥 Conduct Google Meet class on Java OOP & Interfaces",
    "🎥 Conduct Google Meet class on Docker & DevOps",
    "Explain C++ Pointer arithmetic step-by-step",
    "What is the difference between malloc and new in C++?",
    "How to prevent memory leaks with smart pointers?"
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
        <span>Suggested AI Teacher Lectures & Google Meet Lessons</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelectChip(chip)}
            className="text-xs text-slate-700 bg-slate-100 hover:bg-purple-100 hover:text-purple-900 border border-slate-200 px-3 py-1.5 rounded-full transition text-left active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
