import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, Check, X, ArrowRight, Lightbulb, Zap } from 'lucide-react';

export default function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswerSelected,
  onNext,
  isLastQuestion
}) {
  const { speak } = useLanguage();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === question.correctIndex;
    onAnswerSelected(isCorrect, question.xp);
  };

  const handleReadAloud = () => {
    const text = `${question.question}. Option 1: ${question.options[0]}. Option 2: ${question.options[1]}. Option 3: ${question.options[2]}. Option 4: ${question.options[3]}.`;
    speak(text);
  };

  const handleProceed = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm max-w-2xl mx-auto">
      {/* Top row: Progress, XP chip, Audio readout */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            +{question.xp} XP
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReadAloud}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition"
            title="Read question out loud (Text to Speech)"
            aria-label="Read question and options aloud"
          >
            <Volume2 className="w-4 h-4 text-brand-600" />
          </button>
          {question.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 rounded-full text-amber-600 hover:bg-amber-50 transition"
              title="Show Hint"
              aria-label="Show hint"
            >
              <Lightbulb className="w-4 h-4 fill-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Hint Banner if toggled */}
      {showHint && question.hint && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Hint: </span>
            {question.hint}
          </div>
        </div>
      )}

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
        {question.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6" role="radiogroup" aria-label="Quiz Options">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;

          let optionStyle = "border-slate-200 hover:border-brand-400 hover:bg-slate-50 text-slate-800";

          if (isAnswerSubmitted) {
            if (isCorrect) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400";
            } else if (isSelected && !isCorrect) {
              optionStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400";
            } else {
              optionStyle = "border-slate-200 opacity-60 text-slate-500";
            }
          } else if (isSelected) {
            optionStyle = "border-brand-500 bg-brand-50/70 text-brand-950 font-bold ring-2 ring-brand-400";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm ${optionStyle}`}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                  isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>

              {isAnswerSubmitted && isCorrect && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {isAnswerSubmitted && isSelected && !isCorrect && (
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <X className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box when submitted */}
      {isAnswerSubmitted && (
        <div className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm animate-in fade-in ${
          selectedOption === question.correctIndex 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border border-rose-200 text-rose-900'
        }`}>
          <div className="font-extrabold flex items-center gap-1.5 mb-1">
            {selectedOption === question.correctIndex ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Correct! +{question.xp} XP Earned!</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-rose-600" />
                <span>Not quite right. Let's learn why:</span>
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-95">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-end gap-3">
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-sm shadow-md shadow-brand-200 transition active:scale-95"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md shadow-brand-200 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{isLastQuestion ? "Finish Quiz & See Results" : "Next Question"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
