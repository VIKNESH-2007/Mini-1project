import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOfflineSync } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  Bot, 
  Calendar, 
  BarChart3, 
  ListTodo,
  Users, 
  Sliders, 
  UserCheck, 
  DownloadCloud, 
  X,
  GraduationCap,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { cachedCourses } = useOfflineSync();
  const { t } = useLanguage();

  const getRoleNavItems = (role) => {
    switch (role) {
      case 'teacher':
        return [
          { to: "/teacher", label: "Teacher & Faculty Portal", icon: GraduationCap, highlight: true, badge: "Command" },
          { to: "/courses", label: "Engineering Curriculum", icon: BookOpen, badge: "Syllabus" },
          { to: "/tasks", label: "Assign Lab Challenges", icon: ListTodo, badge: "Labs" },
          { to: "/timetable", label: "Lecture Schedule", icon: Calendar },
          { to: "/reports", label: "Batch Performance Reports", icon: BarChart3 },
          { to: "/profile", label: "Faculty Profile", icon: UserCheck },
          { to: "/accessibility", label: "Accessibility Settings", icon: Sliders },
          { to: "/auth", label: "Login & Portals Gateway", icon: Compass, badge: "Portals" }
        ];

      case 'admin':
        return [
          { to: "/admin", label: "College Admin Command", icon: ShieldCheck, highlight: true, badge: "Admin" },
          { to: "/teacher", label: "Teacher Directory & Workload", icon: GraduationCap, badge: "Faculty" },
          { to: "/courses", label: "Curriculum Repository", icon: BookOpen },
          { to: "/reports", label: "Institutional Analytics", icon: BarChart3 },
          { to: "/accessibility", label: "Accessibility Settings", icon: Sliders },
          { to: "/auth", label: "Login & Portals Gateway", icon: Compass, badge: "Portals" }
        ];

      case 'parent':
        return [
          { to: "/parent", label: "Parent Portal", icon: Users, highlight: true },
          { to: "/reports", label: "Child's Progress Report", icon: BarChart3 },
          { to: "/timetable", label: "Class Timetable", icon: Calendar },
          { to: "/accessibility", label: "Accessibility Settings", icon: Sliders },
          { to: "/auth", label: "Login & Portals Gateway", icon: Compass, badge: "Portals" }
        ];

      case 'student':
      default:
        return [
          { to: "/dashboard", label: "Student Dashboard", icon: LayoutDashboard, highlight: true },
          { to: "/courses", label: "College Courses & Labs", icon: BookOpen, badge: "Offline" },
          { to: "/ai-tutor", label: "AI Teacher Classroom", icon: Bot, badge: "24/7 AI" },
          { to: "/tasks", label: "Task Planner & Progress", icon: ListTodo, badge: "Tasks" },
          { to: "/quiz", label: "Daily Coding Quiz", icon: HelpCircle, badge: "+100 XP" },
          { to: "/leaderboard", label: "Class Leaderboard", icon: Trophy },
          { to: "/timetable", label: "Batch Timetable", icon: Calendar },
          { to: "/reports", label: "Progress & Report Card", icon: BarChart3 },
          { to: "/profile", label: "Profile & CS Badges", icon: UserCheck },
          { to: "/accessibility", label: "Accessibility Settings", icon: Sliders },
          { to: "/auth", label: "Login & Portals Gateway", icon: Compass, badge: "Portals" }
        ];
    }
  };

  const navItems = getRoleNavItems(currentUser?.role || 'student');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main Navigation"
      >
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-base">{t("Navigation")}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-11 h-11 rounded-full border-2 border-brand-500 bg-brand-50"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-slate-900 truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-brand-100 text-brand-800">
                  {t(currentUser?.role || 'student')}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {t(currentUser?.village || "Rural Learner")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-200'
                        : item.highlight
                        ? 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : item.highlight ? 'text-purple-600' : 'text-slate-500'
                        }`} />
                        <span>{t(item.label)}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-brand-100 text-brand-700'
                        }`}>
                          {t(item.badge)}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
        </nav>

        {/* Offline Storage Status Widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <DownloadCloud className="w-4 h-4 text-brand-600" />
                <span>{t("Offline Packet Store")}</span>
              </span>
              <span className="text-brand-600 font-extrabold">{cachedCourses.length} {t("Ready")}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {cachedCourses.length > 0
                ? `${cachedCourses.length} ${t("subjects cached locally for zero-internet access.", "subjects cached locally for zero-internet access.")}`
                : t("No courses downloaded yet. Click download on courses to study offline.")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
