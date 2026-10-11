import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Hand, 
  MessageSquare, 
  ExternalLink, 
  Users, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  ChevronRight, 
  ChevronLeft,
  X,
  Volume2,
  Copy,
  Check,
  Radio,
  Play,
  Pause,
  RefreshCw,
  SlidersHorizontal,
  LayoutGrid,
  Maximize2,
  Tv
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function GoogleMeetClassroomModal({ 
  isOpen, 
  onClose, 
  topic = "C++ Pointers & Dynamic Memory Allocation",
  studentName = "Sanjay"
}) {
  const { 
    speak, 
    stopSpeaking, 
    isSpeaking, 
    speechVolume, 
    setSpeechVolume, 
    speechRate, 
    setSpeechRate, 
    availableVoices, 
    selectedVoiceIndex, 
    setSelectedVoiceIndex,
    playMeetingChime 
  } = useLanguage();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hasUserStartedAudio, setHasUserStartedAudio] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [meetingTimer, setMeetingTimer] = useState(0);
  const [viewMode, setViewMode] = useState('live-video'); // 'live-video' or 'grid'
  const [videoLayoutMode, setVideoLayoutMode] = useState('split'); // 'cinema' or 'split'
  const [drawerOpen, setDrawerOpen] = useState(null); // null, 'chat', or 'attendees'

  // Student Voice Hearing & Live Camera State
  const [isStudentSpeaking, setIsStudentSpeaking] = useState(false);
  const [studentSpeechTranscript, setStudentSpeechTranscript] = useState('');
  const [cameraAccessGranted, setCameraAccessGranted] = useState(false);

  const studentVideoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [liveCaptions, setLiveCaptions] = useState(
    "Prof. AI Teacher: Welcome to today's live Google Meet session! Today we will master core computer engineering principles."
  );

  const meetCode = "meet.google.com/gam-cs26-edu";
  const externalMeetUrl = "https://meet.google.com/new";

  // Classmates and Attendees attending the live lecture
  const attendingStudents = [
    {
      id: "att-you",
      name: `${studentName} (You)`,
      role: "Student",
      isLocal: true,
      isMuted: !isMicOn,
      isVideoOn: isVideoOn,
      isSpeaking: isStudentSpeaking,
      department: "B.Tech Computer Science",
      avatarLetter: studentName.charAt(0) || "S",
      avatarBg: "bg-emerald-600"
    },
    {
      id: "att-rishi",
      name: "Rishi",
      role: "Student",
      isLocal: false,
      isMuted: true,
      isVideoOn: true,
      isSpeaking: false,
      department: "CSE - Year 2",
      avatarLetter: "R",
      avatarBg: "bg-purple-600",
      videoImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "att-saran",
      name: "Saran",
      role: "Student",
      isLocal: false,
      isMuted: true,
      isVideoOn: true,
      isSpeaking: false,
      department: "B.Tech CS Sec A",
      avatarLetter: "S",
      avatarBg: "bg-blue-600",
      videoImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "att-kavitha",
      name: "Kavitha",
      role: "Student",
      isLocal: false,
      isMuted: true,
      isVideoOn: true,
      isSpeaking: false,
      department: "Cloud & DevOps Lab",
      avatarLetter: "K",
      avatarBg: "bg-rose-600",
      videoImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "att-karthik",
      name: "Karthik",
      role: "Student",
      isLocal: false,
      isMuted: true,
      isVideoOn: true,
      isSpeaking: false,
      department: "Systems Engineering",
      avatarLetter: "K",
      avatarBg: "bg-amber-600",
      videoImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "att-deepika",
      name: "Deepika",
      role: "Student",
      isLocal: false,
      isMuted: true,
      isVideoOn: false,
      isSpeaking: false,
      department: "AI & Data Science",
      avatarLetter: "D",
      avatarBg: "bg-teal-600"
    }
  ];

  // In-Call Live Chat Messages
  const [meetingChat, setMeetingChat] = useState([
    { sender: "Prof. AI Teacher", time: "10:00 AM", text: "Welcome everyone to today's live video class! Feel free to unmute your mic to speak, or ask questions in this chat.", isAI: true },
    { sender: "Rishi", time: "10:02 AM", text: "Good morning Professor! Can we use smart pointers in embedded C++?", isAI: false },
    { sender: "Prof. AI Teacher", time: "10:02 AM", text: "Great question Rishi! Yes, std::unique_ptr has zero runtime overhead and is ideal for embedded systems.", isAI: true }
  ]);

  // Hook up real user webcam when video is on
  useEffect(() => {
    let activeStream = null;

    if (isOpen && isVideoOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 }, audio: false })
          .then((stream) => {
            activeStream = stream;
            setCameraAccessGranted(true);
            if (studentVideoRef.current) {
              studentVideoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn("Webcam access not granted or camera not detected:", err);
            setCameraAccessGranted(false);
          });
      }
    } else {
      setCameraAccessGranted(false);
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isVideoOn]);

  // Active student mic hearing: listen to student voice when mic is not turned off
  useEffect(() => {
    if (!isOpen || !isMicOn) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsStudentSpeaking(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let recognition;
    try {
      recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setStudentSpeechTranscript(text);
        setIsStudentSpeaking(true);

        if (event.results[current].isFinal) {
          const finalSpeech = text.trim();
          setIsStudentSpeaking(false);
          setStudentSpeechTranscript("");

          if (finalSpeech.length > 2) {
            // Student spoke live via mic: post to chat
            const spokenMsg = {
              sender: `${studentName} (Spoken Live 🎙️)`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: finalSpeech,
              isAI: false
            };
            setMeetingChat(prev => [...prev, spokenMsg]);

            // AI Teacher hears and answers the student aloud
            setTimeout(() => {
              const reply = `Prof. AI Teacher: I hear you clearly, ${studentName}! Regarding "${finalSpeech}": that is a vital concept in today's class. Let's look closely at the video demonstration.`;
              setMeetingChat(prev => [...prev, {
                sender: "Prof. AI Teacher",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: reply,
                isAI: true
              }]);
              setLiveCaptions(reply);
              speak(reply);
            }, 800);
          }
        }
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.warn("Student mic speech recognition status:", e.error);
        }
        setIsStudentSpeaking(false);
      };

      recognition.onend = () => {
        if (isOpen && isMicOn) {
          try { recognition.start(); } catch (e) {}
        } else {
          setIsStudentSpeaking(false);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition for student mic could not initialize:", err);
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
    };
  }, [isOpen, isMicOn, studentName, speak]);

  // Lecture content bank based on topics
  const getLectureData = (currentTopic) => {
    const t = currentTopic.toLowerCase();
    if (t.includes("java") || t.includes("oop")) {
      return {
        subject: "Java Enterprise Architecture",
        title: "Object-Oriented Programming & Interfaces",
        videoUrl: "https://www.youtube-nocookie.com/embed/grEKMHGYyns?autoplay=1&mute=0&controls=1&rel=0",
        slides: [
          {
            title: "Slide 1: Encapsulation & Data Hiding",
            explanation: "Encapsulation bundles data (fields) and methods operating on that data inside a class, while restricting direct access using private modifiers.",
            codeSnippet: `public class BankAccount {\n    private double balance;\n\n    public BankAccount(double initial) {\n        this.balance = initial;\n    }\n\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n    public double getBalance() { return balance; }\n}`,
            keyNotes: ["Prevents illegal external state modifications.", "Exposes controlled getters and setters.", "Improves modularity and maintainability."]
          },
          {
            title: "Slide 2: Polymorphism & Method Overriding",
            explanation: "Polymorphism allows objects to take multiple forms. Runtime polymorphism is achieved via method overriding in subclasses.",
            codeSnippet: `abstract class Notification {\n    abstract void send(String msg);\n}\n\nclass EmailNotification extends Notification {\n    @Override\n    void send(String msg) {\n        System.out.println("Sending Email: " + msg);\n    }\n}`,
            keyNotes: ["Base class defines abstract contract.", "Subclasses provide concrete implementations.", "Enables dynamic dispatch at runtime."]
          },
          {
            title: "Slide 3: Interface Contracts & Multiple Inheritance",
            explanation: "Java interfaces specify WHAT a class must do, not HOW. A single class can implement multiple interfaces.",
            codeSnippet: `interface Serializable { }\ninterface Printable {\n    void printDetails();\n}\n\npublic class Report implements Serializable, Printable {\n    public void printDetails() {\n        System.out.println("Report verified.");\n    }\n}`,
            keyNotes: ["Enables loose coupling between subsystems.", "Modern Java allows default helper methods.", "Used in Spring Boot dependency injection."]
          }
        ]
      };
    }

    if (t.includes("docker") || t.includes("devops") || t.includes("container")) {
      return {
        subject: "Cloud DevOps & Containers",
        title: "Docker Multi-Stage Production Builds",
        videoUrl: "https://www.youtube-nocookie.com/embed/3c-iBn73dDE?autoplay=1&mute=0&controls=1&rel=0",
        slides: [
          {
            title: "Slide 1: Dockerfile Multi-Stage Architecture",
            explanation: "Multi-stage builds split build dependencies from runtime environments, shrinking production images from 800MB down to 35MB.",
            codeSnippet: `# Stage 1: Build\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Runtime\nFROM nginx:alpine\nCOPY --from=build /app/build /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`,
            keyNotes: ["Separates compiler SDK from final artifact.", "Dramatically reduces container vulnerability attack surface.", "Speeds up Kubernetes image pull times."]
          },
          {
            title: "Slide 2: Port Binding & Networking",
            explanation: "Docker containers run in isolated networks. Exposing and mapping ports links the container socket to the host OS.",
            codeSnippet: `# Build Docker image\ndocker build -t gamilearn-web:v1 .\n\n# Run container on host port 8080\ndocker run -d -p 8080:80 --name gami-app gamilearn-web:v1\n\n# Inspect live container health\ndocker ps`,
            keyNotes: ["-p HostPort:ContainerPort maps incoming web traffic.", "-d runs container in background daemon mode.", "Use docker logs to inspect stdout."]
          }
        ]
      };
    }

    // Default: C++ Pointers & Memory Allocation
    return {
      subject: "C++ Systems Programming",
      title: "Pointers & Dynamic Memory Architecture",
      videoUrl: "https://www.youtube-nocookie.com/embed/zuegQmMdy8M?autoplay=1&mute=0&controls=1&rel=0",
      slides: [
        {
          title: "Slide 1: Memory Addresses & Pointer Syntax",
          explanation: "In C++, a pointer is a variable that stores the raw hexadecimal memory address of another variable. We obtain an address using the '&' (address-of) operator.",
          codeSnippet: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int count = 42;\n    int* ptr = &count; // ptr holds address of count\n\n    cout << "Value: " << *ptr << endl;    // 42 (Dereferencing)\n    cout << "Address: " << ptr << endl;   // 0x7ffee4b2c\n    return 0;\n}`,
          keyNotes: ["int* declares pointer to integer.", "&count extracts the physical RAM address.", "*ptr dereferences and reads/writes the value."]
        },
        {
          title: "Slide 2: Dynamic Heap Allocation with 'new' & 'delete'",
          explanation: "Stack memory is automatically cleared on function return. Heap memory persists until manually freed with delete, giving total control over large structures.",
          codeSnippet: `// Allocate array of 1000 integers on Heap\nint* buffer = new int[1000];\nbuffer[0] = 99;\n\n// CRITICAL: Always release dynamic memory!\ndelete[] buffer;\nbuffer = nullptr; // Prevent dangling pointer bug`,
          keyNotes: ["Every 'new' must be paired with 'delete'.", "For arrays allocated with 'new[]', use 'delete[]'.", "Set pointer to nullptr to prevent use-after-free."]
        },
        {
          title: "Slide 3: Modern C++ RAII with Smart Pointers",
          explanation: "In C++11 and higher, smart pointers eliminate manual memory leaks automatically through RAII (Resource Acquisition Is Initialization).",
          codeSnippet: `#include <memory>\n\nvoid safeComputation() {\n    // Automatically freed when unique_ptr goes out of scope!\n    std::unique_ptr<int[]> safeArr = std::make_unique<int[]>(50);\n    safeArr[0] = 77;\n    // No delete needed! Destructor cleans up heap.\n}`,
          keyNotes: ["std::unique_ptr has zero-overhead single ownership.", "std::shared_ptr provides reference-counted sharing.", "Eliminates memory leaks and segmentation faults."]
        }
      ]
    };
  };

  const lecture = getLectureData(topic);
  const currentSlide = lecture.slides[activeSlideIndex] || lecture.slides[0];

  // Meeting timer effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setMeetingTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSpeakCurrentSlide = () => {
    if (!currentSlide) return;
    setHasUserStartedAudio(true);
    playMeetingChime();

    const lectureNarration = `Class, please watch the live video demonstration for ${currentSlide.title}. ${currentSlide.explanation}. Notice these key takeaways: ${currentSlide.keyNotes.join('. ')}.`;
    setLiveCaptions(lectureNarration);
    speak(lectureNarration);
  };

  // Announce slide when changed
  useEffect(() => {
    if (isOpen && currentSlide) {
      const lectureNarration = `Class, please look at ${currentSlide.title}. ${currentSlide.explanation}. Notice these key takeaways: ${currentSlide.keyNotes.join('. ')}.`;
      setLiveCaptions(lectureNarration);
      if (hasUserStartedAudio) {
        speak(lectureNarration);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlideIndex, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setHasUserStartedAudio(true);

    const userMsg = {
      sender: studentName || "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim(),
      isAI: false
    };

    setMeetingChat(prev => [...prev, userMsg]);
    const query = chatInput;
    setChatInput("");

    // AI Teacher response in Meet chat
    setTimeout(() => {
      let replyText = `Thanks for asking about "${query}", ${studentName}! Keep attention on the live video stream for the real-time code demonstration.`;
      if (query.toLowerCase().includes("delete") || query.toLowerCase().includes("leak")) {
        replyText = "Important concept! Failing to delete allocated memory causes a memory leak, which exhausts system RAM over time.";
      } else if (query.toLowerCase().includes("smart") || query.toLowerCase().includes("unique")) {
        replyText = "Smart pointers wrap raw pointers and automatically call delete in their destructors when exiting scope.";
      }

      setMeetingChat(prev => [...prev, {
        sender: "Prof. AI Teacher",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        isAI: true
      }]);

      setLiveCaptions(`Prof. AI Teacher: ${replyText}`);
      speak(replyText);
    }, 1000);
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    if (!isHandRaised) {
      setHasUserStartedAudio(true);
      playMeetingChime();
      const msg = `Prof. AI Teacher: I see your hand raised, ${studentName}! What question do you have regarding ${lecture.title}? You can speak into your microphone or type in chat.`;
      setLiveCaptions(msg);
      speak(msg);
    }
  };

  const handleCopyMeetLink = () => {
    navigator.clipboard?.writeText?.(meetCode);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 text-white overflow-hidden animate-in fade-in duration-200">
      
      {/* Google Meet Top Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg shrink-0">
        {/* Left: Branding & Meeting Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-500 flex items-center justify-center shadow-md shrink-0">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span>Google Meet</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.2 rounded-full border border-emerald-500/30">
                    LIVE CLASSROOM
                  </span>
                </span>
                <span className="text-xs text-slate-400 font-mono hidden md:inline">
                  | {formatTime(meetingTimer)}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate max-w-[200px] sm:max-w-md">
                {lecture.title}
              </p>
            </div>
          </div>
        </div>

        {/* Center: View Mode Switcher (Live Video Class vs All Videos Grid) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('live-video')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'live-video' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live Video Class</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Videos ({attendingStudents.length + 1})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-xs text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300">{meetCode}</span>
            <button 
              onClick={handleCopyMeetLink}
              className="ml-1 text-slate-400 hover:text-white transition"
              title="Copy Google Meet Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href={externalMeetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl border border-white/10 transition"
            title="Launch in official Google Meet tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">meet.google.com</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close classroom modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Classroom Screen Area */}
      <div className="flex-1 flex gap-3 my-3 overflow-hidden relative">
        
        {/* VIEW 1: LIVE VIDEO CLASSROOM */}
        {viewMode === 'live-video' ? (
          <div className="flex-1 flex flex-col bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
            
            {/* Live Video Header & Controls Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                {/* Live stream badge */}
                <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>● LIVE VIDEO CLASS</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-extrabold text-white">{lecture.subject}:</span>
                  <span className="text-purple-300 font-bold truncate max-w-xs">{currentSlide.title}</span>
                </div>
              </div>

              {/* View options: Cinema (Full Video) vs Split (Video + Code) & Slide Navigator */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => setVideoLayoutMode('cinema')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                      videoLayoutMode === 'cinema' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Watch in full theater cinema mode"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Full Video</span>
                  </button>
                  <button
                    onClick={() => setVideoLayoutMode('split')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                      videoLayoutMode === 'split' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Watch video + code board side by side"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Video + Notes</span>
                  </button>
                </div>

                {/* Concept Navigator */}
                <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                    disabled={activeSlideIndex === 0}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
                    title="Previous concept"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300 px-1">
                    {activeSlideIndex + 1}/{lecture.slides.length}
                  </span>
                  <button
                    onClick={() => setActiveSlideIndex(Math.min(lecture.slides.length - 1, activeSlideIndex + 1))}
                    disabled={activeSlideIndex === lecture.slides.length - 1}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
                    title="Next concept"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Lecture Status & Unmute Banner */}
            {!hasUserStartedAudio ? (
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white shadow-lg shrink-0 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm">
                      AI Teacher Voice Stream is Ready!
                    </p>
                    <p className="text-[11px] text-emerald-100">
                      Click the button to listen to the live lecture audio with 100% loud & clear voice narration.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSpeakCurrentSlide}
                  className="px-4 py-1.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-950" />
                  <span>Start Live Audio (100% Volume)</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isSpeaking ? "Prof. AI Teacher is Speaking Live" : "Voice Lecture Paused"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        handleSpeakCurrentSlide();
                      }
                    }}
                    className={`px-3 py-1 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      isSpeaking 
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isSpeaking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                    <span>{isSpeaking ? "Pause Voice" : "Play Voice"}</span>
                  </button>

                  <button
                    onClick={handleSpeakCurrentSlide}
                    className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
                    title="Replay lecture audio"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold transition flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Audio Settings Drawer */}
            {showVoiceSettings && (
              <div className="bg-slate-950/90 border-b border-slate-800 p-3 flex flex-wrap items-center gap-4 text-xs text-slate-300 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={speechVolume}
                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                    className="w-20 accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(speechVolume * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Speed:</span>
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
                  >
                    <option value={0.8}>0.8x Slower</option>
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.2}>1.2x Faster</option>
                  </select>
                </div>

                {availableVoices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">Voice:</span>
                    <select
                      value={selectedVoiceIndex}
                      onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs max-w-[200px] truncate"
                    >
                      <option value={0}>Auto Natural Clear Voice</option>
                      {availableVoices.slice(0, 10).map((v, idx) => (
                        <option key={idx} value={idx}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* LIVE CLASSROOM VIDEO BODY */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 p-3 bg-slate-950/60">
              
              {/* PRIMARY LIVE VIDEO STREAM CONTAINER */}
              <div className={`${videoLayoutMode === 'cinema' ? 'w-full h-full' : 'flex-1 h-full'} flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl group`}>
                
                {/* Live Stream Status Overlay Top */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
                  <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/40 text-[11px] font-extrabold text-white shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400">LIVE CLASS</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-slate-300">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>142 watching</span>
                  </div>

                  <div className="hidden sm:inline-block bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    1080p 60fps HD
                  </div>
                </div>

                {/* Live Embedded Video Stream */}
                <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
                  <iframe
                    title="Live Classroom Video Stream"
                    src={`${lecture.videoUrl}&autoplay=1&mute=0&controls=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  {/* PROF. AI TEACHER PICTURE-IN-PICTURE CAM OVERLAY */}
                  <div className={`absolute bottom-3 right-3 z-30 rounded-2xl p-2.5 backdrop-blur-md border-2 ${
                    isSpeaking 
                      ? 'bg-slate-950/90 border-emerald-400 ring-4 ring-emerald-500/30 shadow-2xl' 
                      : 'bg-slate-950/80 border-slate-700/80 shadow-lg'
                  } transition-all max-w-[210px] flex items-center gap-2.5`}>
                    
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                        isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
                      } border-2 border-slate-950`} />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <p className="font-extrabold text-[11px] text-white truncate">Prof. AI Teacher</p>
                      </div>
                      <p className="text-[10px] text-purple-300 truncate">Faculty Host</p>
                      
                      {/* Live Audio Waves */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <span className={`w-0.5 bg-emerald-400 rounded-full ${isSpeaking ? 'h-3 animate-bounce' : 'h-1'}`} />
                        <span className={`w-0.5 bg-emerald-400 rounded-full ${isSpeaking ? 'h-4 animate-bounce' : 'h-1'}`} style={{ animationDelay: '100ms' }} />
                        <span className={`w-0.5 bg-emerald-400 rounded-full ${isSpeaking ? 'h-2.5 animate-bounce' : 'h-1'}`} style={{ animationDelay: '200ms' }} />
                        <span className={`w-0.5 bg-emerald-400 rounded-full ${isSpeaking ? 'h-3.5 animate-bounce' : 'h-1'}`} style={{ animationDelay: '50ms' }} />
                        <span className="text-[9px] text-emerald-400 font-mono ml-1">
                          {isSpeaking ? "Live Voice" : "Listening"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* SECONDARY CODE & LECTURE BOARD (Visible in Split Mode) */}
              {videoLayoutMode === 'split' && (
                <div className="w-full md:w-96 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-3 overflow-y-auto space-y-3">
                  
                  {/* Concept Title & Notes */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                        Lecture Concepts & Notes
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Concept #{activeSlideIndex + 1}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white leading-tight">
                      {currentSlide.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                      {currentSlide.explanation}
                    </p>
                  </div>

                  {/* Interactive Code Example */}
                  <div className="rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-slate-200">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Interactive Code</span>
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">{lecture.subject}</span>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{currentSlide.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Exam & Interview Takeaways */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Exam & Interview Takeaways:</span>
                    </h4>
                    <div className="space-y-1.5">
                      {currentSlide.keyNotes.map((note, nIdx) => (
                        <div key={nIdx} className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Live Closed Captioning Subtitle Bar */}
            <div className="p-2.5 bg-black/80 border-t border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-[10px] shrink-0">
                  CC
                </span>
                <p className="text-slate-200 italic truncate text-[11px]">
                  {liveCaptions}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    handleSpeakCurrentSlide();
                  }
                }}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border transition shrink-0 shadow-sm active:scale-95 ${
                  isSpeaking 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                    : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                }`}
                title="Toggle AI Teacher voice narration"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? "Pause Voice" : "Play Voice (Loud & Clear)"}</span>
              </button>
            </div>

          </div>
        ) : (
          /* VIEW 2: FULL GOOGLE MEET ALL VIDEOS GRID */
          <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">Live Classroom Attendees Video Grid ({attendingStudents.length + 1} in call)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Google Meet Tiled View</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* AI Teacher Video Tile in Grid */}
              <div className={`relative h-52 rounded-2xl bg-slate-950 border-2 ${
                isSpeaking ? 'border-emerald-400 ring-4 ring-emerald-500/30' : 'border-slate-800'
              } p-4 flex flex-col items-center justify-center text-center overflow-hidden shadow-md`}>
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-emerald-400 border border-emerald-500/40">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                  <span>{isSpeaking ? "Teacher Speaking" : "Faculty Host"}</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg">
                  <Bot className="w-9 h-9" />
                </div>
                <p className="font-extrabold text-sm text-white">Prof. AI Teacher</p>
                <p className="text-[11px] text-purple-300">Department of Computer Science</p>
                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <Mic className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Student Video Tile (You) in Grid */}
              <div className={`relative h-52 rounded-2xl bg-slate-950 border-2 ${
                isStudentSpeaking ? 'border-emerald-400 ring-4 ring-emerald-500/30' : 'border-slate-800'
              } overflow-hidden shadow-md flex flex-col items-center justify-center text-center`}>
                <div className="absolute top-2 left-2 z-10 text-[10px] font-bold text-slate-200 bg-black/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>{studentName} (You)</span>
                  {isStudentSpeaking && <span className="text-emerald-400 font-extrabold animate-pulse">● Speaking</span>}
                </div>

                {isVideoOn ? (
                  cameraAccessGranted ? (
                    <video 
                      ref={studentVideoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-3">
                      <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg mb-2">
                        {studentName.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-slate-200">{studentName}</p>
                      <span className="text-[10px] text-emerald-400 mt-1 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                        Live Video Active
                      </span>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-extrabold text-lg mb-2">
                      {studentName.charAt(0)}
                    </div>
                    <p className="text-xs font-bold text-slate-200">{studentName}</p>
                    <span className="text-[10px] text-slate-400">Camera Off</span>
                  </div>
                )}

                {/* Live student speech subtitle indicator if speaking */}
                {isStudentSpeaking && studentSpeechTranscript && (
                  <div className="absolute bottom-10 left-2 right-2 z-20 bg-black/85 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded-lg truncate border border-emerald-500/40">
                    🎙️ "{studentSpeechTranscript}"
                  </div>
                )}

                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                  <div className={`p-1.5 rounded-full ${isMicOn ? 'bg-emerald-500/30 text-emerald-400' : 'bg-rose-500/30 text-rose-400'}`}>
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`p-1.5 rounded-full ${isVideoOn ? 'bg-emerald-500/30 text-emerald-400' : 'bg-rose-500/30 text-rose-400'}`}>
                    {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Classmates in Grid */}
              {attendingStudents.filter(s => !s.isLocal).map((student) => (
                <div key={student.id} className="relative h-52 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-md flex flex-col items-center justify-center">
                  <div className="absolute top-2 left-2 z-10 text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full">
                    {student.name}
                  </div>

                  {student.isVideoOn && student.videoImg ? (
                    <img 
                      src={student.videoImg} 
                      alt={student.name} 
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
                      <div className={`w-14 h-14 rounded-full ${student.avatarBg} flex items-center justify-center text-white font-extrabold text-lg shadow-md mb-1.5`}>
                        {student.avatarLetter}
                      </div>
                      <p className="text-xs font-bold text-slate-200">{student.name}</p>
                      <p className="text-[10px] text-slate-400">{student.department}</p>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 z-10 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-full">
                    {student.department}
                  </div>

                  <div className="absolute bottom-2 right-2 z-10 p-1.5 rounded-full bg-slate-800/80 text-slate-400">
                    <MicOff className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ON-DEMAND SLIDE-OUT DRAWER FOR CHAT & PARTICIPANTS (Clutter-Free!) */}
        {drawerOpen && (
          <div className="w-80 flex flex-col bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden shrink-0 animate-in slide-in-from-right-4 duration-200">
            
            {/* Drawer Header with Switcher & Close */}
            <div className="p-2.5 bg-slate-800/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
                <button
                  onClick={() => setDrawerOpen('chat')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                    drawerOpen === 'chat' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat ({meetingChat.length})</span>
                </button>
                <button
                  onClick={() => setDrawerOpen('attendees')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                    drawerOpen === 'attendees' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Attendees ({attendingStudents.length + 1})</span>
                </button>
              </div>

              <button
                onClick={() => setDrawerOpen(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content: Chat */}
            {drawerOpen === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                  {meetingChat.map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl ${m.isAI ? 'bg-purple-950/40 border border-purple-800/30' : 'bg-slate-800/60'}`}>
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className={`font-bold ${m.isAI ? 'text-purple-300' : 'text-emerald-300'}`}>
                          {m.sender}
                        </span>
                        <span className="text-slate-500">{m.time}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 flex items-center gap-2 bg-slate-900">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask teacher in live class..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition text-xs font-bold shadow-sm"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Content: Attendees */}
            {drawerOpen === 'attendees' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                {/* Faculty Host */}
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-xs">Prof. AI Teacher</p>
                      <p className="text-[10px] text-purple-300">Host & Presenter</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    Faculty
                  </span>
                </div>

                {/* You */}
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-xs">{studentName} (You)</p>
                      <p className="text-[10px] text-slate-400">Student</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                    {isVideoOn ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                </div>

                {/* Classmates */}
                {attendingStudents.filter(s => !s.isLocal).map(student => (
                  <div key={student.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${student.avatarBg} flex items-center justify-center text-white font-bold text-xs`}>
                        {student.avatarLetter}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-xs">{student.name}</p>
                        <p className="text-[10px] text-slate-500">{student.department}</p>
                      </div>
                    </div>
                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Google Meet Bottom Control Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl shrink-0">
        
        {/* Left: Meeting Details & Topic */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {formatTime(meetingTimer)} | {meetCode}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{attendingStudents.length + 1} in class</span>
          </div>
        </div>

        {/* Center: Essential Google Meet Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
          
          {/* Microphone Toggle */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              isMicOn 
                ? 'bg-slate-800 hover:bg-slate-700 text-white ring-2 ring-emerald-500/40' 
                : 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300'
            }`}
            title={isMicOn ? "Microphone is ON (Teacher can hear you speak)" : "Microphone is OFF"}
          >
            {isMicOn ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              isVideoOn 
                ? 'bg-slate-800 hover:bg-slate-700 text-white ring-2 ring-emerald-500/40' 
                : 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300'
            }`}
            title={isVideoOn ? "Camera is ON (Your video is visible)" : "Camera is OFF"}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-emerald-400" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Raise Hand */}
          <button
            onClick={handleRaiseHand}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              isHandRaised 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold ring-2 ring-amber-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isHandRaised ? "Lower hand" : "Raise hand to ask question"}
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* View Mode Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'live-video' ? 'grid' : 'live-video')}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={viewMode === 'grid' ? "Switch to Live Video Class" : "Switch to All Videos Grid"}
          >
            {viewMode === 'grid' ? <Tv className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </button>

          {/* Toggle In-Call Messages */}
          <button
            onClick={() => setDrawerOpen(drawerOpen === 'chat' ? null : 'chat')}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              drawerOpen === 'chat' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Toggle in-call messages chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Toggle Attendees Drawer */}
          <button
            onClick={() => setDrawerOpen(drawerOpen === 'attendees' ? null : 'attendees')}
            className={`p-3 rounded-full transition active:scale-95 shadow-md ${
              drawerOpen === 'attendees' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Toggle attendees list"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* End Call / Leave Class */}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition active:scale-95 shadow-lg shadow-rose-950/50 flex items-center gap-2"
            title="Leave Google Meet Classroom"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave Class</span>
          </button>
        </div>

        {/* Right: Quick Slide Switch Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              const nextIdx = (activeSlideIndex + 1) % lecture.slides.length;
              setActiveSlideIndex(nextIdx);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-xs font-bold text-purple-200 transition"
          >
            <span>Next Lecture Concept →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
