import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  GraduationCap, 
  School, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  KeyRound
} from 'lucide-react';

export default function PortalGatewayPage() {
  const { switchRole, switchStudentTrack } = useAuth();
  const navigate = useNavigate();

  const handleSelectSelfPacedStudent = () => {
    switchRole('student');
    switchStudentTrack('self');
    navigate('/dashboard');
  };

  const handleSelectCollegeStudent = () => {
    switchRole('student');
    switchStudentTrack('college');
    navigate('/dashboard');
  };

  const handleSelectTeacher = () => {
    switchRole('teacher');
    navigate('/teacher');
  };

  const handleSelectAdmin = () => {
    switchRole('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-black uppercase tracking-wider border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Multi-Portal Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Choose Your Learning & Access Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Independent learners study with our 24/7 AI Teacher, while college & school students are guided by faculty assigned by the Admin. Select your gateway below.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD 1: Self-Paced Student (AI Teacher) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md hover:shadow-xl hover:border-purple-400 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                  <Bot className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  AI Teacher Track
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Self-Paced Learner Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                For independent students who want to study without school boundaries. The <strong>AI Teacher conducts interactive classes</strong>, explains C++, Java, Docker & Git, and answers doubts in regional languages 24/7.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>AI Conducts Classes:</strong> Structured lessons on CS & Programming</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>Instant 24/7 Doubt Solver:</strong> Regional languages (Hindi, Tamil, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>Personalized Task Schedule:</strong> Learn at your own pace offline</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectSelfPacedStudent}
              className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Enter as Self-Paced Student (AI Teacher)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 2: School / College Enrolled Student (Assigned Faculty) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                  <School className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  College Enrolled Track
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                College Enrolled Student Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                For students registered in a college or school. Human <strong>faculty are assigned directly by your institution's Admin</strong>. View professor announcements, submit lab tasks, and follow batch timetables.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Admin-Assigned Faculty:</strong> Guided by designated college professors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Faculty Lab Tasks:</strong> Timely coding assignments & reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Batch Timetable:</strong> Synchronized with college lecture hours</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectCollegeStudent}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Enter as College Enrolled Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 3: Teacher / Faculty Portal */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Faculty Workspace
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Teacher & Faculty Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                For college professors, school educators, and lab instructors. View students assigned to you by the Admin, allocate weekly lab challenges, and broadcast announcements.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Assigned Student Roster:</strong> Track XP, streak & quiz metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Assign Lab Challenges:</strong> Push tasks directly to student planners</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Offline USB Packets:</strong> Bundle syllabus for village clusters</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectTeacher}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Access Teacher / Faculty Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 4: College / School Admin Portal */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  Admin Command
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                College & School Admin Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                Central administration center. <strong>Assign teachers to students and batches</strong>, designate faculty subjects, switch student learning modes, and manage institutional operations.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Teacher Assignment Module:</strong> Map faculty to students & batches</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Track Allocator:</strong> Toggle Self-Paced (AI Teacher) vs Enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Faculty Workload:</strong> Balance students per professor</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectAdmin}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Access College Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Custom Auth / Registration Footer Box */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-black text-lg sm:text-xl text-white flex items-center justify-center sm:justify-start gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Need Custom Credentials or Google Sign-In?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              You can also register a brand new student or faculty account, or sign in securely with your typed username and password.
            </p>
          </div>

          <Link
            to="/auth"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm transition-all shrink-0 shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>Go to Sign In & Registration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
