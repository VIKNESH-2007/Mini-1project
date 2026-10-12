import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  Bot, 
  School, 
  Edit3, 
  CheckCircle, 
  Search, 
  Sparkles,
  X
} from 'lucide-react';

export const initialFacultyList = [
  {
    id: "usr-teacher-01",
    name: "Prof. Senthil Nathan",
    email: "senthil.nathan@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProfSenthil",
    department: "Computer Science & Engineering",
    designation: "Associate Professor & Lab Head",
    subjects: ["C++ Programming", "Java Enterprise Systems", "Data Structures"],
    activeStudents: 24,
    status: "Active"
  },
  {
    id: "usr-teacher-02",
    name: "Dr. Ananya Ray",
    email: "ananya.ray@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DrAnanya",
    department: "Cloud Computing & Systems",
    designation: "Professor & DevOps Lead",
    subjects: ["Docker & Containers", "Cloud Architecture", "Linux Systems"],
    activeStudents: 18,
    status: "Active"
  },
  {
    id: "usr-teacher-03",
    name: "Prof. Rajesh Kulkarni",
    email: "rajesh.kulkarni@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProfRajesh",
    department: "Software Engineering",
    designation: "Assistant Professor",
    subjects: ["C# & .NET Core", "Algorithms Lab", "Database Internals"],
    activeStudents: 15,
    status: "Active"
  },
  {
    id: "usr-teacher-04",
    name: "Prof. Sunita Sharma",
    email: "sunita.sharma@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProfSunita",
    department: "Information Technology",
    designation: "Senior Faculty",
    subjects: ["Git & GitHub Workflows", "Web Technologies", "API Design"],
    activeStudents: 20,
    status: "Active"
  }
];

export const initialStudentRoster = [
  {
    id: "usr-student-01",
    name: "Sanjay",
    email: "sanjay@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
    grade: "B.Tech CS - Year 2",
    learningTrack: "self", // 'self' or 'college'
    assignedTeacherId: "usr-teacher-01",
    assignedTeacherName: "Prof. Senthil Nathan (CS Dept)",
    batchName: "B.Tech CS 2026 - Sec A",
    xp: 1820,
    status: "Active Learner"
  },
  {
    id: "usr-student-02",
    name: "Rishi",
    email: "rishi@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rishi",
    grade: "B.Tech CS - Year 2",
    learningTrack: "college",
    assignedTeacherId: "usr-teacher-01",
    assignedTeacherName: "Prof. Senthil Nathan (CS Dept)",
    batchName: "B.Tech CS 2026 - Sec A",
    xp: 2450,
    status: "Active Learner"
  },
  {
    id: "usr-student-03",
    name: "Saran",
    email: "saran@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Saran",
    grade: "B.Tech CS - Year 2",
    learningTrack: "self",
    assignedTeacherId: null,
    assignedTeacherName: "AI Master Tutor",
    batchName: "Self-Paced Track",
    xp: 2280,
    status: "Active Learner"
  },
  {
    id: "usr-student-04",
    name: "Karthik",
    email: "karthik@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Karthik",
    grade: "B.Tech CS - Year 1",
    learningTrack: "college",
    assignedTeacherId: "usr-teacher-02",
    assignedTeacherName: "Dr. Ananya Ray (Cloud & DevOps)",
    batchName: "B.Tech CS 2026 - Sec B",
    xp: 1640,
    status: "Active Learner"
  },
  {
    id: "usr-student-05",
    name: "Kavitha",
    email: "kavitha@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kavitha",
    grade: "B.Tech CS - Year 2",
    learningTrack: "self",
    assignedTeacherId: null,
    assignedTeacherName: "AI Master Tutor",
    batchName: "Self-Paced Track",
    xp: 1950,
    status: "Active Learner"
  }
];

export default function AdminPortalPage() {
  const { currentUser, updateTeacherAssignment } = useAuth();

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('gamilearn_admin_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.some(s => s.name === "Karan Verma" || s.name === "Aarav Sharma")) {
          return initialStudentRoster;
        }
        return parsed;
      }
    } catch (e) {}
    return initialStudentRoster;
  });

  const [faculty] = useState(initialFacultyList);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('all'); // 'all', 'self', 'college'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Modal form states
  const [modalTrack, setModalTrack] = useState('college');
  const [modalTeacherId, setModalTeacherId] = useState('usr-teacher-01');
  const [modalBatch, setModalBatch] = useState('B.Tech CS 2026 - Sec A');

  // Persist student roster
  useEffect(() => {
    localStorage.setItem('gamilearn_admin_students', JSON.stringify(students));
  }, [students]);

  const handleOpenAssignModal = (student) => {
    setSelectedStudent(student);
    setModalTrack(student.learningTrack || 'college');
    setModalTeacherId(student.assignedTeacherId || 'usr-teacher-01');
    setModalBatch(student.batchName || 'B.Tech CS 2026 - Sec A');
    setIsModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedStudent) return;

    const chosenFaculty = faculty.find(f => f.id === modalTeacherId);
    const assignedName = modalTrack === 'self' 
      ? 'AI Master Tutor' 
      : (chosenFaculty ? `${chosenFaculty.name} (${chosenFaculty.department.split('&')[0].trim()})` : 'Assigned Faculty');

    const updatedStudents = students.map(st => {
      if (st.id === selectedStudent.id) {
        return {
          ...st,
          learningTrack: modalTrack,
          assignedTeacherId: modalTrack === 'self' ? null : modalTeacherId,
          assignedTeacherName: assignedName,
          batchName: modalTrack === 'self' ? 'Self-Paced Track' : modalBatch
        };
      }
      return st;
    });

    setStudents(updatedStudents);

    // If the currently logged in student is being assigned/updated, sync them immediately
    if (currentUser?.id === selectedStudent.id) {
      updateTeacherAssignment({
        learningTrack: modalTrack,
        teacherId: modalTrack === 'self' ? null : modalTeacherId,
        teacherName: assignedName,
        batchName: modalTrack === 'self' ? 'Self-Paced Track' : modalBatch
      });
    }

    setIsModalOpen(false);
    setSuccessToast(`Successfully updated assignment for ${selectedStudent.name}!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = filterTrack === 'all' ? true : st.learningTrack === filterTrack;
    return matchesSearch && matchesTrack;
  });

  const selfLearnersCount = students.filter(s => s.learningTrack === 'self').length;
  const collegeLearnersCount = students.filter(s => s.learningTrack === 'college').length;

  return (
    <div className="space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
              College & School Admin
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              Academic Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white">
            Teacher Assignment & Learning Track Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Assign dedicated faculty to enrolled college students, or place independent students in the Self-Paced Track where the <strong>AI Teacher conducts classes 24/7</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-xs">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=AdminAruna" 
            alt="Admin" 
            className="w-12 h-12 rounded-xl bg-white/20 p-1 border border-white/30"
          />
          <div>
            <p className="text-xs font-bold text-white">Dr. Aruna Sengupta</p>
            <p className="text-[11px] text-amber-300 font-medium">Academic Dean & Admin</p>
            <span className="text-[10px] text-slate-300">Institute of Technology & CS</span>
          </div>
        </div>
      </div>

      {/* Success Alert Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Enrolled Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{students.length}</div>
          <span className="text-[11px] font-bold text-brand-600 mt-1 block">Active on campus platform</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs bg-purple-50/30">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">Self-Paced (AI Teacher)</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">{selfLearnersCount}</div>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">Taught by 24/7 AI Teacher</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-blue-200 shadow-xs bg-blue-50/30">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">College Enrolled (Faculty)</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700">{collegeLearnersCount}</div>
          <span className="text-[11px] font-bold text-blue-600 mt-1 block">Assigned to Professors</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active College Faculty</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{faculty.length}</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Across 4 Engineering Depts</span>
        </div>

      </div>

      {/* Student Management & Assignment Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>Student Roster & Teacher Assignment Status</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage whether each student learns via AI Teacher (Self-Paced) or is assigned to a university faculty member.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or email..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-48 sm:w-56"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setFilterTrack('all')}
                className={`px-2.5 py-1 rounded-lg transition ${filterTrack === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilterTrack('self')}
                className={`px-2.5 py-1 rounded-lg transition ${filterTrack === 'self' ? 'bg-purple-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
              >
                AI Self ({selfLearnersCount})
              </button>
              <button
                onClick={() => setFilterTrack('college')}
                className={`px-2.5 py-1 rounded-lg transition ${filterTrack === 'college' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
              >
                Enrolled ({collegeLearnersCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Program / Grade</th>
                <th className="p-4">Learning Track</th>
                <th className="p-4">Assigned Instructor</th>
                <th className="p-4">Batch / Section</th>
                <th className="p-4">Progress XP</th>
                <th className="p-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.map((st) => (
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

                  <td className="p-4 font-semibold text-slate-700">
                    {st.grade}
                  </td>

                  <td className="p-4">
                    {st.learningTrack === 'self' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                        <span>Self-Paced (AI Teacher)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        <School className="w-3.5 h-3.5 text-blue-600" />
                        <span>College Enrolled</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-extrabold">
                    {st.learningTrack === 'self' ? (
                      <span className="text-purple-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Master Tutor (24/7)
                      </span>
                    ) : (
                      <span className="text-blue-900 font-bold flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                        {st.assignedTeacherName}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-slate-600 font-medium">
                    {st.batchName}
                  </td>

                  <td className="p-4 font-black text-brand-600">
                    {st.xp} XP
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(st)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 border border-slate-200 hover:border-brand-300 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Assign / Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* College Faculty Directory Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>Registered College Faculty Directory & Workload</span>
            </h3>
            <p className="text-xs text-slate-500">
              Department professors available for student allocation in engineering disciplines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {faculty.map((prof) => (
            <div key={prof.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={prof.avatar} 
                  alt={prof.name} 
                  className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-0.5 object-cover"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{prof.name}</h4>
                  <p className="text-[10px] text-slate-500">{prof.designation}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">{prof.department}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {prof.subjects.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Assigned Students:</span>
                <span className="font-black text-brand-600">{prof.activeStudents}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Assignment Modal Dialog */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Admin Assignment Tool
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  Assign Teacher for {selectedStudent.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Info Pill */}
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-200">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-10 h-10 rounded-full border border-slate-300" />
              <div className="text-xs">
                <p className="font-extrabold text-slate-900">{selectedStudent.name}</p>
                <p className="text-slate-500">{selectedStudent.email} • {selectedStudent.grade}</p>
              </div>
            </div>

            {/* Step 1: Select Learning Mode */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                1. Select Learning Track
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Track Option A: Self-Paced (AI Teacher) */}
                <button
                  type="button"
                  onClick={() => setModalTrack('self')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                    modalTrack === 'self' 
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Bot className={`w-5 h-5 ${modalTrack === 'self' ? 'text-purple-600' : 'text-slate-400'}`} />
                    {modalTrack === 'self' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                  </div>
                  <span className="font-extrabold text-xs block">Self-Paced Track</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                    AI Teacher conducts classes & doubts 24/7
                  </span>
                </button>

                {/* Track Option B: College Enrolled (Assign Faculty) */}
                <button
                  type="button"
                  onClick={() => setModalTrack('college')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                    modalTrack === 'college' 
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <School className={`w-5 h-5 ${modalTrack === 'college' ? 'text-blue-600' : 'text-slate-400'}`} />
                    {modalTrack === 'college' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="font-extrabold text-xs block">College Enrolled</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                    Assign dedicated human faculty
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: If College Enrolled, Pick Faculty and Batch */}
            {modalTrack === 'college' ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    2. Assign Faculty Member
                  </label>
                  <select
                    value={modalTeacherId}
                    onChange={(e) => setModalTeacherId(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.department} ({f.subjects.slice(0, 2).join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                    3. Allocate Batch / Section
                  </label>
                  <select
                    value={modalBatch}
                    onChange={(e) => setModalBatch(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="B.Tech CS 2026 - Sec A">B.Tech CS 2026 - Section A (C++ & DSA)</option>
                    <option value="B.Tech CS 2026 - Sec B">B.Tech CS 2026 - Section B (Java & Cloud)</option>
                    <option value="B.Tech CS 2026 - Lab Group 1">B.Tech CS 2026 - Lab Group 1 (Docker & DevOps)</option>
                    <option value="B.Tech IT 2026 - Sec C">B.Tech IT 2026 - Section C (Full Stack)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>AI Teacher Conducts Classes Automatically</span>
                </p>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  The student will be guided by the autonomous 24/7 AI Teacher. The AI tutor handles C++, Java, C#, Docker lectures, interactive code checks, and doubt resolution.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignment}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md shadow-brand-200 transition active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save & Update Assignment</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
