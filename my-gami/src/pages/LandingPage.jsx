import React from 'react';
import { Link } from 'react-router-dom';
import { 
  WifiOff, 
  Bot, 
  Globe, 
  Trophy, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  ShieldCheck,
  GraduationCap,
  School
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-extrabold border border-brand-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Designed for Rural, Tribal & Low-Bandwidth Learners</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Quality Education,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                Even Without Internet
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A gamified learning platform tailored for rural students. Download once to your mobile or tablet, learn anytime offline, earn XP rewards, and clear doubts in your mother tongue with our offline AI tutor.
            </p>

            {/* Portal Gateway CTA */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4">
              <Link
                to="/portals"
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-xl shadow-brand-200 hover:shadow-brand-300 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Enter Learning Portals & Login Gateway</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Two Distinct Learning Tracks Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl w-full pt-2 text-left">
                <Link
                  to="/portals"
                  className="p-4 rounded-2xl bg-white border border-purple-200 shadow-xs hover:border-purple-400 hover:shadow-md transition flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block mb-1 border border-purple-200">
                      Self-Paced Track
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-700 transition">
                      AI Teacher Interactive Classes
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-1">
                      Independent learners study at their own pace: 24/7 AI Teacher conducts lectures, walks through code, and solves doubts.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/portals"
                  className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1 border border-blue-200">
                      College Enrolled Track
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700 transition">
                      Admin-Assigned Faculty & Labs
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-1">
                      Enrolled college students are assigned faculty by the Admin, with official lab schedules, reviews, and faculty portal.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-500" /> 100% Offline-Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-500" /> 7 Regional Indian Languages
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-500" /> Indian Sign Language (ISL) Built-In
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Bridging the Rural Digital Divide
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Standard platforms fail when broadband cuts out. GamiLearn is architected from day one for harsh remote environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border-2 border-rose-200">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-xs">✕</span>
                <span>The Reality in Rural Schools</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Frequent electricity and cellular network outages freeze video streaming platforms.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>High student-to-teacher ratios leave students with unresolved doubts and weak fundamentals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Content is overwhelmingly in English, creating cognitive barriers for vernacular learners.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Deaf and hard-of-hearing rural students are almost entirely left behind.</span>
                </li>
              </ul>
            </div>

            {/* The GamiLearn Solution */}
            <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-xs text-emerald-800">✓</span>
                <span>The GamiLearn Solution</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Ultra-compressed micro-packets (under 15 MB per topic) cached for complete offline study.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>On-device voice AI doubt solver that explains math and science step-by-step in native tongue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Gamified daily streaks, village school leaderboards, XP badges, and celebration confetti.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Integrated Indian Sign Language (ISL) video avatar and multi-language captions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Empowering Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Engineered for Every Village Classroom
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                Offline-First Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download interactive lessons, quizzes, and AI notes when connected. Complete quizzes offline; scores sync automatically when back online.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                Voice & Multilingual AI Tutor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students can speak their doubts aloud in Hindi, Tamil, Telugu, Bengali, Marathi, or English and receive clear step-by-step guidance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                Gamification & XP Rewards
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Level up, collect badges, maintain learning streaks, and compete on inter-village school leaderboards with fellow learners.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                Regional Indian Curriculum
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practical courses that matter: market fractions, soil health, organic vermicompost, solar lighting, and safe UPI digital banking.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                Universal Accessibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indian Sign Language (ISL) picture-in-picture translator, high-contrast yellow-on-black theme, dyslexia friendly fonts, and scalable text.
              </p>
            </div>

            {/* Feature 6 */}
            <Link to="/portals" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-400 transition group block text-left">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition mb-2">
                Multi-Role Portals & Admin Hub
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated gateways for Self-Paced Learners (AI Teacher), College Enrolled Students, Faculty Portals, and College Admin teacher assignment.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-14 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black">1,200+</div>
              <p className="text-xs sm:text-sm text-brand-100 font-semibold mt-1">Rural Schools Connected</p>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black">85,000+</div>
              <p className="text-xs sm:text-sm text-brand-100 font-semibold mt-1">Enrolled Village Youth</p>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black">450k+</div>
              <p className="text-xs sm:text-sm text-brand-100 font-semibold mt-1">Offline Hours Studied</p>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black">3,400+</div>
              <p className="text-xs sm:text-sm text-brand-100 font-semibold mt-1">Teachers & Mentors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-200">
            GamiLearn Rural Platform • Empowering Remote Communities With Gamified Education
          </p>
          <p className="text-slate-500">
            Works offline on low-end Android mobile devices, tablets, and smart TVs.
          </p>
        </div>
      </footer>
    </div>
  );
}
