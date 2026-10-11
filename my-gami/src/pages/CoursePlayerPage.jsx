import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCourses } from '../data/mockCourses';
import VideoPlayer from '../components/course/VideoPlayer';
import CourseNotes from '../components/course/CourseNotes';
import { useXP } from '../context/GamificationContext';
import { 
  ArrowLeft, 
  HelpCircle, 
  Award, 
  Check,
  ChevronRight
} from 'lucide-react';

export default function CoursePlayerPage() {
  const { id } = useParams();
  const { addXP } = useXP();

  const course = mockCourses.find(c => c.id === id) || mockCourses[0];
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([0]);

  const currentLesson = course.lessons[currentLessonIndex] || course.lessons[0];
  const isLessonCompleted = completedLessons.includes(currentLessonIndex);

  const handleCompleteLesson = () => {
    if (!isLessonCompleted) {
      setCompletedLessons(prev => [...prev, currentLessonIndex]);
      addXP(50, `Lesson Completed! 🎉`, `You finished ${currentLesson.title}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Back and Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Library</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${course.subjectColor}`}>
            {course.subject}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {course.grade}
          </span>
        </div>
      </div>

      {/* Main Grid: Player (2 cols) & AI Notes / Playlist (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video Player + Lesson Controls */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer course={course} currentLesson={currentLesson} />

          {/* Current Lesson Info Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold text-brand-600 uppercase tracking-wider block">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {currentLesson.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instructor: {course.instructor} • Duration: {currentLesson.duration}
                </p>
              </div>

              {/* Complete & Claim XP button */}
              <button
                onClick={handleCompleteLesson}
                disabled={isLessonCompleted}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isLessonCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 text-white active:scale-95 shadow-brand-200'
                }`}
              >
                {isLessonCompleted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Completed (+50 XP Claimed)</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Mark Complete & Claim +50 XP</span>
                  </>
                )}
              </button>
            </div>

            {/* Course Description */}
            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {course.description}
            </p>
          </div>

          {/* Lesson Playlist Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>All Lessons in this Module</span>
              <span className="text-xs font-semibold text-brand-600">
                {completedLessons.length}/{course.lessons.length} Finished
              </span>
            </h3>

            <div className="space-y-2">
              {course.lessons.map((les, idx) => {
                const isActive = currentLessonIndex === idx;
                const isDone = completedLessons.includes(idx);

                return (
                  <button
                    key={les.id}
                    onClick={() => setCurrentLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-xs font-bold ${
                      isActive
                        ? 'border-brand-500 bg-brand-50/70 text-brand-950 ring-1 ring-brand-400'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        isDone 
                          ? 'bg-emerald-500 text-white' 
                          : isActive 
                          ? 'bg-brand-600 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span>{les.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span>{les.duration}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Summary & Doubt Solver */}
        <div className="space-y-4">
          <CourseNotes course={course} />

          {/* Quick Quiz CTA linked to this topic */}
          <div className="bg-gradient-to-tr from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-xs">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest px-2 py-0.5 rounded bg-amber-200/70 inline-block mb-2">
              Reinforce Your Learning
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">
              Ready for the Practice Quiz?
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              Test your understanding of {course.title} and climb up the leaderboard standings.
            </p>
            <Link
              to="/quiz"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Topic Quiz (+100 XP)</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
