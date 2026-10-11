import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full h-44 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-5/6 bg-slate-200 rounded" />
      <div className="h-4 w-2/3 bg-slate-100 rounded" />
      <div className="space-y-2.5 pt-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 w-full bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'course', count = 3 }) {
  if (type === 'course') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (type === 'quiz') {
    return <QuizSkeleton />;
  }
  return <TableRowSkeleton count={count} />;
}
