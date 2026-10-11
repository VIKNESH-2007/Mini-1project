import React from 'react';
import { Link } from 'react-router-dom';
import { useOfflineSync } from '../../context/OfflineContext';
import ProgressBar from '../common/ProgressBar';
import { DownloadCloud, Check, Clock, Star, Play, HardDrive, RefreshCw } from 'lucide-react';

export default function CourseCard({ course }) {
  const { isCourseDownloaded, downloadCourse, downloadingCourseId, downloadProgress } = useOfflineSync();

  const isDownloaded = isCourseDownloaded(course.id);
  const isCurrentlyDownloading = downloadingCourseId === course.id;

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadCourse(course.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Thumbnail & Tags */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Subject badge */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${course.subjectColor}`}>
              {course.subject}
            </span>
          </div>

          {/* Download offline button / indicator */}
          <div className="absolute top-3 right-3">
            {isDownloaded ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline Ready</span>
              </span>
            ) : isCurrentlyDownloading ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{downloadProgress}%</span>
              </span>
            ) : (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 hover:bg-white transition shadow-md active:scale-95"
                title={`Download ${course.downloadSize} for offline study`}
                aria-label={`Download ${course.title} for offline`}
              >
                <DownloadCloud className="w-3.5 h-3.5 text-brand-600" />
                <span>{course.downloadSize}</span>
              </button>
            )}
          </div>

          {/* Duration & Rating */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Clock className="w-3 h-3 text-brand-300" />
              <span>{course.duration}</span>
            </span>
            <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs text-amber-300">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{course.rating}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{course.grade}</span>
            <span>•</span>
            <span>{course.difficulty}</span>
            <span>•</span>
            <span className="text-brand-600 font-bold">{course.instructor}</span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* Footer & Progress */}
      <div className="p-4 pt-0 space-y-3">
        {course.progress > 0 && (
          <ProgressBar 
            value={course.progress} 
            max={100} 
            label="Progress"
            heightClass="h-2"
            colorClass="bg-brand-500"
          />
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.lessons?.length || 4} lessons</span>
          </div>

          <Link
            to={`/course/${course.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{course.progress > 0 ? "Continue" : "Start Lesson"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
