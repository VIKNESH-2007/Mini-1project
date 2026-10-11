import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import { useOfflineSync } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';
import XPBadge from '../components/common/XPBadge';
import { mockCourses } from '../data/mockCourses';
import { mockTimetable } from '../data/mockTimetable';
import { 
  Flame, 
  Zap, 
  Play, 
  HelpCircle, 
  Bot, 
  Trophy, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  DownloadCloud,
  Clock,
  ListTodo,
  GraduationCap
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, switchStudentTrack } = useAuth();
  const { xp, streak, level, levelProgress, badges, addXP, fireConfetti } = useXP();
  const { cachedCourses } = useOfflineSync();
  const { t } = useLanguage();

  const continueCourse = mockCourses[0]; // Active course
  const todayClasses = mockTimetable.slice(0, 3);
  const recentBadges = badges.filter(b => b.unlocked).slice(0, 3);

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('gamilearn_scheduled_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "task-01",
        title: "Implement Doubly Linked List with Head & Tail Pointers",
        subject: "Computer Science",
        category: "Coding Lab",
        priority: "High",
        estimatedMinutes: 60,
        isCompleted: true
      },
      {
        id: "task-02",
        title: "Watch Java Collections & HashMap Bucket Internals",
        subject: "Software Engineering",
        category: "Lecture Review",
        priority: "Medium",
        estimatedMinutes: 45,
        isCompleted: true
      },
      {
        id: "task-03",
        title: "Dockerize React Frontend & ASP.NET Core API",
        subject: "Cloud & DevOps",
        category: "Project Sprint",
        priority: "High",
        estimatedMinutes: 90,
        isCompleted: false
      },
      {
        id: "task-04",
        title: "Git Interactive Rebase & Conflict Resolution Sprint",
        subject: "Developer Tools",
        category: "Coding Lab",
        priority: "Medium",
        estimatedMinutes: 40,
        isCompleted: false
      }
    ];
  });

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const taskProgressRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const handleToggleDashboardTask = (task) => {
    const newStatus = !task.isCompleted;
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, isCompleted: newStatus, completedAt: newStatus ? new Date().toISOString() : null };
      }
      return t;
    });
    setTasks(updated);
    try {
      localStorage.setItem('gamilearn_scheduled_tasks', JSON.stringify(updated));
    } catch (e) {}

    if (newStatus) {
      addXP(40, "Task Completed! 🚀", `+40 XP: Finished "${task.title}"`);
      fireConfetti();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner with Level & Streak */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 text-white shadow-lg overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-32 -top-12 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* User info & welcome */}
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 p-1 border-2 border-white/40 shadow-md object-cover"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-brand-100 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {currentUser?.grade || "Class 8"}
                </span>
                <span className="text-xs text-brand-100 font-medium">
                  {currentUser?.school}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Namaste, {currentUser?.name || "Student"}! 🌾
              </h1>
              <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-md">
                You are on a roll! Keep learning every day to power your village community with knowledge.
              </p>
            </div>
          </div>

          {/* Gamified Streak & XP widget */}
          <div className="w-full md:w-auto bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between md:justify-center gap-5 shrink-0 shadow-inner">
            {/* Streak */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 text-amber-300 fill-amber-300 animate-flame-streak" />
                <span className="text-2xl font-black text-amber-300">{streak}</span>
              </div>
              <span className="text-[11px] font-bold text-brand-100 uppercase tracking-wider block mt-0.5">
                {t("Day Streak")}
              </span>
            </div>

            <div className="h-10 w-px bg-white/20" />

            {/* Level & XP */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="text-2xl font-black text-white">{level}</span>
              </div>
              <span className="text-[11px] font-bold text-brand-100 uppercase tracking-wider block mt-0.5">
                {t("Current Level")}
              </span>
            </div>
          </div>

        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/20 max-w-2xl">
          <div className="flex justify-between items-center text-xs font-bold text-brand-100 mb-1.5">
            <span>Level {level} Progress ({xp % 150} / 150 XP)</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-extrabold text-white">
              {150 - (xp % 150)} XP to Level {level + 1}
            </span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
            <div 
              className="bg-gradient-to-r from-amber-300 to-yellow-200 h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Dynamic Learning Track & Assigned Instructor Banner */}
      <div className={`rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-sm ${
        currentUser?.learningTrack === 'college' 
          ? 'bg-blue-50/70 border-blue-200' 
          : 'bg-purple-50/70 border-purple-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              currentUser?.learningTrack === 'college' 
                ? 'bg-blue-600 text-white' 
                : 'bg-purple-600 text-white'
            }`}>
              {currentUser?.learningTrack === 'college' ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <Bot className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  currentUser?.learningTrack === 'college' 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-purple-100 text-purple-800 border-purple-300'
                }`}>
                  {currentUser?.learningTrack === 'college' ? t('College Enrolled Track') : t('Self-Paced Track')}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {currentUser?.learningTrack === 'college' 
                    ? (currentUser?.batchName || 'B.Tech CS 2026 - Sec A')
                    : 'Self-Directed Independent Studies'
                  }
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {currentUser?.learningTrack === 'college' ? (
                  <span>Assigned Faculty: {currentUser?.assignedTeacherName || "Prof. Senthil Nathan (CS Dept)"}</span>
                ) : (
                  <span>{t("Active Instructor: AI Teacher (Autonomous 24/7)")}</span>
                )}
              </h2>

              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {currentUser?.learningTrack === 'college' ? (
                  <span>
                    Your curriculum, coding labs, and progress reviews are supervised by college faculty assigned by the Academic Admin.
                  </span>
                ) : (
                  <span>
                    You are learning independently! Your AI Teacher conducts classes on C++, Java, Docker, Git, walks through code, and solves doubts 24/7.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action Button & Track Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            {currentUser?.learningTrack === 'college' ? (
              <Link
                to="/tasks"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 transition active:scale-95"
              >
                <ListTodo className="w-4 h-4" />
                <span>View Faculty Tasks</span>
              </Link>
            ) : (
              <Link
                to="/ai-tutor?mode=class"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-200 transition active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>Enter AI Teacher Class</span>
              </Link>
            )}

            {/* Quick Switch Button */}
            <button
              onClick={() => switchStudentTrack(currentUser?.learningTrack === 'college' ? 'self' : 'college')}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition active:scale-95"
              title="Toggle between Self-Paced (AI Teacher) and College Enrolled (Assigned Faculty)"
            >
              Switch to {currentUser?.learningTrack === 'college' ? 'AI Teacher' : 'Assigned Faculty'}
            </button>
          </div>

        </div>
      </div>

      {/* Quick-Access Cards Grid (4 Action Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Continue Course */}
        <Link
          to={`/course/${continueCourse.id}`}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-400 shadow-xs hover:shadow-md transition group text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                <Play className="w-5 h-5 fill-blue-700 ml-0.5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                In Progress
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
              {continueCourse.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Next: Lesson 2 • Dynamic Arrays & STL Vectors
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
            <span>Resume Lesson</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. Take Daily Quiz */}
        <Link
          to="/quiz"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition group text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                +100 XP
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition">
              Daily Challenge Quiz
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              4 interactive questions on math, crops & digital banking safety.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Play Quiz</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. Ask AI Tutor */}
        <Link
          to="/ai-tutor"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition group text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Voice Ready
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-600 transition">
              Ask AI Doubt Tutor
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have a confusion? Ask questions in your own language anytime.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Ask a Doubt</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 4. Leaderboard */}
        <Link
          to="/leaderboard"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition group text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">
                Rank #5
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition">
              Village Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are in the top 5! Catch up with Rishi & Saran today.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Check Standings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Interactive Scheduled Tasks & Progress Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">Today's Scheduled Tasks & Progress</h3>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {completedTasksCount}/{tasks.length} Done ({taskProgressRate}%)
                </span>
              </div>
              <p className="text-xs text-slate-500">Check off your coding tasks to earn +40 XP each</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgressRate}%` }}
              />
            </div>
            <Link
              to="/tasks"
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center gap-1.5 transition shrink-0"
            >
              <span>Manage Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Task list preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-brand-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggleDashboardTask(task)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition shrink-0 ${
                    task.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-brand-500 bg-white'
                  }`}
                  aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
                >
                  {task.isCompleted && <CheckCircle className="w-3.5 h-3.5 fill-white text-emerald-500" />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {task.subject}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignedBy && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        👨‍🏫 Faculty Assigned
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-bold text-slate-900 truncate mt-0.5 ${
                    task.isCompleted ? 'line-through text-slate-400' : ''
                  }`}>
                    {task.title}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.estimatedMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section: Today's Timetable & Offline Packet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Timetable (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Today's Study Schedule</h3>
                <p className="text-xs text-slate-500">Structured lessons for steady academic progress</p>
              </div>
            </div>

            <Link
              to="/timetable"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
            >
              Full Week
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-10 rounded-full ${item.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                      <span>•</span>
                      <span>{item.room}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : item.status === 'in-progress' ? (
                    <Link
                      to="/courses"
                      className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1 rounded-xl shadow-xs transition"
                    >
                      Study Now
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Upcoming</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Readiness Card (1 column) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Offline Readiness</h3>
                  <p className="text-xs text-slate-500">Zero-data study readiness</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 mb-4 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Downloaded Modules:</span>
                <span className="font-extrabold">{cachedCourses.length} Courses</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Local Storage Used:</span>
                <span>46.1 MB / 2 GB</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed pt-1 border-t border-emerald-200">
                You can turn off mobile data completely. All downloaded courses and quizzes operate seamlessly offline.
              </p>
            </div>
          </div>

          <Link
            to="/courses"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Manage Downloaded Packs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Recent Badges Earned Shelf */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Recent Badges & Achievements</h3>
              <p className="text-xs text-slate-500">Unlock knowledge trophies as you study</p>
            </div>
          </div>

          <Link
            to="/profile"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            View All Badges ({badges.filter(b => b.unlocked).length}/{badges.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentBadges.map((badge) => (
            <XPBadge key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

    </div>
  );
}
