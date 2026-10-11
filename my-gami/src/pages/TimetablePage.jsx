import React, { useState } from 'react';
import { mockTimetable } from '../data/mockTimetable';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Bell, 
  DownloadCloud, 
  X 
} from 'lucide-react';

export default function TimetablePage() {
  const [schedule, setSchedule] = useState(mockTimetable);
  const [selectedDay, setSelectedDay] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newTopic, setNewTopic] = useState('');
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('09:00 AM - 09:45 AM');
  const [offlineReminder, setOfflineReminder] = useState(true);

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSchedule = schedule.filter(item => {
    return selectedDay === 'All' || item.day === selectedDay;
  });

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newEntry = {
      id: `tt-${Date.now()}`,
      day: newDay,
      subject: newSubject,
      topic: newTopic,
      time: newTime,
      room: "Home Study / Offline Tab",
      status: "upcoming",
      color: newSubject === 'Mathematics' ? 'bg-blue-500' :
             newSubject === 'Science' ? 'bg-emerald-500' :
             newSubject === 'Agriculture' ? 'bg-amber-500' :
             newSubject === 'Digital Skills' ? 'bg-purple-500' : 'bg-rose-500',
      badgeColor: 'bg-brand-100 text-brand-800',
      offlineReady: offlineReminder
    };

    setSchedule(prev => [...prev, newEntry]);
    setShowAddModal(false);
    setNewTopic('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Study Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Weekly Study Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Plan your daily routine with offline study reminders that ring even without cellular coverage.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Session</span>
        </button>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition shrink-0 ${
              selectedDay === d
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Schedule Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedule.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {item.day}
                </span>

                <div className="flex items-center gap-2">
                  {item.offlineReady && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <DownloadCloud className="w-3 h-3" /> Offline Cached
                    </span>
                  )}
                  {item.status === 'completed' && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-3.5 h-12 rounded-full ${item.color} shrink-0 mt-0.5`} />
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${item.badgeColor}`}>
                    {item.subject}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {item.topic}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}
                    </span>
                    <span>•</span>
                    <span>{item.room}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Daily target: 45m</span>
              <button 
                onClick={() => alert(`Offline Alarm Reminder set for ${item.topic} on ${item.day} at ${item.time}`)}
                className="text-brand-600 font-bold hover:underline flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Set Offline Alarm</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">
                Add Custom Study Session
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Agriculture">Sustainable Agriculture</option>
                  <option value="English">English</option>
                  <option value="Digital Skills">Digital Literacy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Topic / Lesson</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Solar panel battery calculations"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineReminder}
                  onChange={(e) => setOfflineReminder(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Cache lesson content for offline alarm</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold shadow-sm"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
