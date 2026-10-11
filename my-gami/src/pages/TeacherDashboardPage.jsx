import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialStudentRoster } from './AdminPortalPage';
import { 
  Users, 
  Plus, 
  Check, 
  HardDrive, 
  Bell, 
  Code, 
  CheckCircle, 
  Send, 
  X
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { currentUser } = useAuth();
  const [exportedZip, setExportedZip] = useState(false);

  // Load students assigned to this teacher
  const [assignedStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('gamilearn_admin_students');
      const all = saved ? JSON.parse(saved) : initialStudentRoster;
      // Filter for this teacher or show default batch students
      const teacherId = currentUser?.id || 'usr-teacher-01';
      const mine = all.filter(s => s.assignedTeacherId === teacherId || s.learningTrack === 'college');
      return mine.length > 0 ? mine : all.slice(0, 3);
    } catch (e) {
      return initialStudentRoster.slice(0, 3);
    }
  });

  // Announcements list
  const [announcements, setAnnouncements] = useState([
    {
      id: "ann-01",
      title: "Lab Practical Exam: C++ Pointers & Memory Management",
      date: "Friday, 02:00 PM",
      batch: "B.Tech CS 2026 - Sec A",
      content: "All students must submit their Linked List implementation before Friday 12:00 PM. Review lecture notes on valgrind memory leak checks."
    },
    {
      id: "ann-02",
      title: "New Docker Containerization Assignment Published",
      date: "Yesterday",
      batch: "B.Tech CS 2026 - Sec A",
      content: "The multi-stage Dockerfile assignment is live on your task planner. Please pull the starter repository from GitHub."
    }
  ]);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  // Assign Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Computer Science');
  const [taskCategory, setTaskCategory] = useState('Coding Lab');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskMinutes, setTaskMinutes] = useState(60);
  const [taskDueDate, setTaskDueDate] = useState('Today');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);
  const [teacherFeedback, setTeacherFeedback] = useState('Excellent pointer arithmetic and memory clean-up in the destructor!');

  const handleExportZip = () => {
    setExportedZip(true);
    setTimeout(() => setExportedZip(false), 3000);
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;

    const newNotice = {
      id: `ann-${Date.now()}`,
      title: newNoticeTitle,
      date: "Just now",
      batch: "B.Tech CS 2026 - Sec A",
      content: newNoticeContent || "Official faculty update for the batch."
    };

    setAnnouncements([newNotice, ...announcements]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setIsNoticeModalOpen(false);
    setToastMessage('Announcement broadcasted to assigned batch!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAssignTaskToStudents = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      subject: taskSubject,
      category: taskCategory,
      priority: taskPriority,
      estimatedMinutes: Number(taskMinutes) || 45,
      isCompleted: false,
      assignedBy: currentUser?.name || "Prof. Vikram Aditya (CS Dept)",
      assignedDate: "Today",
      dueDate: taskDueDate,
      notes: "Faculty-assigned practical requirement."
    };

    // Push into student scheduled tasks in localStorage
    try {
      const existingTasks = JSON.parse(localStorage.getItem('gamilearn_scheduled_tasks') || '[]');
      existingTasks.unshift(newTask);
      localStorage.setItem('gamilearn_scheduled_tasks', JSON.stringify(existingTasks));
    } catch (err) {
      console.warn("Could not save to student task store:", err);
    }

    setTaskTitle('');
    setIsTaskModalOpen(false);
    setToastMessage(`Assigned "${newTask.title}" to all students in Section A!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Faculty Command Center Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
              College Faculty Portal
            </span>
            <span className="text-xs text-emerald-200 font-semibold">
              Assigned by Admin • B.Tech CS Section A
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white">
            {currentUser?.name || "Prof. Vikram Aditya"}'s Faculty Command 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Department of Computer Science & Engineering. Overseeing college students assigned by Admin, assigning weekly coding lab challenges, and reviewing submissions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Action 1: Assign Lab Challenge */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Coding Lab Challenge</span>
          </button>

          {/* Action 2: Export Offline Pack */}
          <button
            onClick={handleExportZip}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition active:scale-95"
          >
            {exportedZip ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Bundle Created!</span>
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4 text-white" />
                <span>Export USB/BT Pack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Class Overview Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{assignedStudents.length}</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Allocated by Admin</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Batch Streak</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600">16.4 Days</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Continuous daily coding</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Lab Task Completion</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-600">92%</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">C++ & Java practicals</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Batch Section</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">Sec A (2026)</div>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">Data Structures & Cloud</span>
        </div>

      </div>

      {/* Assigned Student Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Assigned College Students Roster</span>
            </h3>
            <p className="text-xs text-slate-500">
              Students assigned to your supervision by the College Admin. Monitor code tasks and quiz performances.
            </p>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs inline-flex items-center gap-1.5 transition self-start sm:self-auto border border-brand-200"
          >
            <Code className="w-4 h-4 text-brand-600" />
            <span>New Lab Assignment</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll / Program</th>
                <th className="p-4">Daily Streak</th>
                <th className="p-4">XP Points</th>
                <th className="p-4">Coding Lab Status</th>
                <th className="p-4">Quiz Avg</th>
                <th className="p-4 text-right">Faculty Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {assignedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img 
                      src={st.avatar} 
                      alt={st.name} 
                      className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100" 
                    />
                    <div>
                      <p className="font-extrabold text-slate-900">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{st.email}</p>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 font-semibold">
                    {st.grade}
                  </td>

                  <td className="p-4 font-black text-orange-600">
                    🔥 {st.streak || 14} days
                  </td>

                  <td className="p-4 font-black text-brand-600">
                    {st.xp || 1820} XP
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 inline-block text-[11px]">
                      ✓ 4 Labs Submitted
                    </span>
                  </td>

                  <td className="p-4 font-extrabold text-slate-800">
                    {st.quizAvg || "88%"}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedStudentForReview(st)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold text-xs inline-flex items-center gap-1 border border-brand-200 transition"
                    >
                      <Code className="w-3.5 h-3.5 text-brand-600" />
                      <span>Review Code</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Announcements Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Batch Notices & Announcements</span>
            </h3>
            <p className="text-xs text-slate-500">
              Broadcast exam dates, lab schedules, and code guidelines directly to your assigned students.
            </p>
          </div>

          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((notice) => (
            <div key={notice.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {notice.batch}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{notice.date}</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{notice.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Lab Challenge Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Faculty Assignment Builder
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  Assign Coding Lab / Task to Batch
                </h3>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTaskToStudents} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Red-Black Tree Balancing in C++"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Subject Area
                  </label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="Computer Science">Computer Science & C++</option>
                    <option value="Software Engineering">Java Enterprise</option>
                    <option value="Cloud & DevOps">Docker & Cloud</option>
                    <option value="Developer Tools">Git & GitHub</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="Coding Lab">Coding Lab</option>
                    <option value="Project Sprint">Project Sprint</option>
                    <option value="Lecture Review">Lecture Review</option>
                    <option value="Quiz Prep">Quiz Prep</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Est. Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Target Due Date
                </label>
                <select
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="Today">Due Today</option>
                  <option value="Tomorrow">Due Tomorrow</option>
                  <option value="This Friday">Due This Friday</option>
                  <option value="Next Week">Due Next Week</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
                <span className="font-bold block">✨ Automatic Student Sync:</span>
                <span className="text-[11px] text-emerald-700 leading-tight block mt-0.5">
                  This task will instantly appear in all assigned Section A students' Task Planner and Student Dashboard!
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Push Task to Students</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">
                Broadcast Announcement to Section A
              </h3>
              <button 
                onClick={() => setIsNoticeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Notice Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Lab Viva on Friday"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Message Content
                </label>
                <textarea
                  rows="3"
                  placeholder="Details for students..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Student Code Review & Lab Submission Modal */}
      {selectedStudentForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudentForReview.avatar} 
                  alt={selectedStudentForReview.name} 
                  className="w-11 h-11 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-0.5 object-cover" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Code Submission Review
                    </span>
                    <span className="text-xs font-bold text-orange-600">
                      🔥 {selectedStudentForReview.streak || 14}d streak
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-slate-900 mt-0.5">
                    {selectedStudentForReview.name} — Lab Portfolio
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Student Stats */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total XP</span>
                <span className="font-black text-brand-600 text-sm">{selectedStudentForReview.xp || 1820} XP</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Quiz Average</span>
                <span className="font-black text-slate-900 text-sm">{selectedStudentForReview.quizAvg || "88%"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Labs Passed</span>
                <span className="font-black text-emerald-600 text-sm">4 / 4 Completed</span>
              </div>
            </div>

            {/* Lab Submissions List */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-700">
                Recent Practical Lab Submissions:
              </h4>

              {/* Lab 1 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Lab 1: C++ Doubly Linked List with Pointer Destructor
                    </h5>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Grade: A+ (98/100)
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <code>{`template <typename T>
void DoublyLinkedList<T>::insertAtTail(const T& val) {
    Node<T>* newNode = new Node<T>(val);
    if (!tail) { head = tail = newNode; }
    else { tail->next = newNode; newNode->prev = tail; tail = newNode; }
    size++;
}`}</code>
                </div>
                <p className="text-[11px] text-slate-500">
                  Unit tests: 8/8 passed • Valgrind check: 0 memory leaks detected.
                </p>
              </div>

              {/* Lab 2 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Lab 2: Multi-Stage Production Dockerfile for .NET & React
                    </h5>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Grade: A (95/100)
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <code>{`FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Gamiweb.dll"]`}</code>
                </div>
                <p className="text-[11px] text-slate-500">
                  Build verification: Clean multi-stage layers • Final image size: 142 MB.
                </p>
              </div>
            </div>

            {/* Faculty Feedback Form */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Faculty Instructor Remarks & Feedback:
              </label>
              <textarea
                rows="2"
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setToastMessage(`Grade & Feedback saved for ${selectedStudentForReview.name}!`);
                  setSelectedStudentForReview(null);
                  setTimeout(() => setToastMessage(''), 3500);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Save Grade</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStudentForReview(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
