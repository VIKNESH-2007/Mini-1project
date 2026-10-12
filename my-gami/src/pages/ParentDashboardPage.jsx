import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import { 
  Flame, 
  Zap, 
  MessageSquare, 
  Send, 
  Bell, 
  ShieldCheck, 
  Check,
  BookOpen,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ParentDashboardPage() {
  const { currentUser } = useAuth();
  const { xp, streak, level } = useXP();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [sentMessagesHistory, setSentMessagesHistory] = useState([
    {
      id: 'msg-1',
      sender: 'Prof. Senthil Nathan (CS Faculty)',
      text: 'Sanjay is showing excellent progress in C++ Pointers, Java OOP, and Docker labs. He also assists classmates with offline course packet syncing.',
      time: 'Yesterday, 4:15 PM',
      fromTeacher: true
    }
  ]);

  const subjectPerformance = [
    { subject: "Data Structures & Algorithms in C++", instructor: "Prof. Senthil Nathan", score: 92, grade: "A+", status: "Excellent", color: "bg-brand-500" },
    { subject: "Java Enterprise & OOP Software Engineering", instructor: "Dr. Ananya Ray", score: 88, grade: "A", status: "Very Good", color: "bg-blue-500" },
    { subject: "Docker & Containerization DevOps", instructor: "Siddharth Menon", score: 95, grade: "O", status: "Outstanding", color: "bg-emerald-500" },
    { subject: "Git & GitHub Version Control Workflows", instructor: "Rohit Nair", score: 96, grade: "O", status: "Outstanding", color: "bg-purple-500" }
  ];

  const labTasksStatus = [
    { id: "lab-1", title: "Implement Doubly Linked List in C++", subject: "Computer Science", due: "Completed Today", done: true },
    { id: "lab-2", title: "Java HashMap & Collections Lab", subject: "Software Engineering", due: "Completed Yesterday", done: true },
    { id: "lab-3", title: "Dockerize React Frontend & ASP.NET Core API", subject: "Cloud & DevOps", due: "Due Tomorrow, 4:00 PM", done: false },
    { id: "lab-4", title: "Git Rebase & Merge Conflict Resolution", subject: "Developer Tools", due: "Due Friday, 11:00 AM", done: false }
  ];

  const milestones = [
    { id: 1, title: "18-Day Consecutive Coding & Lab Streak!", date: "Today, 8:30 AM", icon: "🔥", color: "bg-orange-100 text-orange-800" },
    { id: 2, title: "Scored 100% in C++ Pointers & Memory Quiz", date: "Yesterday, 5:45 PM", icon: "⚡", color: "bg-blue-100 text-blue-800" },
    { id: 3, title: "Unlocked 'C++ Systems Architect' Badge", date: "2 Days Ago", icon: "🏆", color: "bg-emerald-100 text-emerald-800" },
    { id: 4, title: "Completed Multi-Container Docker Lab", date: "3 Days Ago", icon: "🐳", color: "bg-amber-100 text-amber-800" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!teacherMessage.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: `${currentUser?.name || 'Murugan'} (Parent)`,
      text: teacherMessage.trim(),
      time: 'Just now',
      fromTeacher: false
    };
    setSentMessagesHistory(prev => [...prev, newMsg]);
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowMessageModal(false);
      setTeacherMessage('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner: Parent & Child Overview */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-teal-100 px-3 py-1 rounded-full backdrop-blur-xs">
            Guardian & Parent Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Vanakkam / Namaste, {currentUser?.name || "Murugan"}! 👨‍👦
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            Monitoring daily academic attendance, coding lab completion & performance for your child, <span className="font-bold text-white">Sanjay (B.Tech Computer Science - Year 2)</span> • Mentor: <span className="font-bold text-white">Prof. Senthil Nathan</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/reports"
            className="px-4 py-3 rounded-2xl bg-teal-900/50 hover:bg-teal-900/70 border border-teal-400/30 text-white font-extrabold text-xs flex items-center gap-2 transition"
          >
            <BarChart3 className="w-4 h-4 text-teal-200" />
            <span>View Full Report Card</span>
          </Link>
          <button
            onClick={() => setShowMessageModal(true)}
            className="px-5 py-3 rounded-2xl bg-white text-teal-900 font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-teal-50 transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <span>Message Prof. Senthil Nathan</span>
          </button>
        </div>
      </div>

      {/* 2. Child Attendance, Streak, XP & Study Time KPI Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Weekly Attendance</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">7 / 7 days active in class</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Continuous Streak</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-orange-500" />
            <span>{streak} Days</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Consistent daily lab practice</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Academic XP & Level</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center gap-1">
            <Zap className="w-5 h-5 fill-amber-500" />
            <span>Lvl {level}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">{xp} Total Knowledge XP</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Productive Study Time</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">95 mins/day</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Above 60 mins daily target</span>
        </div>
      </div>

      {/* 3. Subject-Wise Academic Marks & Lab Assignments Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject-Wise Performance */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Subject-Wise Academic Progress</h3>
                  <p className="text-xs text-slate-500">Sanjay's current semester course mastery & grades</p>
                </div>
              </div>
              <Link
                to="/reports"
                className="text-xs font-extrabold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {subjectPerformance.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900">{item.subject}</p>
                      <p className="text-[11px] text-slate-500">Faculty: {item.instructor}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                        Grade {item.grade}
                      </span>
                      <span className="text-sm font-black text-slate-900">{item.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Child's Lab Assignments & Class Schedule */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Lab Assignments & Schedule Tracker</h3>
                  <p className="text-xs text-slate-500">Completed and upcoming practical tasks assigned by faculty</p>
                </div>
              </div>
              <Link
                to="/timetable"
                className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {labTasksStatus.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {task.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900">{task.title}</p>
                      <p className="text-[11px] text-slate-500">{task.subject} • {task.due}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {task.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recent Learning Milestones & Faculty Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Child Milestones */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Learning Milestones & Honors</h3>
              <p className="text-xs text-slate-500">Live notifications of Sanjay's academic achievements</p>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${m.color}`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">{m.title}</p>
                  <p className="text-[11px] text-slate-400">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Remarks & Parent-Teacher Communication Log */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Faculty Remarks — Prof. Senthil Nathan</h3>
                <p className="text-xs text-slate-500">Associate Professor & Computer Science Lab Head</p>
              </div>
            </div>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {sentMessagesHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1 border ${
                    msg.fromTeacher
                      ? 'bg-teal-50/60 border-teal-100 text-teal-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 ml-6'
                  }`}
                >
                  <div className="flex items-center justify-between font-extrabold text-[11px]">
                    <span className={msg.fromTeacher ? 'text-teal-800' : 'text-slate-700'}>{msg.sender}</span>
                    <span className="text-slate-400 font-normal">{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs font-bold text-emerald-900 flex justify-between mb-4">
              <span>Faculty Recommendation:</span>
              <span>Complete Docker Compose Sprint before Friday</span>
            </div>
          </div>

          <button
            onClick={() => setShowMessageModal(true)}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Message to Prof. Senthil Nathan</span>
          </button>
        </div>

      </div>

      {/* Message Teacher Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-black text-base text-slate-900">
              Message to Prof. Senthil Nathan
            </h3>
            <p className="text-xs text-slate-500">
              Send a question or update regarding Sanjay's B.Tech CS coursework, attendance, or lab schedule.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={4}
                required
                value={teacherMessage}
                onChange={(e) => setTeacherMessage(e.target.value)}
                placeholder="Vanakkam Professor, Sanjay has completed the C++ Linked List lab assignment today..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-teal-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={messageSent}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {messageSent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
