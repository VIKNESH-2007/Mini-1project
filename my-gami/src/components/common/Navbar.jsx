import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useXP } from '../../context/GamificationContext';
import { 
  BookOpen, 
  Flame, 
  Zap, 
  Globe, 
  Sliders, 
  Menu, 
  User, 
  LogOut, 
  Bot,
  Volume2
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, onOpenVoiceAssistant }) {
  const { currentUser, switchRole } = useAuth();
  const { language, setLanguage, supportedLanguages, speak, t } = useLanguage();
  const { xp, streak, level } = useXP();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/' || location.pathname === '/auth';
  const isPortalsPage = location.pathname === '/portals' || location.pathname === '/landing';

  const handleRoleChange = (role) => {
    switchRole(role);
    setShowRoleMenu(false);
    if (role === 'student') navigate('/dashboard');
    else if (role === 'parent') navigate('/parent');
    else if (role === 'teacher') navigate('/teacher');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-200 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden min-[420px]:block">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 flex items-center gap-1">
                  Gami<span className="text-brand-600">Learn</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded ml-1">
                    Rural
                  </span>
                </span>
                <p className="text-[10px] text-slate-500 hidden md:block">{t("AI & Offline Rural Learning")}</p>
              </div>
            </Link>
          </div>

          {/* Center/Right: Gamification Badges (Visible for student) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Center/Right: Gamification Badges (Hidden on login/auth page) */}
            {!isAuthPage && !isPortalsPage && currentUser?.role === 'student' && (
              <>
                {/* Streak Flame */}
                <div 
                  className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                  title="Your continuous daily learning streak"
                >
                  <Flame className="w-4 h-4 text-orange-500 animate-flame-streak fill-orange-500" />
                  <span className="font-extrabold">{streak}</span>
                  <span className="hidden sm:inline text-[11px] font-medium text-amber-600">{t("days")}</span>
                </div>

                {/* Level & XP */}
                <div 
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                  title={`Level ${level} - Total XP: ${xp}`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-slate-700 hidden md:inline">Lvl {level}</span>
                  <span className="bg-emerald-600 text-white text-[11px] px-1.5 py-0.2 rounded font-extrabold">
                    {xp} <span className="font-normal text-[9px]">XP</span>
                  </span>
                </div>
              </>
            )}

            {/* Voice Assistant Shortcut (Hidden on login/auth page) */}
            {!isAuthPage && !isPortalsPage && (
              <button
                onClick={onOpenVoiceAssistant}
                className="p-1.5 sm:p-2 rounded-full text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition active:scale-95 flex items-center gap-1"
                title="Speak voice command or ask doubt in local language"
                aria-label="Open Voice Assistant"
              >
                <Bot className="w-4 h-4" />
                <span className="text-xs font-semibold hidden lg:inline">{t("Voice Assistant")}</span>
              </button>
            )}

            {/* Read Aloud Helper (Hidden on login/auth page) */}
            {!isAuthPage && !isPortalsPage && (
              <button
                onClick={() => speak("Welcome to GamiLearn Rural. An offline-capable AI learning platform for students.")}
                className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:bg-slate-100 transition hidden sm:flex"
                title="Listen to page summary (Text to Speech)"
                aria-label="Read page out loud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowRoleMenu(false);
                }}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-brand-600" />
                <span className="uppercase font-bold">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("Select Language")}
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        language === lang.code ? 'font-bold text-brand-700 bg-brand-50' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <span className="text-brand-600 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            {!isAuthPage && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowLangMenu(false);
                }}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                title="Switch active user role (Student, Parent, Teacher)"
              >
                <img 
                  src={currentUser?.avatar} 
                  alt={currentUser?.name} 
                  className="w-6 h-6 rounded-full bg-brand-100 border border-slate-300 object-cover"
                />
                <span className="capitalize hidden sm:inline">{t(currentUser?.role || 'Role')}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.school || currentUser?.village}</p>
                  </div>
                  
                  <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("Quick Role Switch:")}
                  </div>

                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                      currentUser?.role === 'student' ? 'font-bold text-brand-700 bg-brand-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{t("Student (Sanjay)")}</span>
                    {currentUser?.role === 'student' && <span className="text-brand-600">✓</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('teacher')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                      currentUser?.role === 'teacher' ? 'font-bold text-brand-700 bg-brand-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{t("Faculty (Prof. Senthil Nathan)")}</span>
                    {currentUser?.role === 'teacher' && <span className="text-brand-600">✓</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                      currentUser?.role === 'admin' ? 'font-bold text-brand-700 bg-brand-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{t("College Admin (Dr. Aruna)")}</span>
                    {currentUser?.role === 'admin' && <span className="text-brand-600">✓</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('parent')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                      currentUser?.role === 'parent' ? 'font-bold text-brand-700 bg-brand-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{t("Parent (Murugan)")}</span>
                    {currentUser?.role === 'parent' && <span className="text-brand-600">✓</span>}
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      to="/portals"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-brand-700 font-bold hover:bg-brand-50"
                    >
                      <span>{t("All Portals & Hub")}</span>
                    </Link>
                    <Link
                      to="/accessibility"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t("Accessibility Settings")}</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t("My Profile & Badges")}</span>
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("Log Out / Switch Account")}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
