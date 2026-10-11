import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Hand, Minimize2, Maximize2, X } from 'lucide-react';

export default function SignLanguageModal() {
  const { signLanguageOverlay, setSignLanguageOverlay } = useAccessibility();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSignGesture, setActiveSignGesture] = useState("Greetings");

  useEffect(() => {
    const gestures = ["Welcome", "Learn", "Maths", "Science", "Practice", "Great Job!"];
    if (!signLanguageOverlay) return;
    const interval = setInterval(() => {
      setActiveSignGesture(gestures[Math.floor(Math.random() * gestures.length)]);
    }, 2800);
    return () => clearInterval(interval);
  }, [signLanguageOverlay]);

  if (!signLanguageOverlay) return null;

  return (
    <div 
      className={`fixed bottom-5 right-5 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-brand-400 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-48 h-14' : 'w-64 sm:w-72'
      }`}
      role="region"
      aria-label="Sign Language Interpreter Overlay"
    >
      {/* Header Bar */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
          <Hand className="w-4 h-4 text-brand-400" />
          <span>Sign Language PIP</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:text-white rounded"
            aria-label={isMinimized ? "Expand Sign Language" : "Minimize Sign Language"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setSignLanguageOverlay(false)}
            className="p-1 hover:text-rose-400 rounded"
            aria-label="Close Sign Language Interpreter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 bg-slate-950 flex flex-col items-center">
          {/* Animated Avatar Visual */}
          <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-brand-500 flex flex-col items-center justify-center relative overflow-hidden mb-2">
            {/* SVG stylized Sign Language Avatar */}
            <svg className="w-20 h-20 text-brand-400 animate-pulse-glow" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="30" r="18" fill="#38bdf8" />
              <path d="M25 80 C 25 55, 75 55, 75 80 Z" fill="#0284c7" />
              <circle cx="43" cy="28" r="2.5" fill="#0f172a" />
              <circle cx="57" cy="28" r="2.5" fill="#0f172a" />
              {/* Animated hands */}
              <circle cx="30" cy="65" r="8" fill="#38bdf8" className="animate-bounce" />
              <circle cx="70" cy="65" r="8" fill="#38bdf8" className="animate-pulse" />
            </svg>
            <span className="absolute bottom-1 bg-black/70 px-2 py-0.5 rounded text-[9px] font-bold text-brand-300">
              ISL Live
            </span>
          </div>

          <div className="w-full text-center">
            <div className="text-[11px] font-medium text-slate-400">Current Gesture:</div>
            <div className="text-xs font-extrabold text-brand-300 tracking-wide bg-slate-800/80 px-2 py-1 rounded mt-0.5">
              "{activeSignGesture}"
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Indian Sign Language (ISL) sync for deaf/hard-of-hearing students.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
