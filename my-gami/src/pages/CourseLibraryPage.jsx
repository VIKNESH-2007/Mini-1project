import React, { useState, useEffect } from 'react';
import { mockCourses } from '../data/mockCourses';
import CourseCard from '../components/course/CourseCard';
import { useOfflineSync } from '../context/OfflineContext';
import { Search, DownloadCloud, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function CourseLibraryPage() {
  const { cachedCourses, isOnline } = useOfflineSync();

  const [coursesList, setCoursesList] = useState(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [onlyOffline, setOnlyOffline] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.courses.getAll();
        if (res && res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            id: c.id,
            title: c.title,
            subject: c.subject,
            difficulty: c.difficultyLevel || 'Beginner',
            grade: c.grade || 'Class 6-8',
            language: c.language || 'en',
            rating: c.rating || 4.8,
            studentsCount: c.studentsCount || 1000,
            downloadSize: `${c.downloadableSizeMb || 15} MB`,
            duration: '45 mins',
            isDownloaded: cachedCourses.includes(c.id),
            progress: c.progressPercent || 0,
            description: c.description || '',
            thumbnail: c.thumbnailUrl || 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
            videoUrl: c.videoUrl || '',
            instructor: c.instructor || 'Instructor',
            lessons: (c.modules || []).map((m, idx) => ({
              id: m.id || `m-${idx}`,
              title: m.title,
              duration: m.durationMinutes || '10:00',
              completed: idx === 0
            }))
          }));
          setCoursesList(mapped);
        }
      } catch (err) {
        console.warn('Falling back to cached local course catalog:', err);
      }
    }
    if (isOnline) {
      loadCourses();
    }
  }, [isOnline, cachedCourses]);

  const subjects = ['All', ...Array.from(new Set(coursesList.map(c => c.subject).filter(Boolean)))];

  const filteredCourses = coursesList.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || (course.difficulty || '').toLowerCase().includes(selectedDifficulty.toLowerCase());
    const matchesOffline = !onlyOffline || cachedCourses.includes(course.id);

    return matchesSearch && matchesSubject && matchesDifficulty && matchesOffline;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              Rural Curriculum Library
            </span>
            {!isOnline && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Offline Mode Active
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore Courses & Lessons
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Download interactive study modules once and learn without network disruption.
          </p>
        </div>

        {/* Quick Offline toggle pill */}
        <button
          onClick={() => setOnlyOffline(!onlyOffline)}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 ${
            onlyOffline
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          aria-pressed={onlyOffline}
        >
          <DownloadCloud className="w-4 h-4" />
          <span>{onlyOffline ? "Showing Downloaded Only" : "Show Only Offline Ready"}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${onlyOffline ? 'bg-white/20' : 'bg-slate-100 font-extrabold'}`}>
            {cachedCourses.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Search input + Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search math, organic crops, UPI safety, solar lamps..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Essential">Essential / Practical</option>
            </select>
          </div>
        </div>

        {/* Subject Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedSubject === subj
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800">No courses match your filters</h3>
          <p className="text-xs text-slate-500">
            Try clearing the search query or reset the offline filter to browse all available subjects.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All');
              setSelectedDifficulty('All');
              setOnlyOffline(false);
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
