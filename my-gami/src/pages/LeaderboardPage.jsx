import React, { useState, useEffect } from 'react';
import { mockLeaderboard } from '../data/mockLeaderboard';
import { Trophy, Flame, Zap, Award, School, Medal } from 'lucide-react';
import { api } from '../services/api';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [viewType, setViewType] = useState('individual'); // 'individual' or 'teams'
  const [boardData, setBoardData] = useState(mockLeaderboard);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const periodMap = { weekly: 'Weekly', monthly: 'Monthly', allTime: 'AllTime' };
        const res = await api.gamification.getLeaderboard(periodMap[timeframe] || 'Weekly');
        if (res && res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(item => ({
            id: item.studentId,
            name: item.studentName,
            avatar: item.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Learner',
            school: item.schoolName,
            village: item.district,
            xp: item.xpPoints,
            rank: item.rank,
            streak: item.streak,
            level: item.level,
            badge: item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : '⭐'
          }));
          setBoardData(prev => ({ ...prev, [timeframe]: mapped }));
        }
      } catch (err) {
        console.warn('Leaderboard API unreachable; using cached snapshot:', err);
      }
    }
    loadLeaderboard();
  }, [timeframe]);

  const currentList = boardData[timeframe] || mockLeaderboard[timeframe] || mockLeaderboard.weekly;
  const topThree = currentList.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Regional Hall of Fame
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Village & Inter-School Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Celebrate consistent learning and peer milestones across remote communities.
          </p>
        </div>

        {/* Individual vs School Team switch */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 w-fit">
          <button
            onClick={() => setViewType('individual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              viewType === 'individual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setViewType('teams')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              viewType === 'teams'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            School Teams
          </button>
        </div>
      </div>

      {/* Individual View */}
      {viewType === 'individual' && (
        <>
          {/* Timeframe Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'weekly', label: 'This Week' },
              { id: 'monthly', label: 'This Month' },
              { id: 'allTime', label: 'All Time' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                  timeframe === tab.id
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium Visual */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-8">
              Top 3 Scholars This {timeframe === 'weekly' ? 'Week' : timeframe === 'monthly' ? 'Month' : 'Year'}
            </h3>

            {/* Podium layout */}
            <div className="flex items-end justify-center gap-2 sm:gap-6 max-w-lg mx-auto pt-8">
              
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={topThree[1].avatar}
                      alt={topThree[1].name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-slate-300 bg-slate-700 shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-900 text-xs font-black flex items-center justify-center border-2 border-slate-700">
                      2
                    </div>
                  </div>
                  <p className="font-extrabold text-xs sm:text-sm text-center truncate max-w-[100px]">
                    {topThree[1].name.split(' ')[0]}
                  </p>
                  <span className="text-[11px] text-slate-300 font-bold">
                    {topThree[1].xp} XP
                  </span>
                  
                  {/* Podium Base */}
                  <div className="w-full bg-gradient-to-t from-slate-700 to-slate-600 h-28 sm:h-32 rounded-t-2xl mt-3 flex flex-col items-center justify-center p-2 border-t-2 border-slate-400">
                    <Medal className="w-6 h-6 text-slate-300" />
                    <span className="text-xs font-black text-slate-200 mt-1">2nd</span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold - Highest) */}
              {topThree[0] && (
                <div className="flex-1 flex flex-col items-center z-10 -mt-6">
                  <div className="text-2xl mb-1 animate-bounce">👑</div>
                  <div className="relative mb-2">
                    <img
                      src={topThree[0].avatar}
                      alt={topThree[0].name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-amber-400 bg-amber-950 shadow-2xl ring-4 ring-amber-400/30 object-cover"
                    />
                    <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center border-2 border-slate-900 shadow-sm">
                      1
                    </div>
                  </div>
                  <p className="font-black text-sm sm:text-base text-amber-300 text-center truncate max-w-[120px]">
                    {topThree[0].name.split(' ')[0]}
                  </p>
                  <span className="text-xs text-amber-200 font-extrabold">
                    {topThree[0].xp} XP
                  </span>

                  {/* Podium Base */}
                  <div className="w-full bg-gradient-to-t from-amber-600 to-yellow-500 h-36 sm:h-44 rounded-t-2xl mt-3 flex flex-col items-center justify-center p-2 border-t-4 border-amber-300 shadow-lg shadow-amber-500/20">
                    <Trophy className="w-8 h-8 text-amber-950 fill-amber-950" />
                    <span className="text-sm font-black text-amber-950 mt-1">1st</span>
                    <span className="text-[10px] uppercase font-extrabold text-amber-900">Champion</span>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={topThree[2].avatar}
                      alt={topThree[2].name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-amber-700 bg-slate-700 shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 text-xs font-black flex items-center justify-center border-2 border-slate-700">
                      3
                    </div>
                  </div>
                  <p className="font-extrabold text-xs sm:text-sm text-center truncate max-w-[100px]">
                    {topThree[2].name.split(' ')[0]}
                  </p>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {topThree[2].xp} XP
                  </span>

                  {/* Podium Base */}
                  <div className="w-full bg-gradient-to-t from-slate-700 to-amber-900 h-24 sm:h-28 rounded-t-2xl mt-3 flex flex-col items-center justify-center p-2 border-t-2 border-amber-600">
                    <Award className="w-6 h-6 text-amber-500" />
                    <span className="text-xs font-black text-amber-300 mt-1">3rd</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Full Ranked Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-500 uppercase tracking-wider">
              Complete Ranking List
            </div>

            <div className="divide-y divide-slate-100">
              {currentList.map((st) => (
                <div
                  key={st.rank}
                  className={`p-4 flex items-center justify-between gap-3 transition ${
                    st.isCurrentUser ? 'bg-brand-50/80 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      st.rank === 1 ? 'bg-amber-100 text-amber-800' :
                      st.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      st.rank === 3 ? 'bg-amber-200 text-amber-950' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      #{st.rank}
                    </span>

                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white object-cover"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {st.name}
                        </span>
                        {st.isCurrentUser && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500 text-white">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">
                        {st.school} • {st.village}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 text-right">
                    {/* Streak Flame */}
                    <div className="hidden sm:flex items-center gap-1 text-orange-600 font-bold text-xs">
                      <Flame className="w-4 h-4 fill-orange-500" />
                      <span>{st.streak}d</span>
                    </div>

                    {/* Level */}
                    <div className="text-xs text-slate-500 font-bold hidden md:block">
                      Lvl {st.level}
                    </div>

                    {/* XP Points */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 font-black text-sm text-brand-700">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{st.xp}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Total XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* School Teams View */}
      {viewType === 'teams' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
          <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-500 uppercase tracking-wider flex justify-between">
            <span>School Learning Teams</span>
            <span>Cumulative Village XP</span>
          </div>

          {mockLeaderboard.schoolTeams.map((team) => (
            <div
              key={team.rank}
              className={`p-5 flex items-center justify-between gap-4 transition ${
                team.isCurrentTeam ? 'bg-brand-50/80 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-sm">
                  #{team.rank}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-black text-base text-slate-900">{team.teamName}</h4>
                  <p className="text-xs text-slate-500">
                    {team.village} • {team.members} Active Students • Avg Streak: {team.avgStreak} days
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-brand-600 block">
                  {team.totalXP.toLocaleString()} XP
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Club Score</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
