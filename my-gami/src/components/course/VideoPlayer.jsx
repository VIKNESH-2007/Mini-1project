import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useOfflineSync } from '../../context/OfflineContext';
import { lessonTopicsData } from '../../data/lessonTopics';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Subtitles, 
  Hand, 
  DownloadCloud, 
  Check, 
  Gauge,
  Sparkles,
  ExternalLink,
  BookOpen,
  RotateCcw
} from 'lucide-react';

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function VideoPlayer({ course, currentLesson }) {
  const { signLanguageOverlay, setSignLanguageOverlay, captionsEnabled, setCaptionsEnabled } = useAccessibility();
  const { isCourseDownloaded, downloadCourse } = useOfflineSync();

  // Mode: 'video' (default YouTube video player) or 'interactive' (offline multimedia blackboard)
  const [playerMode, setPlayerMode] = useState('video');
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const speechRef = useRef(null);

  // Retrieve topic-specific lesson metadata
  const lessonData = lessonTopicsData[currentLesson?.id] || {
    topic: currentLesson?.title || course?.title || "Lesson Topic",
    subject: course?.subject || "General",
    grade: course?.grade || "Class 6-8",
    youtubeId: "KG6ILNOiMgM",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/KG6ILNOiMgM",
    summary: course?.description || "Interactive video lecture designed for learners.",
    visualTheme: "currency-decimals",
    slides: [
      {
        title: currentLesson?.title || "Lesson Overview",
        subtitle: course?.title || "Core Learning Module",
        diagram: "rupee-decimal",
        formula: "1 Rupee = 100 Paise",
        keyPoint: "Focus on real-world applications and step-by-step problem solving.",
        narration: `Welcome to this lesson on ${currentLesson?.title || course?.title}. Follow along carefully.`
      }
    ]
  };

  const slides = lessonData.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const isDownloaded = isCourseDownloaded(course?.id || '');

  // Reset when lesson changes
  useEffect(() => {
    setIsVideoStarted(false);
    setCurrentSlideIndex(0);
    setSlideProgress(0);
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [currentLesson?.id]);

  // Web Speech API Voice Teacher Narration for Interactive mode
  const speakNarration = useCallback((text, rate = 1) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.min(Math.max(rate, 0.75), 1.5);
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('hi'));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => {
        setCurrentSlideIndex(prev => {
          if (prev + 1 < slides.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      };
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  }, [isMuted, slides.length]);

  // Slide animation timer for Interactive mode
  useEffect(() => {
    if (playerMode !== 'interactive' || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window && !isPlaying) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    speakNarration(currentSlide.narration, playbackSpeed);

    const stepMs = 100;
    const slideDurationMs = 8000 / playbackSpeed;
    const increment = (stepMs / slideDurationMs) * 100;

    timerRef.current = setInterval(() => {
      setSlideProgress(prev => {
        if (prev >= 100) {
          setCurrentSlideIndex(idx => {
            if (idx + 1 < slides.length) {
              return idx + 1;
            } else {
              setIsPlaying(false);
              return idx;
            }
          });
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlideIndex, playerMode, playbackSpeed, speakNarration, currentSlide.narration, slides.length]);

  const toggleInteractivePlay = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      // If at the end, restart from first slide
      if (currentSlideIndex >= slides.length - 1 && slideProgress >= 90) {
        setCurrentSlideIndex(0);
        setSlideProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex(0);
    setSlideProgress(0);
    setIsPlaying(true);
  };

  const toggleFullScreen = (e) => {
    if (e) e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  // Video YouTube direct link
  const youtubeUrl = `https://www.youtube.com/watch?v=${lessonData.youtubeId}`;

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex flex-col group"
    >
      {/* Top Header Bar: Topic Name & Mode Switcher */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black text-white truncate max-w-[200px] sm:max-w-md">
            {lessonData.topic}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
            {lessonData.subject}
          </span>
        </div>

        {/* Mode Switcher: Video Lecture (Default YouTube) vs Interactive Offline Slides */}
        <div className="flex rounded-xl bg-slate-800 p-0.5 border border-slate-700 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setPlayerMode('video');
              setIsPlaying(false);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              playerMode === 'video'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <YoutubeIcon className="w-3.5 h-3.5 fill-white text-red-600" />
            <span>YouTube Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPlayerMode('interactive');
              setIsVideoStarted(false);
            }}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              playerMode === 'interactive'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Slides</span>
          </button>
        </div>
      </div>

      {/* Main Video Display Screen Area */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {playerMode === 'video' ? (
          /* ================================================================= */
          /* MODE 1: YOUTUBE VIDEO PLAYER (Plays exactly like YouTube)          */
          /* ================================================================= */
          <div className="w-full h-full relative">
            {!isVideoStarted ? (
              /* YouTube Video Poster Preview with Big Red YouTube Play Button */
              <div 
                onClick={() => setIsVideoStarted(true)}
                className="w-full h-full relative cursor-pointer group/poster flex items-center justify-center overflow-hidden"
              >
                {/* High-res YouTube Thumbnail Background */}
                <img
                  src={`https://img.youtube.com/vi/${lessonData.youtubeId}/hqdefault.jpg`}
                  alt={lessonData.topic}
                  className="w-full h-full object-cover brightness-[0.75] group-hover/poster:brightness-[0.9] group-hover/poster:scale-105 transition-all duration-500"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                {/* Lesson Topic Details at Top of Poster */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                      <YoutubeIcon className="w-5 h-5 fill-white text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black tracking-tight drop-shadow-md text-white">
                        {lessonData.topic}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium">
                        {course?.instructor || "Expert Instructor"} • {currentLesson?.duration || "10 mins"}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-black/70 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
                    <span>HD 1080p</span>
                  </span>
                </div>

                {/* Center: BIG YOUTUBE PLAY BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoStarted(true);
                  }}
                  className="relative z-10 w-20 h-14 sm:w-24 sm:h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                  aria-label="Play YouTube Video"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1 text-white group-hover/btn:scale-110 transition-transform" />
                  <span className="absolute -bottom-8 text-xs font-bold text-white/90 bg-black/70 px-3 py-0.5 rounded-full opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap">
                    Click to Play Video
                  </span>
                </button>

                {/* Bottom Topic Summary on Poster */}
                <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none z-10">
                  <p className="text-xs text-slate-300 font-medium line-clamp-1 drop-shadow">
                    💡 {lessonData.summary}
                  </p>
                </div>
              </div>
            ) : (
              /* Active YouTube Iframe Player (Runs smoothly with full YouTube controls) */
              <iframe
                key={lessonData.youtubeId}
                src={`https://www.youtube.com/embed/${lessonData.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={lessonData.topic}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          /* ================================================================= */
          /* MODE 2: INTERACTIVE MULTIMEDIA SLIDES (Offline Blackboard)        */
          /* ================================================================= */
          <div 
            onClick={toggleInteractivePlay}
            className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative bg-radial from-slate-900 via-slate-950 to-slate-950 cursor-pointer"
          >
            {/* Background Chalkboard Grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Offline Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-md ${
                isDownloaded ? 'bg-emerald-600/90 text-white' : 'bg-black/60 text-slate-200'
              }`}>
                {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                <span>{isDownloaded ? 'Downloaded Offline' : `${course?.downloadSize || '15 MB'} Packet`}</span>
              </span>
            </div>

            {/* Slide Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  Step {currentSlideIndex + 1} of {slides.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentSlide.subtitle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 inline shrink-0" />
                <span className="truncate">{currentSlide.title}</span>
              </h2>
            </div>

            {/* Slide Center Concept Diagram */}
            <div className="relative z-10 my-auto py-3 flex flex-col items-center justify-center">
              <div className="w-full max-w-xl bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 sm:p-5 shadow-2xl backdrop-blur-md text-center space-y-3">
                <div className="text-3xl sm:text-4xl">📚</div>
                <div className="bg-slate-950/90 rounded-xl p-3 border border-brand-500/40">
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 block">
                    {currentSlide.formula}
                  </span>
                  <span className="text-[11px] text-slate-300 mt-1 block font-medium">
                    💡 {currentSlide.keyPoint}
                  </span>
                </div>
              </div>
            </div>

            {/* Captions */}
            {captionsEnabled && (
              <div className="relative z-10 text-center pointer-events-none mb-2">
                <span className="inline-block bg-black/90 text-yellow-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl max-w-2xl backdrop-blur-md border border-white/15 shadow-xl">
                  {currentSlide.narration}
                </span>
              </div>
            )}

            {/* Interactive Play Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-20">
                <button
                  type="button"
                  onClick={toggleInteractivePlay}
                  className="w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-400 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition"
                  aria-label="Play Interactive Lesson"
                >
                  <Play className="w-10 h-10 fill-white ml-1.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Mode Timeline Bar */}
      {playerMode === 'interactive' && (
        <div className="w-full bg-slate-950 px-3 pt-2 pb-1 border-t border-slate-900">
          <div className="grid grid-cols-4 gap-1.5">
            {slides.map((_, sIdx) => {
              const isPast = sIdx < currentSlideIndex;
              const isCurrent = sIdx === currentSlideIndex;
              const fillWidth = isPast ? 100 : isCurrent ? slideProgress : 0;

              return (
                <button
                  key={sIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(sIdx);
                    setSlideProgress(0);
                    if (isPlaying) speakNarration(slides[sIdx].narration, playbackSpeed);
                  }}
                  className="h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer hover:bg-slate-700 transition"
                  title={`Jump to Step ${sIdx + 1}`}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-100"
                    style={{ width: `${fillWidth}%` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 sm:p-3 text-white flex flex-wrap items-center justify-between gap-2 z-20">
        {/* Left Side: Mode-specific info & quick action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {playerMode === 'video' ? (
            <>
              {!isVideoStarted ? (
                <button
                  type="button"
                  onClick={() => setIsVideoStarted(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Video</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsVideoStarted(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Reset video to preview"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Player</span>
                </button>
              )}

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-red-400 font-bold flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-slate-800"
                title="Watch directly on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Watch on YouTube</span>
              </a>

              <span className="text-xs text-slate-400 font-mono">
                {currentLesson?.duration || "10:15"}
              </span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleInteractivePlay}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-brand-400" />
                ) : (
                  <Play className="w-5 h-5 fill-brand-400 text-brand-400" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(prev => !prev);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-300 active:scale-95"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white active:scale-95"
                title="Restart lesson from Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-400 font-mono">
                Step {currentSlideIndex + 1} of {slides.length}
              </span>
            </>
          )}
        </div>

        {/* Right Side: Accessibility, Download & Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Captions Toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setCaptionsEnabled(!captionsEnabled); }}
            className={`px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
              captionsEnabled ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Subtitles / Captions"
            aria-label="Toggle Subtitles"
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Captions</span>
          </button>

          {/* Sign Language Overlay Toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSignLanguageOverlay(!signLanguageOverlay); }}
            className={`px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
              signLanguageOverlay ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Sign Language Interpreter (ISL)"
            aria-label="Toggle Sign Language Overlay"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Lang</span>
          </button>

          {/* Playback Speed (in interactive mode) */}
          {playerMode === 'interactive' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const speeds = [0.75, 1, 1.25, 1.5];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="px-2 py-1 rounded text-xs font-bold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
              title="Change narration playback speed"
            >
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{playbackSpeed}x</span>
            </button>
          )}

          {/* Offline Download Packet */}
          {!isDownloaded && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); downloadCourse(course?.id || ''); }}
              className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 active:scale-95 transition"
              title="Download full module for offline use"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Save Offline</span>
            </button>
          )}

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
