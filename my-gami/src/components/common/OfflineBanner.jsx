import React from 'react';
import { useOfflineSync } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle, Database } from 'lucide-react';

export default function OfflineBanner() {
  const { 
    isOnline, 
    manualOfflineSim, 
    toggleManualOffline, 
    cachedCourses, 
    pendingSyncCount, 
    syncNow, 
    isSyncing,
    lastSyncTime 
  } = useOfflineSync();
  const { t } = useLanguage();

  return (
    <div 
      className={`w-full text-xs sm:text-sm font-medium transition-colors border-b px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-40 ${
        isOnline 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
          : 'bg-amber-500 text-white border-amber-600 shadow-sm'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 font-semibold">
          {isOnline ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>{t('onlineMode')}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-white animate-pulse" />
              <span className="font-bold">{t('offlineMode')}</span>
            </>
          )}
        </div>

        <span className="hidden sm:inline text-opacity-70">•</span>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5" />
            <span>{cachedCourses.length} {t('downloaded')}</span>
          </span>

          {pendingSyncCount > 0 ? (
            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
              isOnline ? 'bg-amber-100 text-amber-800' : 'bg-white/20 text-white'
            }`}>
              {pendingSyncCount} {t('syncPending')}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] opacity-90">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('allSynced')} ({lastSyncTime})</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isOnline && pendingSyncCount > 0 && (
          <button
            onClick={syncNow}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
            aria-label="Sync pending data now"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? t('Syncing...') : t('Sync Now')}</span>
          </button>
        )}

        <button
          onClick={toggleManualOffline}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition active:scale-95 border ${
            isOnline 
              ? 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100' 
              : 'bg-white text-amber-900 border-white hover:bg-amber-50'
          }`}
          title="Toggle between simulating rural offline conditions or online sync"
        >
          {manualOfflineSim ? t("Go Online") : t("Simulate Rural Offline")}
        </button>
      </div>
    </div>
  );
}
