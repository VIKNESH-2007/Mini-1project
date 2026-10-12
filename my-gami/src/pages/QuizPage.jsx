import React, { useState, useEffect } from 'react';
import { mockQuizzes } from '../data/mockQuizzes';
import QuizCard from '../components/quiz/QuizCard';
import QuizSummary from '../components/quiz/QuizSummary';
import { useXP } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';
import { useOfflineSync } from '../context/OfflineContext';
import { Timer, ArrowLeft, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function QuizPage() {
  const { currentUser } = useAuth();
  const [quizzesList, setQuizzesList] = useState(mockQuizzes);
  const [selectedQuizId, setSelectedQuizId] = useState(mockQuizzes[0].id);
  const activeQuiz = quizzesList.find(q => q.id === selectedQuizId) || quizzesList[0];

  const { addXP, fireConfetti } = useXP();
  const { isOnline, recordOfflineQuiz } = useOfflineSync();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalXpGained, setTotalXpGained] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeQuiz.timeLimitSeconds || 300);

  // Load quiz from backend when online if backend has comprehensive question set
  useEffect(() => {
    async function loadBackendQuiz() {
      try {
        const res = await api.quizzes.getAll();
        if (res && res.success && res.data && res.data.length > 0) {
          const q = res.data[0];
          const mappedQuestions = (q.questions || []).map(item => ({
            id: item.id,
            question: item.questionText,
            text: item.questionText,
            options: typeof item.optionsJson === 'string' ? JSON.parse(item.optionsJson) : (item.options || []),
            correctIndex: item.correctOption,
            correctAnswer: item.correctOption,
            hint: item.hintText,
            explanation: item.explanationText,
            xp: item.xpValue || 25
          }));

          if (mappedQuestions.length >= mockQuizzes[0].questions.length) {
            setQuizzesList(prev => [
              {
                id: q.id,
                title: q.title,
                category: q.subject || 'All Subjects Mega Quiz',
                timeLimitSeconds: q.timeLimitSeconds || 300,
                totalXP: q.totalXp || 500,
                questions: mappedQuestions
              },
              ...prev.slice(1)
            ]);
          }
        }
      } catch (err) {
        console.warn('Backend quiz unreachable; using rich local quiz bank:', err);
      }
    }
    if (isOnline) {
      loadBackendQuiz();
    }
  }, [isOnline]);

  // Countdown timer
  useEffect(() => {
    if (isQuizCompleted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizCompleted, timeLeft]);

  const handleSelectQuizTrack = (quizId) => {
    const chosen = quizzesList.find(q => q.id === quizId) || quizzesList[0];
    setSelectedQuizId(chosen.id);
    setCurrentQuestionIdx(0);
    setCorrectAnswersCount(0);
    setTotalXpGained(0);
    setIsQuizCompleted(false);
    setTimeLeft(chosen.timeLimitSeconds || 300);
  };

  const handleAnswerSelected = (isCorrect, xp) => {
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setTotalXpGained(prev => prev + xp);
      addXP(xp, "Correct Answer! 🌟", `+${xp} XP added to your total`);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsQuizCompleted(true);
      fireConfetti();
      if (isOnline) {
        try {
          await api.quizzes.submit({
            quizId: activeQuiz.id,
            studentId: currentUser?.id || 'usr-student-01',
            score: correctAnswersCount + 1,
            totalQuestions: activeQuiz.questions.length,
            answers: []
          });
        } catch (err) {
          console.warn('Could not post quiz attempt to server, saved locally:', err);
          recordOfflineQuiz();
        }
      } else {
        recordOfflineQuiz();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setCorrectAnswersCount(0);
    setTotalXpGained(0);
    setIsQuizCompleted(false);
    setTimeLeft(activeQuiz.timeLimitSeconds || 300);
  };

  const currentQ = activeQuiz.questions[currentQuestionIdx];
  const isLast = currentQuestionIdx === activeQuiz.questions.length - 1;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Quiz Track Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </Link>

        {/* Quiz Category Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span>Quiz Bank:</span>
          </span>
          {quizzesList.map((qz) => {
            const isSelected = qz.id === activeQuiz.id;
            return (
              <button
                key={qz.id}
                type="button"
                onClick={() => handleSelectQuizTrack(qz.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {qz.category} ({qz.questions.length} Qs)
              </button>
            );
          })}
        </div>

        {/* Timer Bar */}
        {!isQuizCompleted && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black shadow-xs ${
              timeLeft < 20 
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Card or Summary */}
      {!isQuizCompleted ? (
        <QuizCard
          question={currentQ}
          questionIndex={currentQuestionIdx}
          totalQuestions={activeQuiz.questions.length}
          onAnswerSelected={handleAnswerSelected}
          onNext={handleNextQuestion}
          isLastQuestion={isLast}
        />
      ) : (
        <QuizSummary
          score={correctAnswersCount}
          totalQuestions={activeQuiz.questions.length}
          xpEarned={totalXpGained}
          onRetry={handleRetry}
        />
      )}

    </div>
  );
}
