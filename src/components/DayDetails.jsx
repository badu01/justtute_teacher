import React, { useState } from 'react';
import { Edit2, Clock, Trash2, ChevronLeft, ChevronRight, Save, X, Plus } from 'lucide-react';

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls = "w-full bg-black border-2 border-zinc-800 text-white text-sm p-3 focus:border-yellow-400 focus:outline-none transition-colors duration-150 placeholder-zinc-600 font-light";
const labelCls = "text-[10px] font-bold tracking-[0.2em] text-yellow-400 uppercase block mb-1.5";

const DayDetails = ({
  date, events, isEditing, onEditToggle,
  onCreateSession, onUpdateSession, onDeleteSession,
  students, currentSessionIndex, onSessionIndexChange
}) => {
  const [editingSession, setEditingSession] = useState(null);
  const [newSession, setNewSession] = useState({ studentId: '', subject: '', topic: '', startTime: '09:00', endTime: '10:00' });
  const [loading, setLoading] = useState(false);

  const currentSession = events[currentSessionIndex];

  const formatTimeForDisplay = (isoTime) => {
    const t = new Date(isoTime);
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleNextSession = () => {
    if (currentSessionIndex < events.length - 1) { onSessionIndexChange(currentSessionIndex + 1); setEditingSession(null); }
  };
  const handlePrevSession = () => {
    if (currentSessionIndex > 0) { onSessionIndexChange(currentSessionIndex - 1); setEditingSession(null); }
  };

  const handleSave = async () => {
    if (!editingSession) return;
    setLoading(true);
    const success = await onUpdateSession(editingSession._id, {
      studentId: editingSession.studentId, subject: editingSession.subject,
      topic: editingSession.topic || '', startTime: editingSession.startTime, endTime: editingSession.endTime
    });
    setLoading(false);
    if (success) setEditingSession(null);
  };

  const handleDelete = async () => {
    if (!currentSession) return;
    if (window.confirm('Delete this session?')) {
      setLoading(true);
      await onDeleteSession(currentSession._id);
      setLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (newSession.studentId && newSession.subject && newSession.startTime && newSession.endTime) {
      setLoading(true);
      const success = await onCreateSession(newSession);
      setLoading(false);
      if (success) setNewSession({ studentId: '', subject: '', topic: '', startTime: '09:00', endTime: '10:00' });
    }
  };

  const dayNum = date.getDate();
  const dayName = date.toLocaleDateString([], { weekday: 'long' });
  const monthName = date.toLocaleDateString([], { month: 'long', year: 'numeric' });

  return (
    <div className="bg-zinc-950 h-full w-full flex flex-col border-l border-zinc-900"
      style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── Header strip ── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-zinc-900 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.25em] text-zinc-700 uppercase">{monthName}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-white leading-none">{dayNum}</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{dayName}</span>
          </div>
        </div>

        {/* Edit toggle */}
        <button onClick={onEditToggle} disabled={loading}
          className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold tracking-widest transition-all border-2 ${
            isEditing
              ? 'bg-yellow-400 border-yellow-400 text-black'
              : 'border-zinc-800 text-zinc-500 hover:border-yellow-400 hover:text-yellow-400'
          } disabled:opacity-50`}>
          <Edit2 className="w-3 h-3" />
          {isEditing ? 'EDITING' : 'EDIT'}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto p-5">

        {/* ── NO SESSIONS ── */}
        {events.length === 0 && editingSession !== 'new' && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 border-2 border-zinc-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-light">No sessions scheduled</p>
              <p className="text-zinc-700 text-[10px] mt-1">for this day</p>
            </div>
            {isEditing && (
              <button onClick={() => setEditingSession('new')}
                className="mt-2 px-6 py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors">
                + ADD FIRST SESSION
              </button>
            )}
          </div>
        )}

        {/* ── CREATE NEW SESSION FORM ── */}
        {editingSession === 'new' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-yellow-400" />
              <p className="text-white font-black text-sm">New Session</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Student <span className="text-yellow-400">✦</span></label>
                <div className="relative">
                  <select value={newSession.studentId} onChange={(e) => setNewSession({ ...newSession, studentId: e.target.value })}
                    className={inputCls + " appearance-none pr-8"} required>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <ChevronRight className="w-3 h-3 rotate-90 text-yellow-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Subject <span className="text-yellow-400">✦</span></label>
                <input type="text" value={newSession.subject} onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                  className={inputCls} placeholder="e.g. Biology" />
              </div>
              <div>
                <label className={labelCls}>Start Time <span className="text-yellow-400">✦</span></label>
                <input type="time" value={newSession.startTime} onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                  className={inputCls + " [color-scheme:dark]"} />
              </div>
              <div>
                <label className={labelCls}>End Time <span className="text-yellow-400">✦</span></label>
                <input type="time" value={newSession.endTime} onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                  className={inputCls + " [color-scheme:dark]"} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Topic</label>
              <input type="text" value={newSession.topic} onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                className={inputCls} placeholder="Topic for this session (optional)" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingSession(null)}
                className="flex-1 py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all flex items-center justify-center gap-2">
                <X className="w-3 h-3" /> CANCEL
              </button>
              <button onClick={handleAddSession}
                disabled={loading || !newSession.studentId || !newSession.subject}
                className="flex-1 py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> CREATING</> : <><Save className="w-3 h-3" /> CREATE</>}
              </button>
            </div>
          </div>
        )}

        {/* ── EDIT EXISTING SESSION ── */}
        {editingSession && editingSession !== 'new' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-yellow-400" />
              <p className="text-white font-black text-sm">Edit Session</p>
            </div>

            <div>
              <label className={labelCls}>Student</label>
              <div className="relative">
                <select value={editingSession.studentId}
                  onChange={(e) => {
                    const s = students.find(st => st._id === e.target.value);
                    setEditingSession({ ...editingSession, studentId: e.target.value, studentName: s?.name || editingSession.studentName });
                  }}
                  className={inputCls + " appearance-none pr-8"}>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <ChevronRight className="w-3 h-3 rotate-90 text-yellow-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Subject</label>
              <input type="text" value={editingSession.subject}
                onChange={(e) => setEditingSession({ ...editingSession, subject: e.target.value })}
                className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Time</label>
                <input type="time"
                  value={editingSession.startTime ? new Date(editingSession.startTime).toTimeString().substring(0, 5) : ''}
                  onChange={(e) => {
                    const d = new Date(editingSession.startTime);
                    const [h, m] = e.target.value.split(':');
                    d.setHours(parseInt(h), parseInt(m));
                    setEditingSession({ ...editingSession, startTime: d.toISOString() });
                  }}
                  className={inputCls + " [color-scheme:dark]"} />
              </div>
              <div>
                <label className={labelCls}>End Time</label>
                <input type="time"
                  value={editingSession.endTime ? new Date(editingSession.endTime).toTimeString().substring(0, 5) : ''}
                  onChange={(e) => {
                    const d = new Date(editingSession.endTime);
                    const [h, m] = e.target.value.split(':');
                    d.setHours(parseInt(h), parseInt(m));
                    setEditingSession({ ...editingSession, endTime: d.toISOString() });
                  }}
                  className={inputCls + " [color-scheme:dark]"} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Topic</label>
              <input type="text" value={editingSession.topic || ''}
                onChange={(e) => setEditingSession({ ...editingSession, topic: e.target.value })}
                className={inputCls} placeholder="Topic for this session" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingSession(null)} disabled={loading}
                className="flex-1 py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <X className="w-3 h-3" /> CANCEL
              </button>
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> SAVING</> : <><Save className="w-3 h-3" /> SAVE</>}
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW SESSION ── */}
        {events.length > 0 && !editingSession && (
          <div className="h-full flex flex-col justify-between">

            {/* Session card */}
            <div className="flex-1 space-y-6">
              {/* Student name */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-1">Student</p>
                  <p className="text-xl font-black text-white">{currentSession?.studentName}</p>
                </div>
                {isEditing && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditingSession({ ...currentSession })}
                      className="w-8 h-8 border-2 border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleDelete}
                      className="w-8 h-8 border-2 border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-red-500 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-1">Subject</p>
                <p className="text-2xl font-black text-white">{currentSession?.subject}</p>
              </div>

              {/* Time */}
              <div>
                <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-2">Time</p>
                <div className="flex items-center gap-2 border border-zinc-900 bg-black px-4 py-3 w-fit">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold text-sm">
                    {formatTimeForDisplay(currentSession?.startTime)} – {formatTimeForDisplay(currentSession?.endTime)}
                  </span>
                </div>
              </div>

              {/* Topic if present */}
              {currentSession?.topic && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-1">Topic</p>
                  <p className="text-white text-sm font-light">{currentSession.topic}</p>
                </div>
              )}
            </div>

            {/* Session navigator */}
            <div className="flex-shrink-0 pt-4 border-t border-zinc-900 flex items-center justify-between">
              <button onClick={handlePrevSession} disabled={currentSessionIndex === 0 || loading}
                className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-3 h-3" /> PREV
              </button>
              <span className="text-zinc-700 text-[10px] font-bold tracking-widest">
                {currentSessionIndex + 1} <span className="text-zinc-800">/</span> {events.length}
              </span>
              <button onClick={handleNextSession} disabled={currentSessionIndex === events.length - 1 || loading}
                className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                NEXT <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add session button ── */}
      {isEditing && !editingSession && events.length > 0 && (
        <div className="flex-shrink-0 px-5 pb-5">
          <button onClick={() => setEditingSession('new')}
            className="w-full py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all flex items-center justify-center gap-2">
            <Plus className="w-3 h-3" /> ADD ANOTHER SESSION
          </button>
        </div>
      )}
    </div>
  );
};

export default DayDetails;