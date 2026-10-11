import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useLanguage } from '../../context/LanguageContext';
import { useXP } from '../../context/GamificationContext';
import { useOfflineSync } from '../../context/OfflineContext';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Bot, 
  Volume2, 
  Send, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    isSpeakingAudio, 
    errorMessage, 
    startListening, 
    stopListening, 
    setTranscript 
  } = useSpeechRecognition();

  const { speak, playMeetingChime, language, isSpeaking } = useLanguage();
  const { xp, streak, level } = useXP();
  const { isOnline, toggleManualOffline } = useOfflineSync();
  const navigate = useNavigate();

  const [manualInput, setManualInput] = useState('');
  const [botResponse, setBotResponse] = useState(
    language === 'ta'
      ? "வணக்கம்! நான் உங்கள் AI குரல் வழிகாட்டி. மைக் பொத்தானைத் தொட்டு எதையும் பேசுங்கள், அல்லது கீழே உள்ள கட்டளையைத் தேர்ந்தெடுக்கவும்."
      : "Hello! I am your AI Voice Assistant. Tap the mic and speak any question or command."
  );

  // Update initial greeting when language changes
  useEffect(() => {
    if (language === 'ta') {
      setBotResponse("வணக்கம்! நான் உங்கள் AI குரல் வழிகாட்டி. மைக் பொத்தானைத் தொட்டு எதையும் பேசுங்கள், அல்லது கீழே உள்ள கட்டளையைத் தேர்ந்தெடுக்கவும்.");
    } else {
      setBotResponse("Hello! I am your AI Voice Assistant. Tap the mic and speak any question or command.");
    }
  }, [language]);

  if (!isOpen) return null;

  const handleCommandProcess = (text) => {
    if (!text || !text.trim()) return;
    const lower = text.toLowerCase().trim();
    let reply = "";
    let destination = null;

    // 1. Greetings
    if (
      lower.includes("வணக்கம்") || 
      lower.includes("ஹலோ") || 
      lower.includes("hello") || 
      lower.includes("hi") || 
      lower.includes("namaste") ||
      lower.includes("வாழ்க")
    ) {
      reply = language === 'ta'
        ? "வணக்கம்! நான் உங்கள் AI குரல் வழிகாட்டி. உங்களுக்கு இன்று நான் எவ்வாறு உதவ முடியும்?"
        : "Hello! I am your AI Rural Voice Assistant. How can I assist your learning today?";
    }
    // 2. Quiz / Daily Challenge
    else if (
      lower.includes("quiz") || 
      lower.includes("test") || 
      lower.includes("வினாடி") || 
      lower.includes("தேர்வு") ||
      lower.includes("க்விஸ்") ||
      lower.includes("challenge") ||
      lower.includes("question")
    ) {
      reply = language === 'ta'
        ? "இன்றைய தினசரி நிரலாக்க வினாடி வினாவைத் திறக்கிறேன். +100 எக்ஸ்பி புள்ளிகளை வெல்லுங்கள்!"
        : "Opening your Daily Coding Quiz! Solve challenges and earn +100 XP!";
      destination = '/quiz';
    }
    // 3. AI Teacher Classroom / Google Meet
    else if (
      lower.includes("ai teacher") || 
      lower.includes("classroom") || 
      lower.includes("meet") || 
      lower.includes("ஆசிரியர்") || 
      lower.includes("வகுப்பு") || 
      lower.includes("நேரடி") ||
      lower.includes("tutor") ||
      lower.includes("doubt") ||
      lower.includes("class")
    ) {
      reply = language === 'ta'
        ? "AI ஆசிரியர் நேரடி கூகிள் மீட் வகுப்பைத் தொடங்குகிறேன். உங்கள் சந்தேகங்களை நேரலையில் கேளுங்கள்!"
        : "Opening the AI Teacher interactive Google Meet classroom for you!";
      destination = '/ai-tutor?mode=class';
    }
    // 4. College Courses & Syllabus
    else if (
      lower.includes("course") || 
      lower.includes("subject") || 
      lower.includes("syllabus") || 
      lower.includes("பாடம்") || 
      lower.includes("படிப்பு") ||
      lower.includes("பாடங்கள்") ||
      lower.includes("library")
    ) {
      reply = language === 'ta'
        ? "உங்கள் கல்லூரி பாடங்கள் மற்றும் ஆஃப்லைன் ஆய்வக களஞ்சியத்தை திறக்கிறேன்."
        : "Taking you to your college engineering courses and offline modules.";
      destination = '/courses';
    }
    // 5. Timetable / Schedule
    else if (
      lower.includes("timetable") || 
      lower.includes("schedule") || 
      lower.includes("routine") || 
      lower.includes("அட்டவணை") || 
      lower.includes("நேரம்") ||
      lower.includes("டைம்") ||
      lower.includes("today")
    ) {
      reply = language === 'ta'
        ? "உங்கள் வகுப்பு நேர அட்டவணையைத் திறக்கிறேன்."
        : "Opening your batch schedule and daily timetable.";
      destination = '/timetable';
    }
    // 6. Tasks / Labs
    else if (
      lower.includes("task") || 
      lower.includes("lab") || 
      lower.includes("பணி") || 
      lower.includes("ஆய்வகம்") ||
      lower.includes("assignment") ||
      lower.includes("planner")
    ) {
      reply = language === 'ta'
        ? "உங்கள் ஆய்வக பணிகள் மற்றும் திட்டமிடல் பக்கத்தைத் திறக்கிறேன்."
        : "Opening your lab challenges and student task planner.";
      destination = '/tasks';
    }
    // 7. Leaderboard & Rank
    else if (
      lower.includes("leaderboard") || 
      lower.includes("rank") || 
      lower.includes("score") || 
      lower.includes("வெற்றி") || 
      lower.includes("தரவரிசை") ||
      lower.includes("லீடர்போர்டு") ||
      lower.includes("standing")
    ) {
      reply = language === 'ta'
        ? "வகுப்பு வெற்றிப் பலகையைத் திறக்கிறேன். சஞ்சய், ரிஷி, சரண் நிலைகளைப் பாருங்கள்!"
        : "Opening class leaderboard! See Sanjay, Rishi, and Saran's rankings!";
      destination = '/leaderboard';
    }
    // 8. Level, Streak & XP
    else if (
      lower.includes("level") || 
      lower.includes("xp") || 
      lower.includes("streak") || 
      lower.includes("points") || 
      lower.includes("நிலை") || 
      lower.includes("புள்ளி") ||
      lower.includes("தொடர்")
    ) {
      reply = language === 'ta'
        ? `நீங்கள் தற்போது நிலை ${level}-ல் உள்ளீர்கள், ${xp} எக்ஸ்பி புள்ளிகள் மற்றும் ${streak} நாட்கள் தொடர் கற்றல் வைத்துள்ளீர்கள்! மிகச் சிறப்பு!`
        : `You are at Level ${level} with ${xp} XP, and a streak of ${streak} days! Outstanding progress!`;
    }
    // 9. Accessibility / Language Settings
    else if (
      lower.includes("accessibility") || 
      lower.includes("setting") || 
      lower.includes("contrast") || 
      lower.includes("tamil") || 
      lower.includes("தமிழ்") || 
      lower.includes("அணுகல்தன்மை") || 
      lower.includes("அமைப்புகள்")
    ) {
      reply = language === 'ta'
        ? "அணுகல்தன்மை அமைப்புகள் பக்கத்தைத் திறக்கிறேன்."
        : "Opening accessibility settings for visual, voice, and language adaptations.";
      destination = '/accessibility';
    }
    // 10. Offline / Sync
    else if (
      lower.includes("offline") || 
      lower.includes("online") || 
      lower.includes("internet") || 
      lower.includes("ஆஃப்லைன்") || 
      lower.includes("இணையம்")
    ) {
      toggleManualOffline();
      reply = isOnline
        ? (language === 'ta' ? "கிராமப்புற ஆஃப்லைன் பயன்முறைக்கு மாறுகிறது. இணையமின்றி கற்கலாம்." : "Switching to simulated rural offline mode.")
        : (language === 'ta' ? "ஆன்லைன் பயன்முறைக்கு மீண்டும் இணைகிறது." : "Connecting back to online mode.");
    }
    // 11. Core Concept Queries
    else if (lower.includes("binary search") || lower.includes("பைனரி")) {
      reply = language === 'ta'
        ? "பைனரி தேடல் (Binary Search) என்பது வரிசைப்படுத்தப்பட்ட பட்டியலில் பாதியாகப் பிரித்து O(log n) வேகத்தில் தேடும் சிறந்த வழிமுறை ஆகும்."
        : "Binary Search is an efficient O(log n) algorithm that finds a target in a sorted list by repeatedly halving the search space.";
    } else if (lower.includes("java")) {
      reply = language === 'ta'
        ? "ஜாவா (Java) ஒரு பிரபலமான ஆப்ஜெக்ட்-ஓரியண்டட் நிரலாக்க மொழி. இது என்கேப்சுலேஷன் மற்றும் இன்ஹெரிட்டன்ஸ் மூலம் மென்பொருளை உருவாக்குகிறது."
        : "Java is an object-oriented language known for platform independence (Write Once, Run Anywhere) and robust garbage collection.";
    } else if (lower.includes("c++")) {
      reply = language === 'ta'
        ? "சி++ (C++) என்பது அதிவேக கம்பைல் செய்யப்பட்ட கணினி மொழி. இது நினைவக பாயிண்டர்களை நேரடியாகக் கையாள உதவுகிறது."
        : "C++ is a high-performance compiled language that pairs object-oriented architecture with direct memory management via pointers.";
    } else if (lower.includes("sanjay") || lower.includes("சஞ்சய்")) {
      reply = language === 'ta'
        ? "சஞ்சய் ஒரு சிறந்த கணினி அறிவியல் மாணவர். கிராமப்புற மென்பொருள் திட்டங்களை வெற்றிகரமாக உருவாக்கி வருகிறார்!"
        : "Sanjay is a talented Computer Science engineering student actively building innovative offline learning systems!";
    } else if (lower.includes("rishi") || lower.includes("ரிஷி")) {
      reply = language === 'ta'
        ? "ரிஷி இரண்டாம் ஆண்டு கணினி அறிவியல் மாணவர் மற்றும் உங்கள் சக நிரலாக்க தோழர்!"
        : "Rishi is a 2nd year Computer Science student and your peer coding collaborator!";
    } else if (lower.includes("saran") || lower.includes("சரண்")) {
      reply = language === 'ta'
        ? "சரண் பி.டெக் கணினி அறிவியல் பிரிவில் படிக்கும் சுறுசுறுப்பான மாணவர்!"
        : "Saran is an enthusiastic CS student actively preparing for coding challenges!";
    }
    // 12. General Educational Fallback
    else {
      reply = language === 'ta'
        ? `நான் உங்கள் கேள்வியைக் கேட்டேன்: "${text}". எங்கள் பாட நூலகம் மற்றும் AI வகுப்பறையில் இதற்கான முழுமையான விளக்கம் உள்ளது!`
        : `I heard: "${text}". I have searched our offline curriculum knowledge base for this! Explore related lessons in Courses.`;
    }

    setBotResponse(reply);
    playMeetingChime();
    speak(reply);

    if (destination) {
      setTimeout(() => {
        navigate(destination);
        onClose();
      }, 1800);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setTimeout(() => {
        if (!transcript && botResponse.includes("Listening")) {
          const fallbackMsg = language === 'ta'
            ? "குரல் கேட்கவில்லை. கீழே உள்ள பரிந்துரை பொத்தானைத் தொட்டு அல்லது தட்டச்சு செய்து எளிதாகக் கேட்கலாம்!"
            : "I didn't catch that clearly. Please tap a suggested command below or type your question!";
          setBotResponse(fallbackMsg);
          speak(fallbackMsg);
        }
      }, 600);
    } else {
      setTranscript("");
      setBotResponse(
        language === 'ta'
          ? "உங்கள் குரலைக் கேட்கிறது... இப்போது பேசுங்கள்! 🎙️"
          : "Listening carefully... Speak now! 🎙️"
      );

      const langLocaleMap = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        es: 'es-ES'
      };
      const activeLocale = langLocaleMap[language] || 'en-IN';

      startListening((result) => {
        handleCommandProcess(result);
      }, activeLocale);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const text = manualInput.trim();
    setTranscript(text);
    setManualInput('');
    handleCommandProcess(text);
  };

  const promptSuggestions = language === 'ta'
    ? [
        "தினசரி வினாடி வினா",
        "AI ஆசிரியர் வகுப்பு",
        "எனது நிலையைச் சரிபார்",
        "பாடங்களுக்குச் செல்",
        "வகுப்பு அட்டவணை",
        "பைனரி தேடல் என்றால் என்ன?"
      ]
    : [
        "Open Daily Quiz",
        "Enter AI Classroom",
        "Check my level",
        "Go to courses",
        "Class Timetable",
        "What is binary search?"
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-200 text-center animate-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={() => {
            stopListening();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition"
          aria-label="Close Voice Assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bot Icon with Active Glow */}
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-200">
            <Bot className="w-8 h-8" />
          </div>
          {isListening && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
            </span>
          )}
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-0.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{language === 'ta' ? "AI குரல் வழிகாட்டி" : "Rural Voice Assistant"}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          {language === 'ta'
            ? "டைப் செய்யாமல் குரல் மூலம் உடனடியாக கற்கவும் வழிகாட்டவும் வடிவமைக்கப்பட்டது."
            : "Designed for voice-first and multilingual learning without typing."}
        </p>

        {/* Speech Bubble Display */}
        <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 text-left mb-4 min-h-[95px] flex flex-col justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-purple-950 leading-relaxed">
              {botResponse}
            </p>
            
            {/* Live Interim Speech Stream while user speaks */}
            {isListening && interimTranscript && (
              <p className="text-[11px] font-bold text-purple-700 animate-pulse mt-2 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
                <span>{language === 'ta' ? "கேட்கிறது: " : "Hearing: "} "{interimTranscript}"</span>
              </p>
            )}

            {/* Final Transcribed Text */}
            {!isListening && transcript && (
              <div className="mt-2 pt-2 border-t border-purple-200 text-[11px] text-purple-700 italic flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{language === 'ta' ? "நீங்கள் கூறியது: " : "You said: "} "{transcript}"</span>
              </div>
            )}
          </div>

          {/* AI Voice Speaking indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-1.5 text-[11px] text-purple-700 font-bold mt-2">
              <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
              <span>{language === 'ta' ? "AI ஆசிரியர் பேசுகிறார்..." : "AI Voice Speaking..."}</span>
            </div>
          )}
        </div>

        {/* Error notification if mic blocked */}
        {errorMessage && (
          <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 mb-3 text-left">
            ⚠️ {errorMessage}
          </p>
        )}

        {/* Big Mic Button & Live Sound Equalizer Wave */}
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          
          {/* Animated 5-Bar Equalizer when Recording */}
          {isListening && (
            <div className="flex items-end justify-center gap-1.5 h-8 py-1 mb-1">
              {[
                { delay: "0ms", height: isSpeakingAudio ? "h-7" : "h-3" },
                { delay: "150ms", height: isSpeakingAudio ? "h-8" : "h-5" },
                { delay: "300ms", height: isSpeakingAudio ? "h-6" : "h-4" },
                { delay: "450ms", height: isSpeakingAudio ? "h-8" : "h-5" },
                { delay: "600ms", height: isSpeakingAudio ? "h-6" : "h-3" },
              ].map((bar, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-rose-500 animate-pulse transition-all duration-150 ${bar.height}`}
                  style={{ animationDelay: bar.delay }}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleMicClick}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200 shadow-rose-300'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:opacity-95 ring-4 ring-purple-100 shadow-purple-200'
            }`}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          
          <span className="text-xs font-bold text-slate-700">
            {isListening 
              ? (language === 'ta' ? "குரல் பதிவு ஆகிறது... (முடிந்ததும் தொடவும்)" : "Recording voice... (Tap to finish)")
              : (language === 'ta' ? "பேச மைக்-ஐத் தொடவும்" : "Tap to Speak")}
          </span>
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {language === 'ta' ? "பரிந்துரைக்கப்பட்ட குரல் கட்டளைகள்:" : "Try saying:"}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setTranscript(prompt);
                  handleCommandProcess(prompt);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition font-medium"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Text & Voice Query Bar */}
        <form onSubmit={handleManualSubmit} className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={language === 'ta' ? "சந்தேகத்தைத் தட்டச்சு செய்க அல்லது பேசவும்..." : "Type or speak your question..."}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50 text-slate-800"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? "கேள்" : "Ask"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
