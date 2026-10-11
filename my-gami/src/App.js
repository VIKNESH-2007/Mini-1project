import React, { useState } from 'react';
import { BrowserRouter, useLocation, Link } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { OfflineProvider } from './context/OfflineContext';
import { GamificationProvider } from './context/GamificationContext';

import OfflineBanner from './components/common/OfflineBanner';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import SignLanguageModal from './components/common/SignLanguageModal';
import VoiceAssistantModal from './components/common/VoiceAssistantModal';
import ConfettiReward from './components/common/ConfettiReward';
import AppRoutes from './routes/AppRoutes';

import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Bot, 
  User, 
  ListTodo
} from 'lucide-react';

function AppLayout() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
      {/* Persistent Offline Mode Banner & Sync Status */}
      <OfflineBanner />

      {/* Global Navbar */}
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
        onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar Drawer (hidden on landing & auth) */}
        {!isLandingPage && !isAuthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 w-full min-w-0 transition-all ${
          isLandingPage || isAuthPage ? 'p-0' : 'p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8'
        }`}>
          <AppRoutes />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (For Rural Android Devices) */}
      {!isLandingPage && !isAuthPage && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden flex items-center justify-around py-2 px-1 shadow-lg"
          aria-label="Mobile Navigation"
        >
          <Link
            to="/dashboard"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname === '/dashboard' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>{t("Home")}</span>
          </Link>

          <Link
            to="/courses"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname.startsWith('/course') ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>{t("Courses")}</span>
          </Link>

          <Link
            to="/tasks"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname === '/tasks' ? 'text-purple-600' : 'text-slate-500'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>{t("Tasks")}</span>
          </Link>

          <Link
            to="/quiz"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname === '/quiz' ? 'text-amber-600' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>{t("Quiz")}</span>
          </Link>

          <Link
            to="/ai-tutor"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname === '/ai-tutor' ? 'text-purple-600' : 'text-slate-500'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span>{t("AI Tutor")}</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-extrabold transition ${
              location.pathname === '/profile' ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{t("Profile")}</span>
          </Link>
        </nav>
      )}

      {/* Floating Indian Sign Language (ISL) PIP Modal */}
      <SignLanguageModal />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal 
        isOpen={voiceAssistantOpen} 
        onClose={() => setVoiceAssistantOpen(false)} 
      />

      {/* Celebration Reward & Confetti Popup */}
      <ConfettiReward />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <OfflineProvider>
              <GamificationProvider>
                <AppLayout />
              </GamificationProvider>
            </OfflineProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
