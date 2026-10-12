import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/GamificationContext';
import { useOfflineSync } from '../context/OfflineContext';
import { api } from '../services/api';
import { 
  CheckSquare, 
  CalendarCheck, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  TrendingUp, 
  Zap, 
  Calendar, 
  BarChart2, 
  X
} from 'lucide-react';

const INITIAL_MOCK_TASKS = [
  {
    id: "task-01",
    title: "Implement Doubly Linked List with Head & Tail Pointers",
    description: "Write C++ class with insertAtHead, insertAtTail, deleteNode, and reverseTraversal methods.",
    subject: "Computer Science",
    category: "Coding Lab",
    priority: "High",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 60,
    isCompleted: true,
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reminderEnabled: true
  },
  {
    id: "task-02",
    title: "Watch Java Collections & HashMap Bucket Internals",
    description: "Study how hash codes map to bucket indices and how tree bins handle hash collisions.",
    subject: "Software Engineering",
    category: "Lecture Review",
    priority: "Medium",
    dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 45,
    isCompleted: true,
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reminderEnabled: true
  },
  {
    id: "task-03",
    title: "Dockerize React Frontend & ASP.NET Core API",
    description: "Author multi-stage Dockerfiles and docker-compose.yml with bridge network and persistent volume.",
    subject: "Cloud & DevOps",
    category: "Project Sprint",
    priority: "High",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 90,
    isCompleted: false,
    reminderEnabled: true
  },
  {
    id: "task-04",
    title: "Git Interactive Rebase & Conflict Resolution Sprint",
    description: "Practice squashing feature commits and resolving 3-way conflict markers cleanly in Git CLI.",
    subject: "Developer Tools",
    category: "Coding Lab",
    priority: "Medium",
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 40,
    isCompleted: false,
    reminderEnabled: true
  },
  {
    id: "task-05",
    title: "C Dynamic Memory & Valgrind Memory Leak Audit",
    description: "Debug dangling pointers, check for buffer overflows, and ensure all malloc blocks are freed.",
    subject: "Systems Programming",
    category: "Debugging",
    priority: "High",
    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 50,
    isCompleted: false,
    reminderEnabled: true
  },
  {
    id: "task-06",
    title: "Build RESTful Endpoints with EF Core & C#",
    description: "Create async controller endpoints with dependency injection and DTO validations in .NET 10.",
    subject: "Web & API Engineering",
    category: "Project Sprint",
    priority: "Medium",
    dueDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
    estimatedMinutes: 75,
    isCompleted: false,
    reminderEnabled: true
  }
];

const SUBJECTS = [
  "All",
  "Computer Science",
  "Software Engineering",
  "Systems Programming",
  "Web & API Engineering",
  "Developer Tools",
  "Cloud & DevOps"
];

const SUBJECT_COLORS = {
  "Computer Science": "bg-blue-100 text-blue-800 border-blue-200",
  "Software Engineering": "bg-amber-100 text-amber-800 border-amber-200",
  "Systems Programming": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Web & API Engineering": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Developer Tools": "bg-purple-100 text-purple-800 border-purple-200",
  "Cloud & DevOps": "bg-cyan-100 text-cyan-800 border-cyan-200"
};

const CATEGORIES = [
  "Coding Lab",
  "Lecture Review",
  "Project Sprint",
  "Quiz Practice",
  "Debugging",
  "Revision"
];

export default function TaskPlannerPage() {
  const { currentUser } = useAuth();
  const { addXP, fireConfetti } = useXP();
  const { isOnline } = useOfflineSync();

  // Tasks state with LocalStorage caching
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('gamilearn_scheduled_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        const nowMs = Date.now();
        return parsed.map((t, idx) => {
          if (!t.isCompleted && t.dueDate && new Date(t.dueDate).getTime() < nowMs) {
            return {
              ...t,
              dueDate: new Date(nowMs + (idx + 1) * 24 * 60 * 60 * 1000).toISOString()
            };
          }
          return t;
        });
      }
    } catch (e) {
      console.warn('Could not read cached tasks from localStorage', e);
    }
    return INITIAL_MOCK_TASKS;
  });

  const [completionBannerMsg, setCompletionBannerMsg] = useState('');

  // Filters & Search
  const [activeTab, setActiveTab] = useState('All'); // All, Today, Upcoming, In Progress, Completed, Overdue
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science');
  const [formCategory, setFormCategory] = useState('Coding Lab');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formDate, setFormDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [formTime, setFormTime] = useState('14:00');
  const [formMinutes, setFormMinutes] = useState(45);
  const [formReminder, setFormReminder] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gamilearn_scheduled_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed saving tasks to localStorage', e);
    }
  }, [tasks]);

  // Load from backend if online
  useEffect(() => {
    async function loadBackendTasks() {
      if (!isOnline) return;
      try {
        const studentId = currentUser?.id || 'usr-student-01';
        const res = await api.tasks.getAll(studentId);
        if (res && res.success && res.data && res.data.length > 0) {
          setTasks(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch tasks from server, using local cache:', err);
      }
    }
    loadBackendTasks();
  }, [isOnline, currentUser?.id]);

  // Progress Calculations
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMinutes = tasks.filter(t => t.isCompleted).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

  // Subject Progress Breakdown
  const collegeSubjects = [
    "Computer Science",
    "Software Engineering",
    "Systems Programming",
    "Web & API Engineering",
    "Developer Tools",
    "Cloud & DevOps"
  ];

  const subjectStats = collegeSubjects.map(sub => {
    const subTasks = tasks.filter(t => t.subject === sub);
    const total = subTasks.length;
    const done = subTasks.filter(t => t.isCompleted).length;
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { subject: sub, total, done, rate };
  });

  // Toggle Task Completion (Cross-Check & Verify)
  const handleToggleTask = async (task) => {
    const newStatus = !task.isCompleted;
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          isCompleted: newStatus,
          completedAt: newStatus ? new Date().toISOString() : null
        };
      }
      return t;
    });
    setTasks(updated);

    if (newStatus) {
      addXP(40, "Task Cross-Checked & Completed! 🚀", `+40 XP: You finished "${task.title}"`);
      fireConfetti();
      setCompletionBannerMsg(`✅ Cross-Check Verified: "${task.title}" has been completed successfully! (+40 XP Awarded)`);
    } else {
      setCompletionBannerMsg('');
    }

    if (isOnline) {
      try {
        await api.tasks.toggle(task.id);
      } catch (err) {
        console.warn('Backend sync failed, state preserved locally:', err);
      }
    }
  };

  // Open modal for new task
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormSubject('Computer Science');
    setFormCategory('Coding Lab');
    setFormPriority('Medium');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDate(tomorrow.toISOString().split('T')[0]);
    setFormTime('14:00');
    setFormMinutes(45);
    setFormReminder(true);
    setShowAddModal(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormSubject(task.subject);
    setFormCategory(task.category || 'Coding Lab');
    setFormPriority(task.priority || 'Medium');
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      setFormDate(d.toISOString().split('T')[0]);
      setFormTime(d.toTimeString().slice(0, 5));
    }
    setFormMinutes(task.estimatedMinutes || 45);
    setFormReminder(task.reminderEnabled ?? true);
    setShowAddModal(true);
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const dueDateTime = new Date(`${formDate}T${formTime}:00`);

    if (editingTask) {
      const updated = tasks.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            title: formTitle.trim(),
            description: formDescription.trim(),
            subject: formSubject,
            category: formCategory,
            priority: formPriority,
            dueDate: dueDateTime.toISOString(),
            estimatedMinutes: parseInt(formMinutes) || 45,
            reminderEnabled: formReminder
          };
        }
        return t;
      });
      setTasks(updated);

      if (isOnline) {
        try {
          await api.tasks.update(editingTask.id, {
            title: formTitle.trim(),
            description: formDescription.trim(),
            subject: formSubject,
            category: formCategory,
            priority: formPriority,
            dueDate: dueDateTime.toISOString(),
            estimatedMinutes: parseInt(formMinutes) || 45,
            reminderEnabled: formReminder
          });
        } catch (err) {
          console.warn('Backend update failed, saved locally:', err);
        }
      }
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        studentId: currentUser?.id || 'usr-student-01',
        title: formTitle.trim(),
        description: formDescription.trim(),
        subject: formSubject,
        category: formCategory,
        priority: formPriority,
        dueDate: dueDateTime.toISOString(),
        estimatedMinutes: parseInt(formMinutes) || 45,
        isCompleted: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        reminderEnabled: formReminder,
        assignedBy: currentUser?.role === 'teacher' ? (currentUser?.name || "Prof. Vikram Aditya (CS Dept)") : undefined
      };

      setTasks(prev => [newTask, ...prev]);

      if (isOnline) {
        try {
          await api.tasks.create(newTask);
        } catch (err) {
          console.warn('Backend task create failed, saved locally:', err);
        }
      }
    }

    setShowAddModal(false);
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (isOnline) {
      try {
        await api.tasks.delete(id);
      } catch (err) {
        console.warn('Backend delete failed, updated locally:', err);
      }
    }
  };

  // Filtering Logic
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const filteredTasks = tasks.filter(task => {
    // Subject filter
    if (selectedSubject !== 'All' && task.subject !== selectedSubject) return false;

    // Priority filter
    if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (task.title || '').toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchSub = (task.subject || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }

    // Tab filter
    const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

    if (activeTab === 'Completed') {
      return task.isCompleted;
    }
    if (activeTab === 'In Progress') {
      return !task.isCompleted;
    }
    if (activeTab === 'Today') {
      if (!taskDueDate) return false;
      return taskDueDate >= startOfToday && taskDueDate < endOfToday;
    }
    if (activeTab === 'Upcoming') {
      if (!taskDueDate) return false;
      return !task.isCompleted && taskDueDate >= endOfToday;
    }
    if (activeTab === 'Overdue') {
      if (!taskDueDate) return false;
      return !task.isCompleted && taskDueDate < now;
    }

    return true; // 'All'
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Task Scheduler & Progress Tracking
            </span>
            <span className="text-xs font-bold text-slate-400">
              {isOnline ? '🟢 Cloud Sync' : '🟡 Offline Mode'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Student Task Planner & Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule your coding sessions, labs, and assignments, assign deadlines, and monitor your college mastery velocity.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Task</span>
        </button>
      </div>

      {/* Progress Tracking Dashboard: 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Completion Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{completionPercentage}%</span>
            <span className="text-xs font-bold text-emerald-600">
              {completedTasksCount}/{totalTasksCount} Done
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-brand-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* 2. Pending Tasks */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tasks</span>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{pendingTasksCount}</div>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">
            {tasks.filter(t => !t.isCompleted && t.priority === 'High').length} High Priority items
          </span>
        </div>

        {/* 3. Study Time */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Time Logged</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {Math.floor(completedMinutes / 60)}h {completedMinutes % 60}m
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">
            Goal: {Math.floor(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m planned
          </span>
        </div>

        {/* 4. Gamified Motivation */}
        <div className="bg-gradient-to-br from-brand-600 to-teal-700 text-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-100">Tasks Reward</span>
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">+{completedTasksCount * 40} XP</div>
            <p className="text-[11px] text-brand-100 mt-0.5">
              +40 XP earned for every scheduled task completed!
            </p>
          </div>
        </div>

      </div>

      {/* Visual Analytics: Subject Task Distribution */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Curriculum Task Progress by Subject</h3>
              <p className="text-xs text-slate-500">Track balance across your programming languages & developer tools</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {collegeSubjects.length} Engineering Tracks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map(stat => (
            <div key={stat.subject} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-800 truncate pr-2">{stat.subject}</span>
                <span className="text-slate-900 shrink-0">{stat.done} / {stat.total}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>{stat.rate}% completed</span>
                <span>{stat.total === 0 ? 'No tasks' : stat.done === stat.total ? '🎉 All Done' : `${stat.total - stat.done} pending`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Task List & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        
        {/* Toolbar: Search & Dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, subjects, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject & Priority Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 font-bold bg-white"
            >
              <option value="All">All Subjects</option>
              {SUBJECTS.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 font-bold bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
          </div>

        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {[
            { id: 'All', label: `All (${tasks.length})` },
            { id: 'Today', label: 'Today' },
            { id: 'Upcoming', label: 'Upcoming' },
            { id: 'In Progress', label: `Pending (${pendingTasksCount})` },
            { id: 'Completed', label: `Completed (${completedTasksCount})` },
            { id: 'Overdue', label: 'Overdue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cross-Check & Completion Status Banner */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          completedTasksCount === totalTasksCount && totalTasksCount > 0
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              completedTasksCount > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black">
                {completionBannerMsg
                  ? completionBannerMsg
                  : completedTasksCount === totalTasksCount && totalTasksCount > 0
                  ? `🎉 All ${totalTasksCount} Scheduled Tasks Cross-Checked & Completed Successfully!`
                  : `Task Cross-Check Status: ${completedTasksCount} of ${totalTasksCount} Tasks Verified & Completed`}
              </p>
              <p className="text-[11px] text-slate-500">
                Click the checkbox or "Cross-Check & Complete" button on any task to cross it out and display its completed statement.
              </p>
            </div>
          </div>

          {pendingTasksCount > 0 && (
            <button
              type="button"
              onClick={() => {
                const nowIso = new Date().toISOString();
                setTasks(prev => prev.map(t => ({ ...t, isCompleted: true, completedAt: t.completedAt || nowIso })));
                addXP(pendingTasksCount * 40, "All Tasks Completed! 🏆", `+${pendingTasksCount * 40} XP earned`);
                fireConfetti();
                setCompletionBannerMsg(`🎉 All ${totalTasksCount} Scheduled Lab Tasks have been cross-checked and marked as Completed!`);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shrink-0 transition active:scale-95 shadow-xs"
            >
              ✓ Complete All ({pendingTasksCount})
            </button>
          )}
        </div>

        {/* Task Cards List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-extrabold text-slate-800">No tasks found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedSubject !== 'All' 
                ? 'Try clearing your search query or subject filters.'
                : 'All caught up! Click "Schedule New Task" above to plan your next coding session.'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-extrabold transition"
            >
              + Create a Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate) < now;
              const formattedDate = task.dueDate 
                ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'No date';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border-2 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    task.isCompleted 
                      ? 'bg-emerald-50/35 border-emerald-200 shadow-2xs' 
                      : isOverdue 
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300' 
                        : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-xs'
                  }`}
                >
                  
                  {/* Left: Checkbox + Title + Meta */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`mt-0.5 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition shrink-0 ${
                        task.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 hover:border-emerald-500 bg-white'
                      }`}
                      aria-label={task.isCompleted ? "Mark task incomplete" : "Mark task complete"}
                      title={task.isCompleted ? "Task Completed (Click to undo)" : "Click to cross-check and complete task"}
                    >
                      {task.isCompleted && <CheckCircle className="w-4 h-4 fill-white text-emerald-600" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${SUBJECT_COLORS[task.subject] || 'bg-slate-100 text-slate-700'}`}>
                          {task.subject}
                        </span>
                        
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {task.category || 'Task'}
                        </span>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {task.priority} Priority
                        </span>

                        {task.isCompleted && (
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Cross-Checked & Completed</span>
                          </span>
                        )}

                        {isOverdue && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-extrabold transition ${
                        task.isCompleted
                          ? 'line-through decoration-2 decoration-emerald-600 text-slate-500'
                          : 'text-slate-900'
                      }`}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className={`text-xs line-clamp-2 ${
                          task.isCompleted ? 'line-through decoration-slate-400 text-slate-400' : 'text-slate-500'
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {/* Completed Statement Box */}
                      {task.isCompleted && (
                        <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center justify-between gap-2 text-xs text-emerald-950 font-extrabold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Completed Statement: This task has been cross-checked and verified as completed!</span>
                          </span>
                          <span className="text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded-full shrink-0">
                            +40 XP Earned
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.estimatedMinutes} mins</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {formattedDate}</span>
                        </span>
                        {task.isCompleted && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-extrabold">
                              ✓ Status: Completed & Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Complete Button + Edit/Delete Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 ${
                        task.isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{task.isCompleted ? 'Completed ✓' : 'Cross-Check & Complete'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Add / Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingTask ? 'Edit Scheduled Task' : 'Schedule New Task'}
                  </h3>
                  <p className="text-xs text-slate-500">Plan your studies & set milestones</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTask} className="space-y-4">
              
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Implement C++ Red-Black Tree or Dockerize Web API"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Subject & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Domain *
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white font-medium"
                  >
                    {SUBJECTS.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Activity Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Estimated Minutes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white font-medium"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Duration
                  </label>
                  <select
                    value={formMinutes}
                    onChange={(e) => setFormMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white font-medium"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Study Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific algorithms, PR links, or Dockerfile commands to practice..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Reminder toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reminderCheck"
                  checked={formReminder}
                  onChange={(e) => setFormReminder(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="reminderCheck" className="text-xs font-bold text-slate-700 select-none">
                  Enable offline alarm & study reminder
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition active:scale-95"
                >
                  {editingTask ? 'Save Changes' : 'Schedule Task'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
