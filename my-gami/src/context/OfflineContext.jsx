import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [manualOfflineSim, setManualOfflineSim] = useState(() => {
    return localStorage.getItem('gamilearn_offline_sim') === 'true';
  });

  const [cachedCourses, setCachedCourses] = useState(() => {
    const saved = localStorage.getItem('gamilearn_cached_courses');
    return saved ? JSON.parse(saved) : ["crs-math-01", "crs-agri-03", "crs-dig-05"];
  });

  const [downloadingCourseId, setDownloadingCourseId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [pendingSyncCount, setPendingSyncCount] = useState(() => {
    return parseInt(localStorage.getItem('gamilearn_pending_syncs') || '2', 10);
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Today, 08:30 AM");

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('gamilearn_cached_courses', JSON.stringify(cachedCourses));
  }, [cachedCourses]);

  useEffect(() => {
    localStorage.setItem('gamilearn_pending_syncs', pendingSyncCount.toString());
  }, [pendingSyncCount]);

  useEffect(() => {
    localStorage.setItem('gamilearn_offline_sim', manualOfflineSim);
  }, [manualOfflineSim]);

  const isOnline = browserOnline && !manualOfflineSim;

  const toggleManualOffline = () => {
    setManualOfflineSim(prev => !prev);
  };

  const downloadCourse = (courseId) => {
    if (cachedCourses.includes(courseId)) return;
    setDownloadingCourseId(courseId);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setCachedCourses((current) => [...current, courseId]);
            setDownloadingCourseId(null);
            setDownloadProgress(0);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const removeDownloadedCourse = (courseId) => {
    setCachedCourses((current) => current.filter(id => id !== courseId));
  };

  const recordOfflineQuiz = () => {
    setPendingSyncCount((prev) => prev + 1);
  };

  const syncNow = async () => {
    if (!isOnline || pendingSyncCount === 0) return;
    setIsSyncing(true);
    try {
      const userRaw = localStorage.getItem('gamilearn_user');
      const studentId = userRaw ? JSON.parse(userRaw).id : 'usr-student-01';
      await api.sync.uploadPending(studentId, [
        { eventType: 'OfflineProgressSync', payload: `${pendingSyncCount} offline activities synced`, timestamp: new Date().toISOString() }
      ]);
    } catch (err) {
      console.warn('Offline sync server call error, resolving locally:', err);
    } finally {
      setPendingSyncCount(0);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        manualOfflineSim,
        toggleManualOffline,
        cachedCourses,
        downloadCourse,
        removeDownloadedCourse,
        downloadingCourseId,
        downloadProgress,
        pendingSyncCount,
        recordOfflineQuiz,
        syncNow,
        isSyncing,
        lastSyncTime,
        isCourseDownloaded: (id) => cachedCourses.includes(id)
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOfflineSync() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineProvider');
  }
  return context;
}
