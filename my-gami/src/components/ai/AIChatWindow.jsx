import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useLanguage } from '../../context/LanguageContext';
import { useOfflineSync } from '../../context/OfflineContext';
import { useXP } from '../../context/GamificationContext';
import SuggestedChips from './SuggestedChips';
import GoogleMeetClassroomModal from './GoogleMeetClassroomModal';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  WifiOff, 
  Zap,
  Video,
  ExternalLink
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AIChatWindow({ initialQuery = '' }) {
  const { currentUser } = useAuth();
  const { isListening, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const { language, speak } = useLanguage();
  const { isOnline } = useOfflineSync();
  const { addXP } = useXP();

  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const [meetTopic, setMeetTopic] = useState("C++ Pointers & Dynamic Memory Allocation");

  const [messages, setMessages] = useState([
    {
      id: "m-0",
      sender: "ai",
      text: "Namaste! I am your AI Teacher & Engineering Study Companion. I can conduct live lectures for you via Google Meet, demonstrate C++, Java, and Docker code with interactive slides, or answer doubts anytime!",
      timestamp: "Just now",
      meetData: {
        title: "C++ Pointers & Dynamic Memory Allocation",
        code: "meet.google.com/gam-cs26-edu",
        time: "Live Session Ready"
      },
      steps: [
        "1. Click 'Join AI Teacher Google Meet' to enter the live interactive classroom with video & slides.",
        "2. Ask any programming or conceptual question via text or mic in your regional language.",
        "3. Works online and with offline heuristic fallback!"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("c++") || q.includes("pointer") || q.includes("memory") || q.includes("meet") || q.includes("class") || q.includes("teach") || q.includes("lesson")) {
      return {
        text: "🎓 AI Teacher Google Meet Lecture: C++ Pointers & Dynamic Memory Architecture",
        meetData: {
          title: "C++ Pointers & Dynamic Memory Allocation",
          code: "meet.google.com/gam-cs26-edu",
          time: "Live Session Ready"
        },
        steps: [
          "1. What is a Pointer? A variable that stores the memory address (hexadecimal) of another variable. Syntax: int* ptr = &val;",
          "2. Dereference Operator (*): Accesses the value residing at the address pointed by ptr. *ptr = 100;",
          "3. Dynamic Heap Allocation: Use 'new' to allocate on heap (int* arr = new int[5];) and always pair with 'delete[] arr;' to prevent memory leaks.",
          "4. Smart Pointers (Modern C++): Prefer std::unique_ptr and std::shared_ptr from <memory> for automatic RAII cleanup without manual delete."
        ],
        tip: "Click 'Join AI Teacher Google Meet' to enter the live classroom with slides, code demo, and audio voice!"
      };
    }

    if (q.includes("java") || q.includes("oop") || q.includes("interface")) {
      return {
        text: "🎓 AI Teacher Google Meet Lecture: Java Object-Oriented Principles & Interfaces",
        meetData: {
          title: "Java OOP & Interface Architecture",
          code: "meet.google.com/gam-cs26-edu",
          time: "Live Session Ready"
        },
        steps: [
          "1. Encapsulation: Keep class fields private and expose getters/setters to safeguard internal object state.",
          "2. Inheritance: Use 'extends' to inherit common attributes and methods from a superclass (e.g., class Dog extends Animal).",
          "3. Polymorphism: Method Overriding (runtime) and Overloading (compile-time) allow polymorphic method calls.",
          "4. Interfaces: Define contract behaviors using 'interface'. Multiple interfaces can be implemented by a single class via 'implements'."
        ],
        tip: "Click 'Join AI Teacher Google Meet' to inspect the live interface hierarchy!"
      };
    }

    if (q.includes("docker") || q.includes("container") || q.includes("image")) {
      return {
        text: "🎓 AI Teacher Google Meet Lecture: Docker Containers & Multi-Stage Builds",
        meetData: {
          title: "Docker Multi-Stage Production Builds",
          code: "meet.google.com/gam-cs26-edu",
          time: "Live Session Ready"
        },
        steps: [
          "1. Image vs Container: An Image is a read-only blueprint (class), while a Container is a runnable running instance (object).",
          "2. Dockerfile Essentials: FROM node:20-alpine -> WORKDIR /app -> COPY package*.json ./ -> RUN npm install -> COPY . . -> CMD ['npm', 'start']",
          "3. Multi-Stage Builds: Build your React or .NET binary in a heavy SDK stage, then copy only production artifacts into a slim runtime image.",
          "4. Useful Commands: 'docker build -t myapp .', 'docker run -p 3000:3000 myapp', and 'docker ps' to monitor containers."
        ],
        tip: "Click 'Join AI Teacher Google Meet' to view the live Docker multi-stage build!"
      };
    }

    if (q.includes("git") || q.includes("branch") || q.includes("merge") || q.includes("conflict")) {
      return {
        text: "🎓 AI Teacher Google Meet Lecture: Git Branching & Merge Conflict Resolution",
        meetData: {
          title: "Git Branching & Merge Conflicts",
          code: "meet.google.com/gam-cs26-edu",
          time: "Live Session Ready"
        },
        steps: [
          "1. Branching: Create and switch to a feature branch using 'git checkout -b feature/auth' or 'git switch -c feature/auth'.",
          "2. Commit Hygiene: Make atomic, purposeful commits with clear messages ('git commit -m \"feat: implement JWT token validation\"').",
          "3. Resolving Conflicts: Open conflicted files, locate <<<<<<< HEAD and >>>>>>> markers, select the desired code, save, run 'git add .', and finish with 'git commit'.",
          "4. Interactive Rebase: Use 'git rebase -i HEAD~3' to squash and tidy dirty commits before opening a GitHub Pull Request."
        ],
        tip: "Click 'Join AI Teacher Google Meet' to review the interactive branch conflict resolution!"
      };
    }

    if (q.includes("fraction") || q.includes("divide") || q.includes("half") || q.includes("math")) {
      return {
        text: "Here is how fractions work in simple everyday terms:",
        steps: [
          "Step 1: A fraction has two parts — Numerator (top) and Denominator (bottom).",
          "Step 2: Think of a 100 kg sack of wheat. If you split it into 4 equal sacks, each sack is 1/4th (25 kg).",
          "Step 3: To add fractions with identical denominators: 1/4 + 2/4 = 3/4 (75% or 75 kg).",
          "Step 4: When calculating market totals, always simplify: 50/100 = 1/2."
        ],
        tip: "Practice tip: Look at weekly vegetable market prices to test your mental fraction math!"
      };
    }

    if (q.includes("photo") || q.includes("plant") || q.includes("sun") || q.includes("leaf") || q.includes("science")) {
      return {
        text: "Photosynthesis is the miraculous food-making process inside crop leaves:",
        steps: [
          "Step 1: Chlorophyll inside green chloroplast cells captures solar light energy.",
          "Step 2: Roots absorb water (H₂O) from the soil, while leaf pores (stomata) take in carbon dioxide (CO₂).",
          "Step 3: Using sunlight, the leaf transforms these into glucose (plant food) and oxygen (O₂).",
          "Step 4: Formula: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂."
        ],
        tip: "Keep crop leaves clean of heavy dust so stomata can breathe freely!"
      };
    }

    if (q.includes("upi") || q.includes("bank") || q.includes("pin") || q.includes("scam") || q.includes("money")) {
      return {
        text: "The Most Important Rural Cyber Safety Rule:",
        steps: [
          "Rule 1: Your UPI PIN is only for SENDING money out of your account.",
          "Rule 2: You NEVER need to enter your UPI PIN to RECEIVE payments or government DBT funds.",
          "Rule 3: If a caller asks for an OTP or says you won a lottery, hang up immediately.",
          "Rule 4: Always confirm the shop name before clicking Pay."
        ],
        tip: "Emergency cyber helpline across India is 1930."
      };
    }

    if (q.includes("compost") || q.includes("soil") || q.includes("farm") || q.includes("agri")) {
      return {
        text: "Making High-Yield Organic Vermicompost at Home:",
        steps: [
          "Step 1: Choose a shaded spot protected from heavy rain and direct harsh sunlight.",
          "Step 2: Layer dry agricultural residue (straw, dry neem leaves) 6 inches high for carbon.",
          "Step 3: Add decomposed cattle dung and sprinkle water to maintain 60% dampness.",
          "Step 4: Introduce earthworms (Eisenia fetida); in 45 days, you get dark, odorless vermicompost."
        ],
        tip: "Vermicompost saves up to 35% on chemical urea costs while retaining soil moisture."
      };
    }

    return {
      text: `Great question about "${query}". Here is the structured breakdown:`,
      steps: [
        "1. Core Principle: Focus on understanding the foundational building blocks.",
        "2. Application: Relate this concept to practical situations in your community.",
        "3. Review: Solve 2 quick practice problems to lock in your memory."
      ],
      tip: "You earned +15 XP for pursuing knowledge and asking doubts!"
    };
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: `m-usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setTranscript("");
    setIsTyping(true);

    if (isOnline) {
      try {
        const studentId = currentUser?.id || 'usr-student-01';
        const res = await api.aiTutor.ask(studentId, query, language || 'en');
        if (res && res.success && res.data) {
          const aiMsg = {
            id: `m-ai-${Date.now()}`,
            sender: "ai",
            text: res.data.answerText || res.data.explanation || "Here is your guided explanation:",
            steps: res.data.stepByStepGuide || (res.data.stepsJson ? JSON.parse(res.data.stepsJson) : []),
            tip: res.data.studyTip || "Review this step-by-step to solidify your understanding!",
            timestamp: "Just now"
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
          addXP(15, "Curious Mind Bonus! 🧠", "Earned 15 XP for asking your AI tutor");
          return;
        }
      } catch (err) {
        console.warn("Backend AI Tutor request failed; activating offline heuristic tutor.", err);
      }
    }

    // Heuristic reasoning engine fallback for rural/offline learning
    setTimeout(() => {
      const responseData = generateAIResponse(query);
      const aiMsg = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        text: responseData.text,
        meetData: responseData.meetData,
        steps: responseData.steps,
        tip: responseData.tip,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      addXP(15, "Curious Mind Bonus! 🧠", "Earned 15 XP for asking your AI tutor");
    }, 600);
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((speechResult) => {
        handleSend(speechResult);
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>Rural AI Doubt Solver</span>
              {!isOnline && (
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> Offline Pack Active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-purple-200">
              Multilingual & Voice-Enabled • 24/7 Academic Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setMeetTopic("C++ Pointers & Dynamic Memory Allocation");
              setIsMeetModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-sm active:scale-95"
            title="Launch Google Meet Live Classroom with AI Teacher"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Google Meet Class</span>
            <span className="sm:hidden">Meet</span>
          </button>

          <span className="bg-white/10 px-2 py-1 rounded-lg text-purple-100 items-center gap-1 font-semibold hidden md:flex">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>+15 XP</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-purple-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2.5'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] opacity-75">
                  {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                </span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speak(msg.text + (msg.steps ? ' ' + msg.steps.join(' ') : ''))}
                    className="text-slate-400 hover:text-purple-600 p-1"
                    title="Read answer out loud"
                    aria-label="Read answer out loud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="leading-relaxed">{msg.text}</p>

              {/* Google Meet Live Classroom Invitation Card */}
              {msg.meetData && (
                <div className="my-2 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-3 sm:p-4 text-white border border-emerald-500/50 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-xs">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-white">Google Meet Classroom</span>
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-black px-1.5 py-0.2 rounded-full">
                            LIVE
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{msg.meetData.code}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-200 font-semibold bg-white/10 px-2 py-0.5 rounded-md hidden sm:inline">
                      {msg.meetData.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">
                    The AI Teacher is holding a live interactive session on <strong>{msg.meetData.title}</strong> with presentation slides, code walkthroughs, and audio lecture.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        setMeetTopic(msg.meetData.title);
                        setIsMeetModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join AI Teacher Google Meet</span>
                    </button>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition flex items-center gap-1"
                      title="Launch official external Google Meet tab"
                    >
                      <ExternalLink className="w-3 h-3 text-blue-400" />
                      <span className="hidden sm:inline">External Meet</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Step by step cards */}
              {msg.steps && (
                <div className="space-y-1.5 pt-1">
                  {msg.steps.map((step, sIdx) => (
                    <div key={sIdx} className="bg-purple-50/70 border border-purple-100 p-2 rounded-xl text-purple-950 text-xs font-medium flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {msg.tip && (
                <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                  💡 {msg.tip}
                </div>
              )}

              <span className={`text-[9px] block text-right mt-1 ${
                msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <Bot className="w-4 h-4 text-purple-600 animate-spin" />
            <span>AI Tutor is thinking and formatting explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips footer */}
      <div className="p-3 bg-white border-t border-slate-100">
        <SuggestedChips onSelectChip={(chip) => handleSend(chip)} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={handleMicToggle}
          className={`p-3 rounded-2xl transition active:scale-95 flex items-center justify-center shrink-0 ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
          title={isListening ? "Listening... click to stop" : "Speak question with voice"}
          aria-label="Voice input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Type your question or math doubt here..."}
          className="flex-1 bg-slate-100 border border-slate-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 transition outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim()}
          className="p-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition shadow-sm active:scale-95 shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Google Meet Live Classroom Modal */}
      <GoogleMeetClassroomModal
        isOpen={isMeetModalOpen}
        onClose={() => setIsMeetModalOpen(false)}
        topic={meetTopic}
        studentName={currentUser?.name || "Sanjay"}
      />
    </div>
  );
}
