import React, { useState, useEffect } from 'react';
import { mockQuizzes } from '../data/mockQuizzes';
import QuizCard from '../components/quiz/QuizCard';
import QuizSummary from '../components/quiz/QuizSummary';
import { useXP } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';
import { useOfflineSync } from '../context/OfflineContext';
import { Timer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function QuizPage() {
  const { currentUser } = useAuth();
  const [activeQuiz, setActiveQuiz] = useState(mockQuizzes[0]);
  const { addXP, fireConfetti } = useXP();
  const { isOnline, recordOfflineQuiz } = useOfflineSync();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalXpGained, setTotalXpGained] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeQuiz.timeLimitSeconds || 60);

  // Load quiz from backend when online
  useEffect(() => {
    async function loadBackendQuiz() {
      try {
        const res = await api.quizzes.getAll();
        if (res && res.success && res.data && res.data.length > 0) {
          const q = res.data[0];
          setActiveQuiz({
            id: q.id,
            title: q.title,
            subject: q.subject || 'Daily Challenge',
            timeLimitSeconds: q.timeLimitSeconds || 60,
            totalXp: q.totalXp || 100,
            questions: (q.questions || []).map(item => ({
              id: item.id,
              question: item.questionText,
              text: item.questionText,
              options: typeof item.optionsJson === 'string' ? JSON.parse(item.optionsJson) : (item.options || []),
              correctIndex: item.correctOption,
              correctAnswer: item.correctOption,
              hint: item.hintText,
              explanation: item.explanationText,
              xp: item.xpValue || 25
            }))
          });
        }
      } catch (err) {
        console.warn('Backend quiz unreachable; using offline cache:', err);
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
    setTimeLeft(activeQuiz.timeLimitSeconds || 60);
  };

  const currentQ = activeQuiz.questions[currentQuestionIdx];
  const isLast = currentQuestionIdx === activeQuiz.questions.length - 1;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </Link>

        {/* Timer Bar */}
        {!isQuizCompleted && (
          <div className="flex items-center gap-2">
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
