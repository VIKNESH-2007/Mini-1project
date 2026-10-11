import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AIChatWindow from '../components/ai/AIChatWindow';
import { Sparkles, WifiOff, ArrowLeft, Lightbulb, Bot, GraduationCap, Video } from 'lucide-react';
import { useOfflineSync } from '../context/OfflineContext';
import { useAuth } from '../context/AuthContext';

export default function AITutorPage() {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic') || '';
  const modeParam = searchParams.get('mode') || 'class'; // 'class' or 'doubt'
  const { isOnline } = useOfflineSync();
  const { currentUser } = useAuth();

  const [activeMode, setActiveMode] = useState(modeParam === 'class' ? 'class' : 'doubt');
  const [activeTopicPrompt, setActiveTopicPrompt] = useState(
    topicParam ? `Can you explain the key points of ${topicParam}?` : ''
  );

  const classroomLectures = [
    {
      title: "Lecture 1: C++ Pointers & Memory Management",
      subject: "C++ Programming",
      prompt: "Hello AI Teacher! Please conduct today's class on C++ Pointers and Dynamic Memory Allocation with line-by-line code examples."
    },
    {
      title: "Lecture 2: Java OOP & Interface Architecture",
      subject: "Java Enterprise",
      prompt: "Hello AI Teacher! Please conduct today's class on Java Object-Oriented Programming, Polymorphism, and Interfaces."
    },
    {
      title: "Lecture 3: Docker Containers & Multi-Stage Builds",
      subject: "Cloud & DevOps",
      prompt: "Hello AI Teacher! Please conduct today's class on Docker Containers, Dockerfiles, and multi-stage production builds."
    },
    {
      title: "Lecture 4: Git Branching & Merge Conflicts",
      subject: "Developer Tools",
      prompt: "Hello AI Teacher! Please conduct today's class on Git branching strategies, rebasing, and resolving merge conflicts step-by-step."
    }
  ];

  const handleStartClassLecture = (lecturePrompt) => {
    setActiveMode('class');
    setActiveTopicPrompt(lecturePrompt);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>24/7 AI Teacher Classroom</span>
            </span>
            {currentUser?.learningTrack === 'self' && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Self-Paced Track Active
              </span>
            )}
            {!isOnline && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                <span>Offline Cached Engine</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {activeMode === 'class' ? "AI Teacher Live Classroom 🎓" : "AI Doubt Solver Room 💡"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeMode === 'class'
              ? "For self-paced students: The AI Teacher conducts interactive lectures via Google Meet, explains code step-by-step, and tests your understanding."
              : "Ask any programming question or doubt using text or voice in your regional Indian language."}
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Google Meet Live Virtual Classroom Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                GOOGLE MEET LIVE CLASSROOM
              </span>
              <span className="text-[10px] text-slate-300 font-mono hidden md:inline">
                meet.google.com/gam-cs26-edu
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              Live AI Teacher Lectures & Interactive Code Demonstration
            </h2>
            <p className="text-xs text-slate-300">
              The AI Teacher conducts lessons via Google Meet with interactive slides, line-by-line code explanation, and voice audio!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleStartClassLecture("Hello AI Teacher! Please conduct today's class on C++ Pointers and Dynamic Memory Allocation")}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span>Launch Google Meet Lesson</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveMode('class')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
            activeMode === 'class' 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>AI Teacher Classroom Mode</span>
        </button>

        <button
          onClick={() => setActiveMode('doubt')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
            activeMode === 'doubt' 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>General Doubt Solver</span>
        </button>
      </div>

      {/* Recommended Lectures Banner for AI Teacher Mode */}
      {activeMode === 'class' && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <h3 className="font-extrabold text-sm sm:text-base text-purple-100">
              Select a Topic for the AI Teacher to Teach You in Google Meet:
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            {classroomLectures.map((lec) => (
              <button
                key={lec.title}
                onClick={() => handleStartClassLecture(lec.prompt)}
                className="text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition active:scale-95 group"
              >
                <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold mb-1">
                  <span>{lec.subject}</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-emerald-300">
                    <Video className="w-3 h-3" />
                    <span>Google Meet Class →</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-purple-200 transition">
                  {lec.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <AIChatWindow 
        key={activeTopicPrompt} 
        initialQuery={activeTopicPrompt} 
      />

      {/* Helpful Rural Learning Tips */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <h4 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>AI Teacher Class Features</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">1. Line-by-Line Code Review</span>
            <span>Ask the AI Teacher to inspect your C++, Java, or Docker commands and explain syntax.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">2. Voice Interaction</span>
            <span>Speak via microphone in Hindi, Tamil, Telugu, Marathi, or English.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">3. Offline Ready</span>
            <span>Lectures and explanations work smoothly on low-bandwidth rural connections.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
